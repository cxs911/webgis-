<template>
  <footer class="bottom-bar brick-texture">
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
  </footer>
</template>

<style scoped>
.bottom-bar {
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
  border-top: 2px solid var(--color-wood-dark);
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-paper-light);
  z-index: 50;
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
</style>
