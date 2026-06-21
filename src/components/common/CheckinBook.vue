<template>
  <Teleport to="body">
    <div class="vintage-modal-overlay" @click.self="$emit('close')">
      <div class="vintage-modal checkin-book-modal">
        <button class="vintage-modal-close" @click="$emit('close')">✕</button>
        <div class="vintage-modal-header">📒 我的打卡本</div>
        <div class="vintage-modal-body">
          <div v-if="checkedShops.length === 0" class="empty-state">
            <p class="empty-icon">📖</p>
            <p>你还没有打卡记录</p>
            <p class="empty-hint">在地图上找到喜欢的小店，点击「标记打卡」吧！</p>
          </div>
          <div v-else class="checkin-list">
            <div
              v-for="shop in checkedShops"
              :key="shop.id"
              class="checkin-card vintage-card"
              @click="$emit('go-shop', shop)"
            >
              <div class="checkin-left">
                <span class="checkin-icon">{{ getCategoryIcon(shop.category) }}</span>
              </div>
              <div class="checkin-right">
                <h4 class="checkin-name">{{ shop.name }}</h4>
                <p class="checkin-district">{{ getDistrictName(shop.district) }}</p>
                <p class="checkin-tags">
                  <span v-for="t in shop.tags.slice(0, 2)" :key="t" class="vintage-tag">{{ t }}</span>
                </p>
                <p v-if="getNotes(shop.id).length > 0" class="checkin-has-note">
                  📝 {{ getNotes(shop.id).length }} 篇笔记
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="vintage-modal-footer">
          <span class="footer-stat">共打卡 {{ checkedShops.length }} 家小店</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  shops: Array,
  checkins: Set,
  notes: Object
})

defineEmits(['close', 'go-shop'])

const checkedShops = computed(() => {
  return props.shops.filter(s => props.checkins?.has(s.id))
})

function getCategoryIcon(catId) {
  const icons = {
    gaotuan: '🥮', yaxue: '🍜', huntun: '🥟',
    luwei: '🍖', chaguan: '🍵', miantu: '🥮',
    tangshui: '🍯', xiaochi: '🥢'
  }
  return icons[catId] || '🍽'
}

function getDistrictName(dId) {
  const names = {
    laomendong: '老门东', fuzimiao: '夫子庙', kexiang: '科巷',
    nanhu: '南湖', xinanli: '熙南里', yihelu: '颐和路',
    sanqiba: '三七八巷'
  }
  return names[dId] || dId
}

function getNotes(shopId) {
  return props.notes?.[shopId] || []
}
</script>

<style scoped>
.checkin-book-modal {
  max-width: 480px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--color-ink-wash);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-hint {
  font-size: 13px;
  margin-top: 8px;
}

.checkin-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 50vh;
  overflow-y: auto;
}

.checkin-card {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: var(--transition-ink);
}

.checkin-card:hover {
  border-color: var(--color-rouge);
  transform: translateY(-2px);
}

.checkin-left {
  flex-shrink: 0;
}

.checkin-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: var(--color-paper-dark);
  border-radius: 50%;
}

.checkin-right {
  flex: 1;
}

.checkin-name {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--color-ink);
}

.checkin-district {
  font-size: 12px;
  color: var(--color-ink-wash);
  margin: 4px 0;
}

.checkin-tags {
  display: flex;
  gap: 4px;
}

.checkin-has-note {
  font-size: 12px;
  color: var(--color-rouge);
  margin-top: 4px;
}

.footer-stat {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink-light);
}
</style>
