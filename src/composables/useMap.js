import { ref, shallowRef, computed } from 'vue'
import L from 'leaflet'

// 将 L 设为全局变量，供 leaflet.markercluster 插件使用
// （Vite ESM 模式下 leaflet.markercluster 找不到全局 L，会报 ReferenceError）
if (typeof window !== 'undefined' && !window.L) {
  window.L = L
}

// 修复 Leaflet 默认图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// 南京市中心
const NANJING_CENTER = [32.0300, 118.7850]
const DEFAULT_ZOOM = 13

// 民国风 Marker 图标生成
function createVintageIcon(emoji, isChecked = false) {
  const size = isChecked ? 44 : 40
  const color = isChecked ? '#C23B3B' : '#8B6914'
  return L.divIcon({
    className: 'vintage-marker',
    html: `<div style="
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      font-size:${isChecked ? 22 : 20}px;
      background:${isChecked ? 'rgba(194,59,59,0.15)' : 'rgba(245,230,200,0.95)'};
      border:2px solid ${color};
      border-radius:50%;
      box-shadow:2px 2px 6px rgba(44,44,44,0.3);
      transition:all 0.3s ease;
      ${isChecked ? 'animation: seal-stamp 0.6s ease forwards;' : ''}
    ">
      ${emoji}${isChecked ? '<span style="position:absolute;bottom:-4px;right:-4px;font-size:12px;color:#C23B3B;">✔</span>' : ''}
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  })
}

// 品类对应图标
const categoryIcons = {
  gaotuan: '🥮',
  yaxue: '🍜',
  huntun: '🥟',
  luwei: '🍖',
  chaguan: '🍵',
  miantu: '🥮',
  tangshui: '🍯',
  xiaochi: '🥢'
}

// 标记是否已加载 markercluster 插件
let markerClusterLoaded = false

export function useMap() {
  const mapInstance = shallowRef(null)
  const markerCluster = shallowRef(null)
  const markersMap = ref(new Map())
  const selectedDistrict = ref(null)
  const selectedCategory = ref(null)
  const searchKeyword = ref('')
  const activeRoute = ref(null)

  // 初始化地图
  async function initMap(containerId) {
    if (mapInstance.value) return mapInstance.value

    // 动态加载 markercluster 插件（确保 window.L 已就绪）
    if (!markerClusterLoaded) {
      await import('leaflet.markercluster')
      markerClusterLoaded = true
    }

    // 高德地图图层（国内访问快，自带中文标注）
    // style=8: 道路图+标注; subdomains 01-04 负载均衡
    const vintageTile = L.tileLayer(
      'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      {
        subdomains: ['1', '2', '3', '4'],
        attribution: '&copy; 高德地图 | 金陵旧巷',
        maxZoom: 19,
        className: 'vintage-tile'
      }
    )

    // 地图实例
    const map = L.map(containerId, {
      center: NANJING_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false
    })

    vintageTile.addTo(map)

    // 自定义缩放控件 - 铜制旋钮风格
    const ZoomControl = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'vintage-zoom-control')
        container.innerHTML = `
          <button class="vintage-zoom-btn vintage-zoom-in" title="放大">+</button>
          <button class="vintage-zoom-btn vintage-zoom-out" title="缩小">−</button>
        `
        L.DomEvent.on(container.querySelector('.vintage-zoom-in'), 'click', () => map.zoomIn())
        L.DomEvent.on(container.querySelector('.vintage-zoom-out'), 'click', () => map.zoomOut())
        L.DomEvent.disableClickPropagation(container)
        return container
      }
    })
    new ZoomControl().addTo(map)

    // 比例尺
    L.control.scale({
      position: 'bottomleft',
      imperial: false,
      metric: true,
      maxWidth: 150
    }).addTo(map)

    // 标记聚合
    markerCluster.value = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount()
        let size = 'small'
        if (count > 20) size = 'large'
        if (count > 10) size = 'medium'
        return L.divIcon({
          html: `<div class="cluster-icon cluster-${size}">
            <span class="cluster-emoji">🧺</span>
            <span class="cluster-count">${count}</span>
          </div>`,
          className: 'vintage-cluster',
          iconSize: L.point(50, 50)
        })
      }
    })
    map.addLayer(markerCluster.value)

    mapInstance.value = map
    return map
  }

  // 添加店铺标记
  function addShopMarkers(shops, checkins = new Set(), onPopupOpen = null) {
    if (!markerCluster.value) return

    // 清除旧标记
    markerCluster.value.clearLayers()
    markersMap.value.clear()

    shops.forEach(shop => {
      const icon = categoryIcons[shop.category] || '📍'
      const isChecked = checkins.has(shop.id)
      const markerIcon = createVintageIcon(icon, isChecked)

      const marker = L.marker([shop.lat, shop.lng], { icon: markerIcon })

      // 弹窗内容
      const popupContent = `
        <div class="shop-popup">
          <div class="shop-popup-header">
            <h3>${shop.name}</h3>
            ${isChecked ? '<span class="vintage-seal vintage-seal--checked">已打卡</span>' : ''}
          </div>
          <div class="shop-popup-tags">
            ${shop.tags.map(t => `<span class="vintage-tag">${t}</span>`).join('')}
          </div>
          <div class="vintage-divider"></div>
          <div class="shop-popup-info">
            <p>🍽 招牌：${shop.signature}</p>
            <p>💰 人均：¥${shop.avgPrice}</p>
            <p>🕐 ${shop.hours}</p>
            <p>🏛 创立：民国${shop.year - 1911}年 (${shop.year})</p>
          </div>
          <div class="shop-popup-actions">
            <button class="vintage-btn vintage-btn--primary shop-detail-btn" data-id="${shop.id}">
              查看详情
            </button>
          </div>
        </div>
      `
      marker.bindPopup(popupContent, {
        maxWidth: 340,
        className: 'vintage-popup'
      })

      marker.on('popupopen', () => {
        const detailBtn = document.querySelector(`.shop-detail-btn[data-id="${shop.id}"]`)
        if (detailBtn && onPopupOpen) {
          detailBtn.addEventListener('click', () => onPopupOpen(shop))
        }
      })

      // 悬停动画
      marker.on('mouseover', function () {
        this._icon && this._icon.classList.add('float-hover')
      })
      marker.on('mouseout', function () {
        this._icon && this._icon.classList.remove('float-hover')
      })

      markerCluster.value.addLayer(marker)
      markersMap.value.set(shop.id, marker)
    })
  }

  // 飞到指定片区
  function flyToDistrict(districtId, districtsData) {
    const district = districtsData.find(d => d.id === districtId)
    if (district && mapInstance.value) {
      mapInstance.value.flyTo(district.center, 16, {
        duration: 1.5,
        easeLinearity: 0.25
      })
    }
  }

  // 飞到指定店铺
  function flyToShop(shop) {
    if (mapInstance.value && shop) {
      mapInstance.value.flyTo([shop.lat, shop.lng], 18, {
        duration: 1.2,
        easeLinearity: 0.25
      })
      setTimeout(() => {
        const marker = markersMap.value.get(shop.id)
        if (marker) marker.openPopup()
      }, 1300)
    }
  }

  // 绘制路线
  function drawRoute(from, to) {
    if (!mapInstance.value) return
    clearRoute()

    // 简化：绘制折线从地图中心到店铺
    const center = mapInstance.value.getCenter()
    const routeLine = L.polyline(
      [[center.lat, center.lng], [to.lat, to.lng]],
      {
        color: '#C23B3B',
        weight: 3,
        opacity: 0.7,
        dashArray: '8, 8',
        className: 'route-line'
      }
    ).addTo(mapInstance.value)

    activeRoute.value = routeLine

    // 适配视野
    mapInstance.value.fitBounds(routeLine.getBounds(), { padding: [50, 50] })
  }

  function clearRoute() {
    if (activeRoute.value && mapInstance.value) {
      mapInstance.value.removeLayer(activeRoute.value)
      activeRoute.value = null
    }
  }

  function destroyMap() {
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
      markerCluster.value = null
    }
  }

  return {
    mapInstance,
    markerCluster,
    selectedDistrict,
    selectedCategory,
    searchKeyword,
    initMap,
    addShopMarkers,
    flyToDistrict,
    flyToShop,
    drawRoute,
    clearRoute,
    destroyMap
  }
}
