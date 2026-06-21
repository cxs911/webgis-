# 🏮 金陵旧巷 · 民国风逛吃打卡 WebGIS

> 南京老城区本土小吃老字号打卡地图 —— 以民国手绘动画风格呈现的 WebGIS 地理信息系统

以南京老城区（老门东、夫子庙、科巷、南湖、熙南里、颐和路、三七八巷）的本土小吃、老字号小店为核心，WebGIS 地图承载点位打卡、店铺详情、数据看板，整体 UI 全采用民国手绘画风，复古治愈。

---

## ✨ 功能特性

### GIS 地图
- 高德地图底图 + 复古 sepia 滤镜，呈现民国泛黄质感
- 22 家南京小吃店点位展示，按品类区分手绘卡通图标
- `leaflet.markercluster` 点位聚合，聚集时显示食篮图标
- 分区筛选（老门东 / 夫子庙 / 科巷 / 南湖 / 熙南里 / 颐和路 / 三七八巷）
- 品类筛选（糕团点心 / 鸭血粉丝 / 馄饨皮肚 / 卤味熟食 / 老式茶馆 / 面食锅贴 / 糖水甜食 / 地方小吃）
- 关键词搜索（店铺名、招牌小吃、街巷名）
- 自定义铜制旋钮缩放控件、民国尺子比例尺
- 点击点位飞行定位 + 步行路线绘制

### 打卡社交
- 标记已打卡店铺（红色印章动画「已打卡」）
- 收藏小店
- 撰写探店笔记（线装笔记本弹窗）
- 打卡 / 收藏数据持久化存储（localStorage）

### 数据看板（ECharts 复古图表）
- **金陵美食总览**：总收录老店数、老字号数、累计打卡次数、分区店铺数量柱状图
- **热门小吃排行榜**：Top 5 手绘横向排行榜
- **片区打卡热力简表**：饼图展示用户打卡片区分布
- **今日推荐老店**：自动轮播小众民国老店

### 民国风 UI 设计
- 配色：胭脂红、青砖灰、木棕、米黄、墨黑复古色系
- 字体：楷体（标题）、仿宋（正文）、宋体（报刊）
- 纹理：宣纸纹理、旧报纸网点、牛皮纸背景、青砖墙面
- 控件：圆角复古窗框、木质雕花边框、铜框输入框
- 加载动画：蒸笼冒蒸汽 + 「寻味金陵街巷中」手写渐显

---

## 🛠 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3.4 + Vite 5.4 | 组合式 API + 单文件组件 |
| GIS 核心 | Leaflet 1.9 + leaflet.markercluster | 轻量地图库 + 点位聚合 |
| 数据可视化 | ECharts 5.5 | 数据看板复古手绘图表 |
| 动画引擎 | GSAP 3.12 | 民国风微动效 |
| 地图底图 | 高德地图栅格瓦片 | 国内极速 + 中文标注 + CSS 复古滤镜 |
| 数据存储 | localStorage | 打卡 / 收藏 / 笔记本地持久化 |

---

## 📁 项目结构

```
nanjing-food-map/
├── index.html                      # 入口 HTML
├── package.json                    # 依赖配置
├── vite.config.js                  # Vite 构建配置
├── public/
│   └── favicon.svg                 # 蒸笼图标
└── src/
    ├── main.js                     # 应用入口
    ├── App.vue                     # 根组件（布局 + 加载动画）
    ├── assets/
    │   └── styles/
    │       ├── variables.css       # 民国色系 / 字体 / 纹理 CSS 变量
    │       ├── global.css          # 全局重置 + 滚动条
    │       ├── textures.css        # 宣纸 / 报纸 / 木纹纹理
    │       └── vintage.css         # 民国风组件样式
    ├── components/
    │   ├── layout/
    │   │   ├── TopNav.vue          # 顶部民国报刊导航栏
    │   │   ├── SidePanel.vue       # 左侧数据看板侧边栏
    │   │   └── BottomBar.vue       # 底部民国街巷资讯栏
    │   ├── map/
    │   │   ├── MapContainer.vue    # 中央 Leaflet 地图容器
    │   │   └── ShopDetail.vue      # 店铺详情弹窗（民国木格窗）
    │   └── common/
    │       ├── CheckinBook.vue     # 我的打卡本（线装笔记本弹窗）
    │       ├── HotRanking.vue      # 热门榜单（旧报纸弹窗）
    │       └── FoodStories.vue     # 美食故事（民国插画弹窗）
    ├── composables/
    │   ├── useMap.js               # 地图初始化 / 标记 / 路线 / 聚合
    │   ├── useCheckIn.js           # 打卡 / 收藏 / 笔记状态管理
    │   └── useData.js              # 数据筛选 / 搜索 / 统计
    └── data/
        └── shops.js                # 22 家南京小吃店地理数据
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- npm >= 8

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/cxs911/webgis-.git
cd webgis-

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 浏览器访问 http://localhost:5173

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 🗺 数据说明

### 片区数据（7 个）

| 片区 | 中心坐标 | 代表特色 |
|------|---------|---------|
| 老门东 | 32.0120, 118.7900 | 门东箍桶巷老字号聚集 |
| 夫子庙 | 32.0190, 118.7920 | 秦淮八绝发源地 |
| 科巷 | 32.0420, 118.7950 | 本地人早午餐一条街 |
| 南湖 | 32.0250, 118.7400 | 老南京市井烟火气 |
| 熙南里 | 32.0300, 118.7850 | 民国风情街区 |
| 颐和路 | 32.0580, 118.7750 | 民国公馆区文艺小店 |
| 三七八巷 | 32.0150, 118.7930 | 老城南地道小吃 |

### 店铺数据字段

```javascript
{
  id: 1,                    // 店铺 ID
  name: '蒋有记锅贴',        // 店铺名称
  district: 'laomendong',   // 所属片区
  category: 'miantu',       // 小食品类
  lat: 32.0115,             // 纬度
  lng: 118.7892,            // 经度
  year: 1922,               // 创立年份
  avgPrice: 25,             // 人均消费（元）
  hours: '06:00-20:00',     // 营业时间
  tags: ['牛肉锅贴', '老字号', '秦淮八绝'],  // 标签
  signature: '牛肉锅贴',     // 招牌小吃
  story: '...',              // 民国历史故事
  checkins: 2340,            // 打卡人数
  favorites: 1890            // 收藏人数
}
```

---

## 🎨 设计系统

### 复古色系

| 变量 | 色值 | 用途 |
|------|------|------|
| `--color-rouge` | `#C23B3B` | 胭脂红 — 印章 / 重点 / 灯笼 |
| `--color-wood` | `#8B6914` | 木棕 — 招牌边框 |
| `--color-gray-brick` | `#7A7A7A` | 青砖灰 — 建筑 / 边框 |
| `--color-ink` | `#2C2C2C` | 墨黑 — 正文文字 |
| `--color-paper` | `#F5E6C8` | 宣纸米黄 — 主要背景 |
| `--color-kraft` | `#C4A265` | 牛皮纸 — 看板背景 |

### 民国字体

| 变量 | 字体族 | 用途 |
|------|--------|------|
| `--font-title` | 楷体 / STKaiti | 标题书法 |
| `--font-body` | 仿宋 / STFangsong | 正文 |
| `--font-display` | 宋体 / STSong | 展示文字 |
| `--font-ming` | 宋体 / SimSun | 报刊正文 |

### 底图复古滤镜

```css
filter: sepia(0.5) saturate(0.7) brightness(0.92) contrast(1.08) hue-rotate(-5deg);
```

---

## 🔧 关键技术实现

### 1. leaflet.markercluster 在 Vite ESM 中的兼容处理

`leaflet.markercluster` 源码直接引用全局变量 `L`，但 Vite 的 ESM 模块不会将 `leaflet` 导出的 `L` 设为全局变量，导致 `ReferenceError: L is not defined`。

**解决方案**（`useMap.js`）：
```javascript
import L from 'leaflet'
// 将 L 设为全局变量
if (typeof window !== 'undefined' && !window.L) {
  window.L = L
}
// 在 initMap 函数内动态导入
let markerClusterLoaded = false
async function initMap(containerId) {
  if (!markerClusterLoaded) {
    await import('leaflet.markercluster')
    markerClusterLoaded = true
  }
  // ...
}
```

### 2. 高德地图底图集成

使用高德地图栅格瓦片，无需 API Key，国内访问极速：

```javascript
L.tileLayer(
  'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
  {
    subdomains: ['1', '2', '3', '4'],
    maxZoom: 19,
    className: 'vintage-tile'  // 配合 CSS sepia 滤镜
  }
)
```

### 3. 数据持久化

打卡 / 收藏 / 笔记数据通过 `localStorage` 存储，刷新不丢失：

```javascript
// useCheckIn.js
const STORAGE_KEY = 'jinling-checkin-data'
// checkins: Set<number>      已打卡店铺 ID
// favorites: Set<number>     已收藏店铺 ID
// notes: Map<number, string> 店铺 ID -> 笔记内容
```

---

## 📌 迭代规划

| 阶段 | 内容 | 状态 |
|------|------|------|
| 第一阶段 | GIS 核心 + 民国 UI 基础 + 数据看板 | ✅ 已完成 |
| 第二阶段 | 打卡交互 + 搜索筛选 + 路线规划 | ✅ 已完成 |
| 第三阶段 | GSAP 复古微动效 + 手绘瓦片底图替换 | 🔄 规划中 |
| 第四阶段 | 探店手账导出 + 复古分享图 + 季节限定筛选 | 📋 待定 |

---

## 📄 开源协议

本项目仅用于学习和课程实践目的。

---

## 🙏 致谢

- [Leaflet](https://leafletjs.com/) — 开源 JavaScript 地图库
- [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) — 点位聚合插件
- [ECharts](https://echarts.apache.org/) — 数据可视化图表库
- [Vue.js](https://vuejs.org/) — 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) — 下一代前端构建工具
- [高德地图](https://amap.com/) — 地图瓦片服务

---

> 🏮 **金陵巷食记** — 寻味金陵街巷中，一盏灯笼一碗汤，半城烟火半城诗。
