<template>
  <div class="ai-chat-root">
    <button
      v-if="!showPanel"
      class="ai-bubble-btn"
      @click="openPanel"
      title="AI美食推荐"
    >
      <span class="ai-bubble-icon">AI</span>
      <span class="ai-bubble-dot" v-if="hasNewTip"></span>
    </button>

    <Transition name="panel">
      <div v-if="showPanel" class="ai-panel vintage-card">
        <div class="ai-panel-header">
          <span class="ai-panel-title">AI 美食推荐</span>
          <button class="ai-panel-close" @click="showPanel = false">x</button>
        </div>

        <div v-if="!hasKey" class="ai-panel-setup">
          <p class="setup-text">请输入你的 DeepSeek API Key 以启用 AI 推荐</p>
          <div class="setup-input-row">
            <input
              v-model="keyInput"
              type="password"
              placeholder="sk-..."
              class="vintage-input"
              @keydown.enter="saveKey"
            />
            <button class="vintage-btn vintage-btn--primary setup-save-btn" @click="saveKey">保存</button>
          </div>
          <p class="setup-hint">
            前往 <a href="https://platform.deepseek.com" target="_blank" rel="noopener">platform.deepseek.com</a> 获取
          </p>
        </div>

        <div v-else-if="invalidKey" class="ai-panel-setup">
          <p class="setup-text setup-error">API Key 无效，请重新输入</p>
          <div class="setup-input-row">
            <input
              v-model="keyInput"
              type="password"
              placeholder="sk-..."
              class="vintage-input"
              @keydown.enter="saveKey"
            />
            <button class="vintage-btn vintage-btn--primary setup-save-btn" @click="saveKey">保存</button>
          </div>
        </div>

        <div v-else class="ai-panel-chat">
          <div class="ai-messages" ref="msgContainer">
            <div v-if="aiChats.length === 0" class="ai-welcome">
              <p>告诉我你想吃什么，我帮你找！</p>
              <div class="ai-suggestions">
                <button
                  v-for="s in suggestions"
                  :key="s"
                  class="ai-suggestion-btn"
                  @click="quickAsk(s)"
                >{{ s }}</button>
              </div>
            </div>

            <div
              v-for="(msg, idx) in aiChats"
              :key="idx"
              :class="['ai-msg', msg.role === 'user' ? 'ai-msg-user' : 'ai-msg-ai']"
            >
              <div class="ai-msg-avatar">
                {{ msg.role === 'user' ? '我' : 'AI' }}
              </div>
              <div class="ai-msg-bubble">
                <div v-if="!msg.isError" class="ai-msg-content" v-html="renderMarkdown(msg.content)"></div>
                <div v-else class="ai-msg-content ai-msg-error">{{ msg.content }}</div>

                <div v-if="msg.shops && msg.shops.length > 0" class="ai-msg-shops">
                  <div
                    v-for="shop in msg.shops.slice(0, 5)"
                    :key="shop.id"
                    class="ai-shop-card"
                    @click="$emit('open-detail', shop)"
                  >
                    <span class="ai-shop-emoji">{{ getIcon(shop.category) }}</span>
                    <div class="ai-shop-info">
                      <span class="ai-shop-name">{{ shop.name }}</span>
                      <span class="ai-shop-meta">{{ getDistrictName(shop.district) }} | ¥{{ shop.avgPrice }}/人</span>
                    </div>
                    <span class="ai-shop-badge">{{ shop.signature }}</span>
                  </div>

                  <button
                    v-if="msg.shops.length > 0"
                    class="ai-show-all-btn"
                    @click="showAllOnMap(msg.shops)"
                  >
                    在地图上查看全部 {{ msg.shops.length }} 家
                  </button>
                </div>
              </div>
            </div>

            <div v-if="thinking" class="ai-msg ai-msg-ai">
              <div class="ai-msg-avatar">AI</div>
              <div class="ai-msg-bubble ai-typing">
                <span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span>
              </div>
            </div>
          </div>

          <div class="ai-input-row">
            <input
              v-model="userInput"
              class="vintage-input ai-input"
              placeholder="比如：想吃辣的，人均50以内，在老门东附近"
              @keydown.enter="send"
              :disabled="thinking"
            />
            <button
              class="vintage-btn vintage-btn--primary ai-send-btn"
              @click="send"
              :disabled="thinking || !userInput.trim()"
            >发送</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, inject } from 'vue'
import { useAI } from '@/composables/useAI.js'
import { categories, districts } from '@/data/shops.js'

const emit = defineEmits(['open-detail', 'show-on-map'])

const injectedCategories = inject('categories', categories)
const injectedDistricts = inject('districts', districts)

const {
  aiChats, thinking, error,
  setApiKey, getApiKey, hasApiKey,
  ask, clearChat
} = useAI()

const showPanel = ref(false)
const hasNewTip = ref(true)
const keyInput = ref('')
const userInput = ref('')
const hasKey = ref(hasApiKey())
const invalidKey = ref(false)
const msgContainer = ref(null)

const suggestions = [
  '想吃辣的，人均50以内',
  '推荐几家适合一个人吃的老字号',
  '下午茶去哪家？要甜的',
  '老门东有什么必吃的？',
  '约会聚餐，人均100左右'
]

function openPanel() {
  showPanel.value = true
  hasNewTip.value = false
  hasKey.value = hasApiKey()
  invalidKey.value = false
}

function saveKey() {
  const k = keyInput.value.trim()
  if (!k) return
  setApiKey(k)
  hasKey.value = true
  invalidKey.value = false
  keyInput.value = ''
}

function getIcon(categoryId) {
  const c = injectedCategories.find(item => item.id === categoryId)
  return c ? c.icon : ''
}

function getDistrictName(districtId) {
  const d = injectedDistricts.find(item => item.id === districtId)
  return d ? d.name : ''
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/▸/g, '<span class="ai-dart">▸</span>')
}

async function send() {
  const input = userInput.value.trim()
  if (!input || thinking.value) return

  userInput.value = ''

  const result = await ask(input)

  if (error.value === 'INVALID_KEY') {
    hasKey.value = false
    invalidKey.value = true
  }

  nextTick(() => {
    scrollToBottom()
  })
}

function quickAsk(q) {
  userInput.value = q
  send()
}

function showAllOnMap(shops) {
  emit('show-on-map', shops)
}

function scrollToBottom() {
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
}

watch(aiChats, () => {
  nextTick(() => scrollToBottom())
})
</script>

<style scoped>
.ai-chat-root {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 900;
}

.ai-bubble-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-rouge), var(--color-rouge-dark));
  border: 2px solid var(--color-rouge-dark);
  box-shadow: var(--shadow-wood), 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.ai-bubble-btn:hover {
  transform: scale(1.08);
  box-shadow: var(--shadow-wood), 0 6px 20px rgba(194,59,59,0.3);
}

.ai-bubble-icon {
  color: var(--color-paper-light);
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: bold;
}

.ai-bubble-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  background: #fbbf24;
  border-radius: 50%;
  border: 2px solid var(--color-paper-light);
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.ai-panel {
  width: 380px;
  max-height: 560px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 !important;
}

.ai-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-ink-wash);
  background: linear-gradient(180deg, var(--color-paper-dark), var(--color-paper-light));
}

.ai-panel-title {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--color-ink);
}

.ai-panel-close {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--color-ink-wash);
  background: none;
  border: 1px solid var(--color-ink-wash);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-panel-close:hover {
  color: var(--color-rouge);
  border-color: var(--color-rouge);
}

.ai-panel-setup {
  padding: 24px 16px;
}

.setup-text {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink-light);
  margin-bottom: 12px;
  line-height: 1.6;
}

.setup-error {
  color: var(--color-rouge);
}

.setup-input-row {
  display: flex;
  gap: 8px;
}

.setup-input-row .vintage-input {
  flex: 1;
}

.setup-save-btn {
  flex-shrink: 0;
  padding: 6px 16px;
  font-size: 13px;
}

.setup-hint {
  margin-top: 10px;
  font-size: 11px;
  color: var(--color-ink-wash);
}

.setup-hint a {
  color: var(--color-ink);
  text-decoration: underline;
}

.ai-panel-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 8px;
  max-height: 380px;
}

.ai-welcome {
  padding: 20px 0;
  text-align: center;
}

.ai-welcome p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink-light);
  margin-bottom: 16px;
}

.ai-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.ai-suggestion-btn {
  padding: 5px 12px;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-ink);
  background: var(--color-paper-dark);
  border: 1px solid var(--color-wood);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-suggestion-btn:hover {
  background: var(--color-kraft);
  color: var(--color-paper-light);
  border-color: var(--color-wood-dark);
}

.ai-msg {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.ai-msg-user {
  flex-direction: row-reverse;
}

.ai-msg-avatar {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 11px;
  font-family: var(--font-title);
  border-radius: 50%;
  flex-shrink: 0;
}

.ai-msg-user .ai-msg-avatar {
  background: var(--color-wood);
  color: var(--color-paper-light);
}

.ai-msg-ai .ai-msg-avatar {
  background: var(--color-rouge);
  color: var(--color-paper-light);
}

.ai-msg-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: var(--radius-card);
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.6;
}

.ai-msg-user .ai-msg-bubble {
  background: var(--color-paper-dark);
  color: var(--color-ink);
  border: 1px solid var(--color-wood);
}

.ai-msg-ai .ai-msg-bubble {
  background: var(--color-paper-light);
  color: var(--color-ink);
  border: 1px solid var(--color-ink-wash);
}

.ai-msg-content strong {
  font-family: var(--font-title);
  color: var(--color-ink);
}

.ai-msg-error {
  color: var(--color-rouge);
}

.ai-dart {
  color: var(--color-rouge);
}

.ai-typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}

.ai-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-ink-wash);
  animation: ai-bounce 1.4s infinite both;
}

.ai-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes ai-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.ai-msg-shops {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ai-shop-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--color-paper-dark);
  border: 1px solid var(--color-wood);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-shop-card:hover {
  border-color: var(--color-rouge);
  background: rgba(194,59,59,0.05);
}

.ai-shop-emoji {
  font-size: 18px;
  flex-shrink: 0;
}

.ai-shop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ai-shop-name {
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--color-ink);
}

.ai-shop-meta {
  font-size: 11px;
  color: var(--color-ink-wash);
  margin-top: 1px;
}

.ai-shop-badge {
  font-size: 11px;
  color: var(--color-rouge);
  border: 1px solid var(--color-rouge);
  border-radius: 3px;
  padding: 1px 6px;
  flex-shrink: 0;
}

.ai-show-all-btn {
  margin-top: 6px;
  padding: 8px 0;
  width: 100%;
  font-family: var(--font-title);
  font-size: 13px;
  color: var(--color-rouge);
  background: rgba(194,59,59,0.06);
  border: 1px dashed var(--color-rouge);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-show-all-btn:hover {
  background: rgba(194,59,59,0.12);
}

.ai-input-row {
  padding: 10px 12px;
  border-top: 1px solid var(--color-ink-wash);
  display: flex;
  gap: 8px;
  background: var(--color-paper-dark);
}

.ai-input {
  flex: 1;
  font-size: 13px;
  padding: 6px 12px;
}

.ai-send-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  font-size: 13px;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
