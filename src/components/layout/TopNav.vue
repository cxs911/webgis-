<template>
  <header class="top-nav">
    <div class="nav-bg-texture"></div>

    <!-- 左灯笼 -->
    <div class="nav-lantern nav-lantern--left lantern-swing">
      <div class="lantern-body lantern-glow"></div>
      <div class="lantern-tassel"></div>
    </div>

    <!-- 标题区 -->
    <div class="nav-brand">
      <h1 class="nav-title">金陵巷食记</h1>
      <p class="nav-subtitle">南京老店逛吃打卡地图</p>
    </div>

    <!-- 中间菜单区 -->
    <nav class="nav-menu">
      <div class="nav-menu-row">
        <button
          v-for="d in districts"
          :key="d.id"
          class="vintage-btn nav-btn"
          :class="{ 'nav-btn--active': selectedDistrict === d.id }"
          @click="$emit('select-district', d.id)"
        >
          {{ d.name }}
        </button>
      </div>
      <div class="nav-menu-row">
        <button
          v-for="c in categories"
          :key="c.id"
          class="vintage-btn nav-btn nav-btn--small"
          :class="{ 'nav-btn--active': selectedCategory === c.id }"
          @click="$emit('select-category', c.id)"
        >
          <span>{{ c.icon }}</span> {{ c.name }}
        </button>
      </div>
    </nav>

    <!-- 右侧功能区 -->
    <div class="nav-actions">
      <div class="nav-search">
        <input
          class="vintage-input nav-search-input"
          type="text"
          :value="searchKeyword"
          placeholder="搜馄饨、老字号、街巷名…"
          @input="$emit('search', $event.target.value)"
        />
      </div>
      <div class="nav-btns">
        <button class="vintage-btn nav-action-btn" @click="$emit('open-checkins')">
          📒 我的打卡本
          <span v-if="checkinCount > 0" class="nav-badge">{{ checkinCount }}</span>
        </button>
        <button class="vintage-btn nav-action-btn" @click="$emit('open-ranking')">
          🏆 热门榜单
        </button>
        <button class="vintage-btn nav-action-btn" @click="$emit('open-stories')">
          📰 美食故事
        </button>
      </div>
    </div>

    <!-- 右灯笼 -->
    <div class="nav-lantern nav-lantern--right lantern-swing" style="animation-delay: 0.5s">
      <div class="lantern-body lantern-glow" style="animation-delay: 0.5s"></div>
      <div class="lantern-tassel"></div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  districts: Array,
  categories: Array,
  checkinCount: Number,
  favoriteCount: Number,
  selectedDistrict: { type: String, default: null },
  selectedCategory: { type: String, default: null }
})

defineEmits([
  'select-district', 'select-category',
  'search', 'open-checkins', 'open-ranking', 'open-stories'
])

const searchKeyword = ref('')
</script>

<style scoped>
.top-nav {
  position: relative;
  height: 110px;
  background: linear-gradient(180deg, var(--color-wood-dark), var(--color-wood), var(--color-wood-dark));
  background-image: var(--texture-wood-grain);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 20px;
  z-index: 100;
  flex-shrink: 0;
  border-bottom: 4px solid var(--color-wood-dark);
  box-shadow: var(--shadow-wood);
}

.nav-bg-texture {
  position: absolute;
  inset: 0;
  background-image: var(--texture-paper);
  opacity: 0.05;
}

/* 灯笼 */
.nav-lantern {
  width: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.lantern-body {
  width: 30px;
  height: 36px;
  background: radial-gradient(ellipse at center, var(--color-lantern-red), var(--color-rouge-dark));
  border-radius: 50%;
  border: 2px solid var(--color-wood-dark);
  position: relative;
}

.lantern-body::before,
.lantern-body::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 4px;
  background: var(--color-wood-dark);
  border-radius: 2px;
}

.lantern-body::before { top: -2px; }
.lantern-body::after { bottom: -2px; }

.lantern-tassel {
  width: 2px;
  height: 16px;
  background: var(--color-lantern-gold);
  margin-top: 2px;
  position: relative;
}

.lantern-tassel::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: -4px;
  width: 10px;
  height: 6px;
  background: var(--color-lantern-gold);
  border-radius: 50% 50% 0 0;
}

/* 标题 */
.nav-brand {
  flex-shrink: 0;
  text-align: center;
  padding: 0 16px;
}

.nav-title {
  font-family: var(--font-title);
  font-size: 32px;
  color: var(--color-paper-light);
  text-shadow:
    2px 2px 4px rgba(0,0,0,0.3),
    0 0 8px rgba(212,64,64,0.3);
  letter-spacing: 6px;
  line-height: 1.2;
}

.nav-subtitle {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-wood-light);
  letter-spacing: 3px;
  margin-top: 2px;
}

/* 菜单 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

.nav-menu-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.nav-btn {
  font-size: 13px;
  padding: 4px 12px;
}

.nav-btn--small {
  font-size: 11px;
  padding: 3px 10px;
}

.nav-btn--active {
  background: linear-gradient(180deg, var(--color-rouge), var(--color-rouge-dark));
  color: var(--color-paper-light);
  border-color: var(--color-rouge-dark);
}

/* 右侧操作区 */
.nav-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.nav-search-input {
  width: 220px;
  padding: 5px 12px;
  font-size: 12px;
  height: 30px;
}

.nav-btns {
  display: flex;
  gap: 6px;
}

.nav-action-btn {
  font-size: 12px;
  padding: 4px 10px;
  position: relative;
}

.nav-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  font-size: 10px;
  color: white;
  background: var(--color-rouge);
  border-radius: 50%;
}
</style>
