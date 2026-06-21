<template>
  <Teleport to="body">
    <div class="vintage-modal-overlay" @click.self="$emit('close')">
      <div class="vintage-modal hot-ranking-modal">
        <button class="vintage-modal-close" @click="$emit('close')">✕</button>
        <div class="vintage-modal-header">🏆 热门小吃排行榜</div>
        <div class="vintage-modal-body">
          <div class="ranking-hero">
            <div class="ranking-hero-badge">🏅</div>
            <p class="ranking-hero-title">{{ topItem?.name || '—' }}</p>
            <p class="ranking-hero-sub">
              <span class="vintage-seal">金陵一绝</span>
            </p>
            <p class="ranking-hero-stat">
              {{ topItem?.count || 0 }} 家店铺 · {{ topItem?.totalCheckins || 0 }} 次打卡
            </p>
          </div>

          <div class="vintage-divider"></div>

          <div class="ranking-full-list">
            <div
              v-for="(item, idx) in ranking"
              :key="item.name"
              class="ranking-full-item"
            >
              <span class="ranking-full-num" :class="{ 'ranking-full-num--top': idx < 3 }">
                {{ idx + 1 }}
              </span>
              <span class="ranking-full-icon">{{ item.icon }}</span>
              <div class="ranking-full-info">
                <span class="ranking-full-name">{{ item.name }}</span>
                <span class="ranking-full-detail">{{ item.count }}家店 · {{ item.totalCheckins }}次打卡</span>
              </div>
              <div class="ranking-full-bar">
                <div
                  class="ranking-full-fill"
                  :style="{
                    width: maxCheckins ? (item.totalCheckins / maxCheckins * 100) + '%' : '0%',
                    backgroundColor: idx === 0 ? '#C23B3B' : idx === 1 ? '#A0522D' : idx === 2 ? '#8B6914' : '#D4A574'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ ranking: Array })
defineEmits(['close'])

const topItem = computed(() => props.ranking?.[0])
const maxCheckins = computed(() => {
  if (!props.ranking?.length) return 1
  return Math.max(...props.ranking.map(r => r.totalCheckins))
})
</script>

<style scoped>
.hot-ranking-modal {
  max-width: 500px;
}

.ranking-hero {
  text-align: center;
  padding: 10px 0;
}

.ranking-hero-badge {
  font-size: 40px;
}

.ranking-hero-title {
  font-family: var(--font-title);
  font-size: 24px;
  color: var(--color-rouge);
  margin: 8px 0;
}

.ranking-hero-sub {
  margin: 6px 0;
}

.ranking-hero-stat {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink-light);
  margin-top: 6px;
}

.ranking-full-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ranking-full-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(122,122,122,0.2);
}

.ranking-full-num {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-family: var(--font-title);
  font-size: 14px;
  color: var(--color-paper-light);
  background: var(--color-gray-brick);
  border-radius: 50%;
  flex-shrink: 0;
}

.ranking-full-num--top {
  background: var(--color-rouge);
}

.ranking-full-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.ranking-full-info {
  flex: 1;
  min-width: 120px;
}

.ranking-full-name {
  display: block;
  font-family: var(--font-title);
  font-size: 15px;
  color: var(--color-ink);
}

.ranking-full-detail {
  display: block;
  font-size: 11px;
  color: var(--color-ink-wash);
  margin-top: 2px;
}

.ranking-full-bar {
  width: 80px;
  height: 8px;
  background: var(--color-paper-dark);
  border-radius: 4px;
  overflow: hidden;
}

.ranking-full-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}
</style>
