import { ref, computed } from 'vue'

const STORAGE_KEY_CHECKINS = 'jinling_checkins'
const STORAGE_KEY_FAVORITES = 'jinling_favorites'
const STORAGE_KEY_NOTES = 'jinling_notes'

export function useCheckIn() {
  const checkins = ref(new Set(loadFromStorage(STORAGE_KEY_CHECKINS)))
  const favorites = ref(new Set(loadFromStorage(STORAGE_KEY_FAVORITES)))
  const notes = ref(loadFromStorage(STORAGE_KEY_NOTES) || {})

  function loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : (key === STORAGE_KEY_NOTES ? {} : [])
    } catch {
      return key === STORAGE_KEY_NOTES ? {} : []
    }
  }

  function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data instanceof Set ? [...data] : data))
  }

  // 打卡
  function toggleCheckin(shopId) {
    const s = new Set(checkins.value)
    if (s.has(shopId)) {
      s.delete(shopId)
    } else {
      s.add(shopId)
    }
    checkins.value = s
    saveToStorage(STORAGE_KEY_CHECKINS, s)
  }

  function isCheckedIn(shopId) {
    return checkins.value.has(shopId)
  }

  function getCheckinCount() {
    return checkins.value.size
  }

  // 收藏
  function toggleFavorite(shopId) {
    const s = new Set(favorites.value)
    if (s.has(shopId)) {
      s.delete(shopId)
    } else {
      s.add(shopId)
    }
    favorites.value = s
    saveToStorage(STORAGE_KEY_FAVORITES, s)
  }

  function isFavorited(shopId) {
    return favorites.value.has(shopId)
  }

  // 笔记
  function saveNote(shopId, note) {
    const n = { ...notes.value }
    if (!n[shopId]) n[shopId] = []
    n[shopId].push({
      id: Date.now(),
      content: note.content || note,
      image: note.image || '',
      date: new Date().toISOString()
    })
    notes.value = n
    saveToStorage(STORAGE_KEY_NOTES, n)
  }

  function getNotes(shopId) {
    return notes.value[shopId] || []
  }

  function deleteNote(shopId, noteId) {
    const n = { ...notes.value }
    if (n[shopId]) {
      n[shopId] = n[shopId].filter(item => item.id !== noteId)
      notes.value = n
      saveToStorage(STORAGE_KEY_NOTES, n)
    }
  }

  // 统计
  const stats = computed(() => ({
    totalCheckins: checkins.value.size,
    totalFavorites: favorites.value.size,
    totalNotes: Object.values(notes.value).reduce((sum, arr) => sum + arr.length, 0)
  }))

  return {
    checkins,
    favorites,
    notes,
    stats,
    toggleCheckin,
    isCheckedIn,
    getCheckinCount,
    toggleFavorite,
    isFavorited,
    saveNote,
    getNotes,
    deleteNote
  }
}
