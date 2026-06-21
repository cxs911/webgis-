<template>
  <Teleport to="body">
    <div class="vintage-modal-overlay" @click.self="$emit('close')">
      <div class="vintage-modal stories-modal">
        <button class="vintage-modal-close" @click="$emit('close')">✕</button>
        <div class="vintage-modal-header">📰 金陵美食旧闻</div>
        <div class="vintage-modal-body">
          <p class="stories-intro">
            金陵饮食文化，始于六朝，盛于明清，而民国时期的南京街巷，更是市井美食最繁盛的年代。以下老店，每一家都有一段民国往事。
          </p>

          <div class="stories-list">
            <div
              v-for="shop in oldShops"
              :key="shop.id"
              class="story-card vintage-card"
              @click="$emit('go-shop', shop)"
            >
              <div class="story-card-header">
                <span class="story-card-year">民国{{ shop.year - 1911 }}年</span>
                <h4 class="story-card-name">{{ shop.name }}</h4>
                <span class="story-card-district">{{ getDistrictName(shop.district) }}</span>
              </div>
              <p class="story-card-text">{{ shop.story }}</p>
              <div class="story-card-more">
                <span>查看店铺详情 →</span>
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

const props = defineProps({ shops: Array })
defineEmits(['close', 'go-shop'])

const oldShops = computed(() => {
  return (props.shops || [])
    .filter(s => s.year <= 1949)
    .sort((a, b) => a.year - b.year)
})

function getDistrictName(dId) {
  const names = {
    laomendong: '老门东', fuzimiao: '夫子庙', kexiang: '科巷',
    nanhu: '南湖', xinanli: '熙南里', yihelu: '颐和路',
    sanqiba: '三七八巷'
  }
  return names[dId] || dId
}
</script>

<style scoped>
.stories-modal {
  max-width: 560px;
  max-height: 80vh;
}

.stories-intro {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  line-height: 1.8;
  text-indent: 2em;
  margin-bottom: 16px;
  padding: 0 8px;
}

.stories-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 50vh;
  overflow-y: auto;
}

.story-card {
  cursor: pointer;
  transition: var(--transition-ink);
}

.story-card:hover {
  border-color: var(--color-rouge);
  transform: translateY(-2px);
}

.story-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.story-card-year {
  font-family: var(--font-ming);
  font-size: 13px;
  color: var(--color-paper-light);
  background: var(--color-rouge);
  padding: 2px 8px;
  border-radius: 3px;
}

.story-card-name {
  font-family: var(--font-title);
  font-size: 17px;
  color: var(--color-ink);
}

.story-card-district {
  font-size: 12px;
  color: var(--color-ink-wash);
}

.story-card-text {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink);
  line-height: 1.7;
  text-indent: 2em;
}

.story-card-more {
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-rouge);
}
</style>
