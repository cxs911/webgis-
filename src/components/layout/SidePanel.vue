<template>
  <aside class="side-panel newsprint-texture" :class="{ 'side-panel--collapsed': collapsed }">
    <button class="side-toggle vintage-btn" @click="collapsed = !collapsed">
      {{ collapsed ? '▶' : '◀' }}
    </button>

    <div v-show="!collapsed" class="side-content">
      <!-- 看板1：金陵美食总览 -->
      <section class="panel-card">
        <h3 class="panel-title">
          <span class="panel-icon">🥮</span>
          金陵美食总览
          <span class="panel-sub-icon">蒸笼 · 食盒</span>
        </h3>
        <div class="panel-stats">
          <div class="stat-item">
            <span class="stat-num">{{ totalShops }}</span>
            <span class="stat-label">收录老店</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ oldBrandCount }}</span>
            <span class="stat-label">民国创立</span>
          </div>
        </div>
        <div ref="districtChartRef" class="panel-chart"></div>
      </section>

      <!-- 看板2：热门小吃排行榜 -->
      <section class="panel-card">
        <h3 class="panel-title">
          <span class="panel-icon">🍜</span>
          热门小吃排行
          <span class="panel-sub-icon">鸭血粉丝</span>
        </h3>
        <div class="ranking-list">
          <div
            v-for="(item, idx) in hotRanking"
            :key="item.name"
            class="ranking-item"
          >
            <span class="ranking-num" :class="{ 'ranking-num--top1': idx === 0 }">
              {{ idx + 1 }}
            </span>
            <span class="ranking-icon">{{ item.icon }}</span>
            <span class="ranking-name">{{ item.name }}</span>
            <span class="ranking-count">{{ item.count }}家</span>
          </div>
        </div>
      </section>

      <!-- 看板3：片区打卡热力 -->
      <section class="panel-card">
        <h3 class="panel-title">
          <span class="panel-icon">🛺</span>
          片区打卡分布
          <span class="panel-sub-icon">黄包车</span>
        </h3>
        <div ref="pieChartRef" class="panel-chart"></div>
      </section>

      <!-- 看板4：今日推荐老店 -->
      <section class="panel-card">
        <h3 class="panel-title">
          <span class="panel-icon">🏮</span>
          今日推荐老店
          <span class="panel-sub-icon">街边摊</span>
        </h3>
        <div class="recommend-card" @click="$emit('select-district', recommendedShop?.district)">
          <template v-if="recommendedShop">
            <div class="recommend-frame">
              <div class="recommend-shop-icon">{{ categoryIcons[recommendedShop.category] || '🍽' }}</div>
            </div>
            <h4 class="recommend-name">{{ recommendedShop.name }}</h4>
            <p class="recommend-year">民国{{ recommendedShop.year - 1911 }}年创立</p>
            <p class="recommend-story">{{ recommendedShop.story?.slice(0, 50) }}…</p>
            <span class="vintage-btn vintage-btn--primary recommend-btn">去打卡 →</span>
          </template>
        </div>
      </section>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  districtStats: Array,
  hotRanking: Array,
  checkinDistribution: Array,
  totalShops: Number,
  oldBrandCount: Number
})

defineEmits(['select-district'])

const collapsed = ref(false)
const districtChartRef = ref(null)
const pieChartRef = ref(null)
let districtChart = null
let pieChart = null

const categoryIcons = {
  gaotuan: '🥮', yaxue: '🍜', huntun: '🥟',
  luwei: '🍖', chaguan: '🍵', miantu: '🥮',
  tangshui: '🍯', xiaochi: '🥢'
}

// 轮播推荐
const recommendedShop = ref(null)
const recommendIndex = ref(0)

// 片区柱状图
function initDistrictChart() {
  if (!districtChartRef.value) return
  if (districtChart) districtChart.dispose()

  districtChart = echarts.init(districtChartRef.value)

  const names = props.districtStats?.map(d => d.name) || []
  const counts = props.districtStats?.map(d => d.count) || []
  const colors = props.districtStats?.map(d => d.color) || []

  districtChart.setOption({
    grid: { top: 10, right: 10, bottom: 30, left: 40 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(245, 230, 200, 0.95)',
      borderColor: '#8B6914',
      borderWidth: 2,
      textStyle: { color: '#2C2C2C', fontFamily: 'STFangsong, FangSong, serif' },
      formatter: '{b}: {c} 家'
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLine: { lineStyle: { color: '#5C5C5C' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#2C2C2C',
        fontFamily: 'STFangsong, FangSong, serif',
        fontSize: 10,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#E8DCC8', type: 'dashed' } },
      axisLabel: {
        color: '#4A4A4A',
        fontFamily: 'STFangsong, FangSong, serif',
        fontSize: 10
      }
    },
    series: [{
      type: 'bar',
      data: counts.map((v, i) => ({
        value: v,
        itemStyle: {
          color: colors[i],
          borderRadius: [4, 4, 0, 0],
          borderColor: '#5C4A1E',
          borderWidth: 1
        }
      })),
      barWidth: '50%',
      emphasis: {
        itemStyle: { color: '#C23B3B' }
      }
    }]
  })
}

// 饼图
function initPieChart() {
  if (!pieChartRef.value) return
  if (pieChart) pieChart.dispose()

  pieChart = echarts.init(pieChartRef.value)

  const data = props.checkinDistribution || []

  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(245, 230, 200, 0.95)',
      borderColor: '#8B6914',
      borderWidth: 2,
      textStyle: { color: '#2C2C2C', fontFamily: 'STFangsong, FangSong, serif' },
      formatter: '{b}: {c}次打卡 ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '50%'],
      data: data.map(d => ({
        name: d.name,
        value: d.value,
        itemStyle: {
          color: d.color,
          borderColor: '#5C4A1E',
          borderWidth: 1,
          borderRadius: 4
        }
      })),
      label: {
        color: '#2C2C2C',
        fontFamily: 'STFangsong, FangSong, serif',
        fontSize: 9,
        formatter: '{b}\n{d}%'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
    }]
  })
}

onMounted(() => {
  nextTick(() => {
    initDistrictChart()
    initPieChart()
    updateRecommend()
  })
})

watch(
  () => [props.districtStats, props.hotRanking, props.checkinDistribution],
  () => {
    nextTick(() => {
      initDistrictChart()
      initPieChart()
    })
  },
  { deep: true }
)

// 轮播推荐
let timer = null
function updateRecommend() {
  const shops = props.districtStats?.flatMap(d => d.shops || []) || []
  if (shops.length > 0) {
    recommendedShop.value = shops[recommendIndex.value]
    recommendIndex.value = (recommendIndex.value + 1) % shops.length
  }
  timer = setTimeout(updateRecommend, 5000)
}

watch(collapsed, (val) => {
  if (!val) {
    nextTick(() => {
      initDistrictChart()
      initPieChart()
    })
  }
})
</script>

<style scoped>
.side-panel {
  width: 320px;
  height: 100%;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 12px;
  border-right: 3px solid var(--color-wood-dark);
  box-shadow: var(--shadow-wood);
  position: relative;
  transition: width 0.3s ease;
  z-index: 50;
}

.side-panel--collapsed {
  width: 40px;
  padding: 12px 8px;
}

.side-toggle {
  position: absolute;
  top: 12px;
  right: 8px;
  padding: 2px 8px;
  font-size: 14px;
  z-index: 10;
}

.side-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-card {
  background: var(--color-paper-light);
  background-image: var(--texture-paper);
  border: 2px solid var(--color-brick);
  border-radius: var(--radius-card);
  padding: 12px;
  position: relative;
}

.panel-card::before {
  content: '';
  position: absolute;
  top: 3px; left: 3px; right: 3px; bottom: 3px;
  border: 1px solid var(--color-ink-wash);
  border-radius: 5px;
  pointer-events: none;
  opacity: 0.2;
}

.panel-title {
  font-family: var(--font-title);
  font-size: 16px;
  color: var(--color-ink);
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-rouge);
  position: relative;
}

.panel-icon {
  font-size: 18px;
}

.panel-sub-icon {
  display: block;
  font-size: 10px;
  color: var(--color-ink-wash);
  font-family: var(--font-body);
  letter-spacing: 2px;
  margin-top: 2px;
}

.panel-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 10px;
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-family: var(--font-title);
  font-size: 28px;
  color: var(--color-rouge);
  font-weight: bold;
}

.stat-label {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--color-ink-light);
}

.panel-chart {
  width: 100%;
  height: 200px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-ink-wash);
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-num {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-family: var(--font-title);
  font-size: 13px;
  font-weight: bold;
  color: var(--color-paper-light);
  background: var(--color-wood);
  border-radius: 50%;
  flex-shrink: 0;
}

.ranking-num--top1 {
  background: var(--color-rouge);
  position: relative;
}

.ranking-num--top1::after {
  content: '🌸';
  position: absolute;
  top: -10px;
  right: -6px;
  font-size: 10px;
}

.ranking-icon {
  font-size: 16px;
}

.ranking-name {
  flex: 1;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--color-ink);
}

.ranking-count {
  font-family: var(--font-ming);
  font-size: 12px;
  color: var(--color-ink-light);
}

/* 推荐卡 */
.recommend-card {
  cursor: pointer;
  text-align: center;
  padding: 8px;
}

.recommend-frame {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  background: var(--color-paper-dark);
  border: 3px solid var(--color-wood);
  border-radius: var(--radius-card);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-wood);
}

.recommend-shop-icon {
  font-size: 36px;
}

.recommend-name {
  font-family: var(--font-title);
  font-size: 17px;
  color: var(--color-ink);
  margin-bottom: 4px;
}

.recommend-year {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-ink-wash);
  margin-bottom: 4px;
}

.recommend-story {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--color-ink-light);
  line-height: 1.5;
  margin-bottom: 8px;
  text-align: left;
}

.recommend-btn {
  font-size: 12px;
}
</style>
