<template>
  <div class="app-root">
    <!-- 加载画面 -->
    <Transition name="fade">
      <div v-if="loading" class="loading-screen">
        <div class="loading-steam-container">
          <div class="loading-steam-basket"></div>
          <div
            v-for="i in 5"
            :key="i"
            class="steam"
            :style="{ animationDelay: `${i * 0.4}s`, left: `${30 + i * 12}px`, position: 'absolute', top: '5px', width: '8px', height: '20px', background: 'rgba(200,200,200,0.4)', borderRadius: '50%' }"
          ></div>
        </div>
        <div class="loading-text">寻味金陵街巷中</div>
        <div class="loading-subtitle">金陵旧巷 · 民国风逛吃打卡地图</div>
      </div>
    </Transition>

    <!-- 主界面 -->
    <Transition name="fade">
      <div v-if="!loading" class="main-layout">
        <TopNav
          :districts="districts"
          :categories="categories"
          :checkin-count="checkinCount"
          :favorite-count="favoriteCount"
          :selected-district="currentFilter.district"
          :selected-category="currentFilter.category"
          @select-district="onSelectDistrict"
          @select-category="onSelectCategory"
          @search="onSearch"
          @open-checkins="showCheckinList = true"
          @open-ranking="showHotRanking = true"
          @open-stories="showStories = true"
        />
        <div class="main-content">
          <SidePanel
            :district-stats="districtStats"
            :hot-ranking="hotRanking"
            :checkin-distribution="checkinDistribution"
            :total-shops="totalShops"
            :old-brand-count="oldBrandCount"
            @select-district="onSelectDistrict"
          />
          <MapContainer
            ref="mapRef"
            :shops="filteredShops"
            :districts="districts"
            :categories="categories"
            :checkins="checkins"
            :favorites="favorites"
            :selected-district="currentFilter.district"
            @open-detail="onOpenDetail"
          />
        </div>
        <BottomBar />

        <!-- 店铺详情弹窗 -->
        <ShopDetail
          v-if="detailShop"
          :shop="detailShop"
          :is-checked="isCheckedIn(detailShop.id)"
          :is-favorited="isFavorited(detailShop.id)"
          :notes="getNotes(detailShop.id)"
          @close="detailShop = null"
          @checkin="onCheckin(detailShop.id)"
          @favorite="onFavorite(detailShop.id)"
          @navigate="onNavigate(detailShop)"
          @save-note="onSaveNote(detailShop.id, $event)"
          @delete-note="onDeleteNote(detailShop.id, $event)"
        />

        <!-- 我的打卡本弹窗 -->
        <CheckinBook
          v-if="showCheckinList"
          :shops="shops"
          :checkins="checkins"
          :notes="notes"
          @close="showCheckinList = false"
          @go-shop="onGoShop"
        />

        <!-- 热门榜单弹窗 -->
        <HotRanking
          v-if="showHotRanking"
          :ranking="hotRanking"
          @close="showHotRanking = false"
        />

        <!-- 美食故事弹窗 -->
        <FoodStories
          v-if="showStories"
          :shops="shops"
          @close="showStories = false"
          @go-shop="onGoShop"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import TopNav from './components/layout/TopNav.vue'
import SidePanel from './components/layout/SidePanel.vue'
import BottomBar from './components/layout/BottomBar.vue'
import MapContainer from './components/map/MapContainer.vue'
import ShopDetail from './components/map/ShopDetail.vue'
import CheckinBook from './components/common/CheckinBook.vue'
import HotRanking from './components/common/HotRanking.vue'
import FoodStories from './components/common/FoodStories.vue'
import { useData } from './composables/useData.js'
import { useCheckIn } from './composables/useCheckIn.js'

const loading = ref(true)

// 加载画面 2.5s
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2500)
})

// 数据
const {
  shops, districts, categories,
  currentFilter, filteredShops,
  districtStats, hotRanking,
  checkinDistribution, totalShops, oldBrandCount,
  setFilter, resetFilter
} = useData()

// 打卡
const {
  checkins, favorites, notes,
  toggleCheckin, isCheckedIn, getCheckinCount,
  toggleFavorite, isFavorited,
  saveNote, getNotes, deleteNote
} = useCheckIn()

const checkinCount = ref(getCheckinCount())
const favoriteCount = ref(favorites.value.size)

// 弹窗状态
const detailShop = ref(null)
const showCheckinList = ref(false)
const showHotRanking = ref(false)
const showStories = ref(false)

const mapRef = ref(null)

// 筛选
function onSelectDistrict(districtId) {
  if (currentFilter.value.district === districtId) {
    setFilter({ district: null })
  } else {
    setFilter({ district: districtId })
  }
}

function onSelectCategory(categoryId) {
  if (currentFilter.value.category === categoryId) {
    setFilter({ category: null })
  } else {
    setFilter({ category: categoryId })
  }
}

function onSearch(keyword) {
  setFilter({ keyword })
}

// 打开详情
function onOpenDetail(shop) {
  detailShop.value = shop
}

// 打卡
function onCheckin(shopId) {
  toggleCheckin(shopId)
  checkinCount.value = getCheckinCount()
  // 刷新地图标记
  if (mapRef.value) mapRef.value.refreshMarkers()
}

function onFavorite(shopId) {
  toggleFavorite(shopId)
  favoriteCount.value = favorites.value.size
}

function onSaveNote(shopId, note) {
  saveNote(shopId, note)
}

function onDeleteNote(shopId, noteId) {
  deleteNote(shopId, noteId)
}

// 导航到店铺
function onNavigate(shop) {
  if (mapRef.value) {
    mapRef.value.navigateTo(shop)
  }
  detailShop.value = null
}

function onGoShop(shop) {
  showCheckinList.value = false
  showHotRanking.value = false
  showStories.value = false
  onOpenDetail(shop)
}

// 提供给子组件
provide('districts', districts)
provide('categories', categories)
</script>

<style scoped>
.app-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
