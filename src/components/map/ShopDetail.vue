<template>
  <Teleport to="body">
    <div class="vintage-modal-overlay" @click.self="$emit('close')">
      <div class="vintage-modal shop-detail-modal">
        <button class="vintage-modal-close" @click="$emit('close')">✕</button>

        <!-- 标题区 -->
        <div class="detail-header">
          <h2 class="detail-name">{{ shop.name }}</h2>
          <span
            v-if="shop.year <= 1949"
            class="vintage-seal detail-seal seal-stamp"
          >金陵老店</span>
        </div>

        <!-- 手绘图标 -->
        <div class="detail-icon-area">
          <div class="detail-icon-frame">
            <span class="detail-icon">{{ shopIcon }}</span>
          </div>
        </div>

        <!-- 基础信息 -->
        <div class="detail-info">
          <div class="info-row">
            <span class="info-label">📍 片区</span>
            <span class="info-value">{{ districtName }}老巷</span>
          </div>
          <div class="info-row">
            <span class="info-label">🏛 创立</span>
            <span class="info-value">民国{{ shop.year - 1911 }}年 ({{ shop.year }})</span>
          </div>
          <div class="info-row">
            <span class="info-label">💰 人均</span>
            <span class="info-value">¥{{ shop.avgPrice }} 元</span>
          </div>
          <div class="info-row">
            <span class="info-label">🕐 营业</span>
            <span class="info-value">{{ shop.hours }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">🍽 招牌</span>
            <span class="info-value info-signature">{{ shop.signature }}</span>
          </div>
          <div class="info-tags">
            <span v-for="t in shop.tags" :key="t" class="vintage-tag">{{ t }}</span>
          </div>
        </div>

        <div class="vintage-divider"></div>

        <!-- 民国美食故事 -->
        <div class="detail-story">
          <h4 class="story-title">📰 旧闻小记</h4>
          <p class="story-text">{{ shop.story }}</p>
        </div>

        <div class="vintage-divider"></div>

        <!-- 用户笔记 -->
        <div class="detail-notes">
          <h4 class="story-title">📝 探店笔记</h4>
          <div v-if="notes.length > 0" class="notes-list">
            <div
              v-for="note in notes"
              :key="note.id"
              class="note-item"
            >
              <p class="note-content">{{ note.content }}</p>
              <div class="note-footer">
                <span class="note-date">{{ formatDate(note.date) }}</span>
                <button class="note-delete" @click="$emit('delete-note', note.id)">删除</button>
              </div>
            </div>
          </div>
          <div v-else class="notes-empty">
            暂无笔记，写下你的探店心得吧~
          </div>
        </div>

        <!-- 写笔记 -->
        <div class="note-form">
          <textarea
            v-model="newNote"
            class="vintage-input note-textarea"
            placeholder="在这家店吃了什么？味道如何？有什么想分享的？..."
            rows="3"
          ></textarea>
          <button
            class="vintage-btn"
            :disabled="!newNote.trim()"
            @click="submitNote"
          >
            发表笔记
          </button>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <button
            class="vintage-btn detail-action-btn"
            :class="{ 'vintage-btn--primary': isChecked }"
            @click="$emit('checkin')"
          >
            {{ isChecked ? '✅ 已打卡' : '📍 标记打卡' }}
          </button>
          <button
            class="vintage-btn detail-action-btn"
            @click="toggleFav"
          >
            {{ isFavorited ? '❤️ 已收藏' : '🤍 收藏小店' }}
          </button>
          <button
            class="vintage-btn detail-action-btn"
            @click="$emit('navigate')"
          >
            🛺 步行导航
          </button>
        </div>

        <!-- 统计 -->
        <div class="detail-stats">
          <span>👥 {{ shop.checkins }} 次打卡</span>
          <span>❤️ {{ shop.favorites }} 人收藏</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  shop: Object,
  isChecked: Boolean,
  isFavorited: Boolean,
  notes: Array
})

const emit = defineEmits([
  'close', 'checkin', 'favorite', 'navigate',
  'save-note', 'delete-note'
])

const newNote = ref('')

const categoryIcons = {
  gaotuan: '🥮', yaxue: '🍜', huntun: '🥟',
  luwei: '🍖', chaguan: '🍵', miantu: '🥮',
  tangshui: '🍯', xiaochi: '🥢'
}

const districtNames = {
  laomendong: '老门东', fuzimiao: '夫子庙', kexiang: '科巷',
  nanhu: '南湖', xinanli: '熙南里', yihelu: '颐和路',
  sanqiba: '三七八巷'
}

const shopIcon = computed(() => categoryIcons[props.shop.category] || '🍽')
const districtName = computed(() => districtNames[props.shop.district] || props.shop.district)

function toggleFav() {
  emit('favorite')
}

function submitNote() {
  if (newNote.value.trim()) {
    emit('save-note', { content: newNote.value.trim() })
    newNote.value = ''
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.shop-detail-modal {
  max-width: 600px;
  max-height: 85vh;
  padding: 0;
}

.detail-header {
  padding: 24px 24px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.detail-name {
  font-family: var(--font-title);
  font-size: 28px;
  color: var(--color-ink);
  letter-spacing: 3px;
}

.detail-seal {
  font-size: 13px;
}

.detail-icon-area {
  text-align: center;
  margin: 16px 0;
}

.detail-icon-frame {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: var(--color-paper-dark);
  border: 3px solid var(--color-wood);
  border-radius: 50%;
  box-shadow: var(--shadow-wood);
}

.detail-icon {
  font-size: 36px;
}

.detail-info {
  padding: 0 24px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(122,122,122,0.2);
}

.info-label {
  width: 80px;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink-light);
  flex-shrink: 0;
}

.info-value {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink);
}

.info-signature {
  color: var(--color-rouge);
  font-weight: bold;
}

.info-tags {
  padding: 10px 0;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-story {
  padding: 0 24px;
}

.story-title {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--color-ink);
  margin-bottom: 10px;
  text-align: center;
}

.story-text {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  line-height: 1.8;
  text-indent: 2em;
}

.detail-notes {
  padding: 0 24px;
}

.notes-list {
  max-height: 180px;
  overflow-y: auto;
}

.note-item {
  background: var(--color-paper-dark);
  border: 1px solid var(--color-ink-wash);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
}

.note-content {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink);
  line-height: 1.6;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.note-date {
  font-size: 11px;
  color: var(--color-ink-wash);
}

.note-delete {
  font-size: 11px;
  color: var(--color-rouge);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
}

.notes-empty {
  text-align: center;
  color: var(--color-ink-wash);
  font-size: 13px;
  padding: 12px 0;
}

.note-form {
  padding: 0 24px;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.note-textarea {
  flex: 1;
  resize: none;
  font-size: 12px;
}

.detail-actions {
  padding: 20px 24px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.detail-action-btn {
  font-size: 13px;
  padding: 6px 16px;
}

.detail-stats {
  padding: 12px 24px 20px;
  text-align: center;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-ink-light);
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
