import { ref, computed } from 'vue'
import { shops, districts, categories } from '@/data/shops.js'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

let apiKey = ''

export function useAI() {
  const thinking = ref(false)
  const lastIntent = ref(null)
  const lastResults = ref([])
  const aiChats = ref([])
  const error = ref('')

  function setApiKey(key) {
    apiKey = key
    localStorage.setItem('nk_deepseek_key', key)
  }

  function getApiKey() {
    if (apiKey) return apiKey
    const saved = localStorage.getItem('nk_deepseek_key')
    if (saved) apiKey = saved
    return apiKey
  }

  function hasApiKey() {
    return !!getApiKey()
  }

  function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function getDistrictName(districtId) {
    const d = districts.find(item => item.id === districtId)
    return d ? d.name : ''
  }

  function getCategoryName(categoryId) {
    const c = categories.find(item => item.id === categoryId)
    return c ? `${c.icon} ${c.name}` : ''
  }

  function parseUserIntent(llmOutput) {
    try {
      let json = llmOutput.trim()
      if (json.startsWith('```')) {
        json = json.replace(/```json|```/g, '').trim()
      }
      return JSON.parse(json)
    } catch (e) {
      return null
    }
  }

  function filterShopsByIntent(intent) {
    if (!intent) return [...shops]

    let result = [...shops]

    if (intent.maxBudget) {
      result = result.filter(s => s.avgPrice <= intent.maxBudget)
    }

    if (intent.category) {
      const catId = categories.find(
        c => c.name === intent.category || c.id === intent.category
      )
      if (catId) {
        result = result.filter(s => s.category === catId.id)
      } else {
        result = result.filter(
          s =>
            s.category === intent.category ||
            (s.tags || []).some(t => t.includes(intent.category)) ||
            (s.flavorTags || []).some(t => t.includes(intent.category))
        )
      }
    }

    if (intent.taste) {
      result = result.filter(
        s =>
          (s.flavorTags || []).some(
            t => t.includes(intent.taste) || intent.taste.includes(t)
          ) ||
          (s.tags || []).some(
            t => t.includes(intent.taste) || intent.taste.includes(t)
          )
      )
    }

    if (intent.scene) {
      result = result.filter(
        s =>
          (s.sceneTags || []).some(
            t => t.includes(intent.scene) || intent.scene.includes(t)
          )
      )
    }

    if (intent.location) {
      const district = districts.find(
        d => d.name === intent.location || d.id === intent.location
      )
      if (district) {
        result = result.filter(s => s.district === district.id)
      } else {
        result = result.filter(
          s =>
            (s.tags || []).some(
              t => t.includes(intent.location) || intent.location.includes(t)
            ) ||
            s.name.includes(intent.location) ||
            s.story.includes(intent.location)
        )
      }
    }

    if (intent.keyword) {
      const kw = intent.keyword.toLowerCase()
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(kw) ||
          (s.tags || []).some(t => t.toLowerCase().includes(kw)) ||
          s.signature.toLowerCase().includes(kw) ||
          (s.flavorTags || []).some(t => t.toLowerCase().includes(kw))
      )
    }

    if (intent.centerLat && intent.centerLng && intent.maxDistance) {
      result = result.filter(
        s =>
          getDistance(intent.centerLat, intent.centerLng, s.lat, s.lng) <=
          intent.maxDistance
      )
    }

    if (result.length === 0) {
      result = [...shops]
    }

    return result.sort((a, b) => {
      if (intent.centerLat && intent.centerLng) {
        return (
          getDistance(intent.centerLat, intent.centerLng, a.lat, a.lng) -
          getDistance(intent.centerLat, intent.centerLng, b.lat, b.lng)
        )
      }
      return b.checkins - a.checkins
    })
  }

  function formatResultText(results, intent) {
    if (results.length === 0) {
      return '暂未找到完全匹配的店铺，试试放宽条件吧。'
    }

    const top = results.slice(0, 5)
    let text = `根据你的需求，为你找到 ${results.length} 家店铺，精选 Top${Math.min(top.length, 5)} 如下：\n\n`

    top.forEach((s, i) => {
      const districtName = getDistrictName(s.district)
      const flavorStr = (s.flavorTags || []).join('·')
      const sceneStr = (s.sceneTags || []).join('·')
      text += `**${i + 1}. ${s.name}**\n`
      text += `  ▸ ${getCategoryName(s.category)} | 人均 ¥${s.avgPrice} | ${districtName}\n`
      text += `  ▸ 招牌：${s.signature}\n`
      text += `  ▸ 口味：${flavorStr} | 适合：${sceneStr}\n`
      if (s.story) {
        text += `  ▸ "${s.story.slice(0, 60)}..."\n`
      }
      text += `\n`
    })

    return text
  }

  async function parseIntentViaLLM(userInput) {
    if (!getApiKey()) {
      throw new Error('NO_API_KEY')
    }

    const districtNames = districts.map(d => d.name).join('、')
    const categoryNames = categories.map(c => c.name).join('、')

    const systemPrompt = `你是一个美食搜索意图解析器。根据用户的自然语言输入，提取结构化搜索条件。只输出JSON，不要任何其他内容。

JSON格式：
{
  "taste": "用户想吃的口味，如：辣、甜、咸、鲜香、清淡、甜咸。没有则null",
  "scene": "场景，如：一人食、聚餐、约会、早餐、午餐、晚餐、下午茶、夜宵、外带。没有则null",
  "category": "品类，可选值：${categoryNames}。没有则null",
  "maxBudget": "人均预算上限数字，如50。没有则null",
  "location": "提到的位置/片区，可选值：${districtNames}。没有则null",
  "keyword": "其他关键词，如店铺名、招牌菜。没有则null"
}`

    const res = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getApiKey()}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.1,
        max_tokens: 300
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      if (res.status === 401) {
        throw new Error('INVALID_KEY')
      }
      throw new Error(`API_ERROR: ${res.status} ${errText}`)
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    return parseUserIntent(content)
  }

  async function ask(userInput) {
    if (!userInput || !userInput.trim()) return

    thinking.value = true
    error.value = ''

    try {
      const intent = await parseIntentViaLLM(userInput)
      lastIntent.value = intent

      const results = filterShopsByIntent(intent)
      lastResults.value = results

      const replyText = formatResultText(results, intent)

      aiChats.value.push({ role: 'user', content: userInput })
      aiChats.value.push({ role: 'assistant', content: replyText, shops: results })

      return { intent, results, text: replyText }
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        error.value = 'NO_API_KEY'
      } else if (err.message === 'INVALID_KEY') {
        error.value = 'INVALID_KEY'
      } else {
        error.value = err.message
        aiChats.value.push({ role: 'user', content: userInput })
        aiChats.value.push({
          role: 'assistant',
          content: '抱歉，AI推荐暂时遇到了点问题，请稍后再试。',
          shops: [],
          isError: true
        })
      }
      return null
    } finally {
      thinking.value = false
    }
  }

  function clearChat() {
    aiChats.value = []
    lastIntent.value = null
    lastResults.value = []
    error.value = ''
  }

  return {
    thinking,
    lastIntent,
    lastResults,
    aiChats,
    error,
    setApiKey,
    getApiKey,
    hasApiKey,
    ask,
    clearChat
  }
}
