<template>
  <div class="map-wrapper">
    <div id="map-container" ref="mapContainerRef" class="map-container"></div>

    <!-- 图例 -->
    <div class="map-legend vintage-card">
      <h4 class="legend-title">图 例</h4>
      <div class="legend-items">
        <div v-for="c in categories" :key="c.id" class="legend-item">
          <span class="legend-icon">{{ c.icon }}</span>
          <span class="legend-label">{{ c.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useMap } from '@/composables/useMap.js'

const props = defineProps({
  shops: Array,
  districts: Array,
  categories: Array,
  checkins: Set,
  favorites: Set,
  selectedDistrict: String,
  selectedCategory: String
})

const emit = defineEmits(['open-detail'])

const {
  initMap, addShopMarkers,
  flyToDistrict, flyToShop, drawRoute,
  fitShopsBounds
} = useMap()

const mapContainerRef = ref(null)

// 刷新标记
function refreshMarkers() {
  addShopMarkers(props.shops || [], props.checkins || new Set(), (shop) => {
    emit('open-detail', shop)
  })
}

// 导航到店铺
function navigateTo(shop) {
  flyToShop(shop)
  drawRoute(null, shop)
}

// AI推荐结果整体展示
function flyToShops(shops) {
  fitShopsBounds(shops)
}

onMounted(() => {
  nextTick(async () => {
    await initMap('map-container')
    refreshMarkers()
  })
})

watch(() => props.shops, () => refreshMarkers(), { deep: true })
watch(() => props.checkins, () => refreshMarkers())

// 监听外部片区筛选变化，飞行到对应位置
watch(() => props.selectedDistrict, (newVal) => {
  if (newVal && props.districts) {
    flyToDistrict(newVal, props.districts)
  }
})

defineExpose({ refreshMarkers, navigateTo, flyToShops })
</script>

<style scoped>
.map-wrapper {
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  background: var(--color-paper);
}

/* 复古底图色调 - 模拟民国手绘风格 */
:deep(.vintage-tile) {
  filter: sepia(0.5) saturate(0.7) brightness(0.92) contrast(1.08) hue-rotate(-5deg);
}

/* 图例 */
.map-legend {
  position: absolute;
  bottom: 40px;
  right: 16px;
  z-index: 500;
  padding: 10px 14px;
  min-width: 140px;
}

.legend-title {
  font-family: var(--font-title);
  font-size: 14px;
  color: var(--color-ink);
  text-align: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--color-ink-wash);
}

.legend-items {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-family: var(--font-body);
  color: var(--color-ink);
}

.legend-icon {
  font-size: 14px;
}

/* Marker 样式 */
:deep(.vintage-marker) {
  background: none !important;
  border: none !important;
}

/* 聚合图标 */
:deep(.vintage-cluster) {
  background: none !important;
  border: none !important;
}

:deep(.cluster-icon) {
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 3px solid var(--color-wood);
  background: var(--color-paper-light);
  box-shadow: var(--shadow-wood);
}

:deep(.cluster-medium) {
  width: 55px;
  height: 55px;
  background: var(--color-paper-dark);
}

:deep(.cluster-large) {
  width: 60px;
  height: 60px;
  background: var(--color-kraft);
  border-color: var(--color-brick);
}

:deep(.cluster-emoji) {
  font-size: 18px;
}

:deep(.cluster-count) {
  font-size: 11px;
  font-family: var(--font-title);
  color: var(--color-ink);
  margin-top: -2px;
}

/* 缩放控件 */
:deep(.vintage-zoom-control) {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-paper-light);
  border: 2px solid var(--color-wood);
  border-radius: var(--radius-card);
  padding: 4px;
  box-shadow: var(--shadow-wood);
}

:deep(.vintage-zoom-btn) {
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-family: var(--font-title);
  color: var(--color-ink);
  background: var(--color-paper-dark);
  border: 1px solid var(--color-wood);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition-ink);
}

:deep(.vintage-zoom-btn:hover) {
  background: var(--color-wood);
  color: var(--color-paper-light);
}

/* Popup 弹窗 */
:deep(.vintage-popup) .leaflet-popup-content-wrapper {
  background: var(--color-paper);
  background-image: var(--texture-paper);
  border: 3px solid var(--color-wood-dark);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-wood);
}

:deep(.vintage-popup) .leaflet-popup-tip {
  background: var(--color-wood-dark);
}

/* 路线动画 */
:deep(.route-line) {
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to { stroke-dashoffset: -16; }
}
</style>
