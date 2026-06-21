import { ref, computed } from 'vue'
import {
  shops, districts, categories,
  getDistrictStats, getCategoryStats,
  getHotRanking, getCheckinDistribution,
  filterShops
} from '@/data/shops.js'

export function useData() {
  const currentFilter = ref({
    district: null,
    category: null,
    keyword: ''
  })

  const filteredShops = computed(() => {
    return filterShops({
      district: currentFilter.value.district,
      category: currentFilter.value.category,
      keyword: currentFilter.value.keyword
    })
  })

  const districtStats = computed(() => getDistrictStats())
  const categoryStats = computed(() => getCategoryStats())
  const hotRanking = computed(() => getHotRanking())
  const checkinDistribution = computed(() => getCheckinDistribution())

  const totalShops = computed(() => shops.length)
  const oldBrandCount = computed(() => shops.filter(s => s.year <= 1949).length)

  function setFilter(filter) {
    Object.assign(currentFilter.value, filter)
  }

  function resetFilter() {
    currentFilter.value = { district: null, category: null, keyword: '' }
  }

  return {
    shops,
    districts,
    categories,
    currentFilter,
    filteredShops,
    districtStats,
    categoryStats,
    hotRanking,
    checkinDistribution,
    totalShops,
    oldBrandCount,
    setFilter,
    resetFilter
  }
}
