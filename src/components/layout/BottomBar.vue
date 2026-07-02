<template>
  <footer class="bottom-bar">
    <!-- 美食品类筛选区 -->
    <div class="bottom-categories">
      <span class="category-label">🍜 美食品类</span>
      <div class="category-btns">
        <button
          v-for="c in categories"
          :key="c.id"
          class="vintage-btn category-btn"
          :class="{ 'category-btn--active': selectedCategory === c.id }"
          @click="$emit('select-category', c.id)"
          :title="c.name"
        >
          <span class="category-icon">{{ c.icon }}</span>
          <span class="category-name">{{ c.name }}</span>
        </button>
      </div>
    </div>

    <!-- 分隔线 -->
    <div class="bottom-divider"></div>

    <!-- 底部信息栏 -->
    <div class="bottom-info brick-texture">
      <div class="bottom-left">
        <span class="bottom-scroll-text">
          🍜 金陵美食小语：鸭血粉丝汤——南京人的灵魂食物，汤白味鲜，一碗下肚，浑身暖和…&nbsp;&nbsp;
          🍵 秦淮八绝，始于明清，传于民国，老门东一带至今保留着最地道的金陵味道…&nbsp;&nbsp;
          🥟 南京的早晨，从一碗馄饨开始——皮薄馅大，配上一勺辣油，便是金陵人的日常…
        </span>
      </div>
      <div class="bottom-center">
        <span class="bottom-decor">🌿</span>
        <span class="bottom-decor">🛶</span>
        <span class="bottom-decor">🏮</span>
        <span class="bottom-decor">🍂</span>
      </div>
      <div class="bottom-right">
        <span class="bottom-label">
          本地图收录南京本土市井小吃&nbsp;·&nbsp;仅供逛吃打卡&nbsp;·&nbsp;金陵旧巷 v1.0
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  categories: Array,
  selectedCategory: { type: String, default: null }
})

defineEmits(['select-category'])
</script>

<style scoped>
.bottom-bar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 50;
  border-top: 2px solid var(--color-wood-dark);
  box-shadow: var(--shadow-wood);
}

/* 美食品类筛选区 */
.bottom-categories {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  background: var(--color-paper-news);
  background-image: var(--texture-paper), var(--texture-newsprint);
}

.category-label {
  font-family: var(--font-title);
  font-size: 14px;
  color: var(--color-ink);
  flex-shrink: 0;
  white-space: nowrap;
}

.category-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.category-btn {
  font-size: 12px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  transition: var(--transition-ink);
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-wood);
}

.category-btn--active {
  background: linear-gradient(180deg, var(--color-rouge), var(--color-rouge-dark));
  color: var(--color-paper-light);
  border-color: var(--color-rouge-dark);
}

.category-icon {
  font-size: 14px;
}

.category-name {
  white-space: nowrap;
}

/* 分隔线 */
.bottom-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-wood), transparent);
}

/* 底部信息栏 */
.bottom-info {
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-paper-light);
}

.bottom-left {
  flex: 1;
  overflow: hidden;
}

.bottom-scroll-text {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-left 30s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.bottom-center {
  display: flex;
  gap: 8px;
}

.bottom-decor {
  font-size: 14px;
  opacity: 0.6;
}

.bottom-right {
  flex-shrink: 0;
}

.bottom-label {
  opacity: 0.7;
  letter-spacing: 1px;
}

/* 响应式：小屏下品类按钮只显示图标 */
@media (max-width: 1200px) {
  .category-name {
    display: none;
  }
  .category-btn {
    padding: 4px 8px;
  }
}
</style>
