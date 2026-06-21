/**
 * 南京小吃店 WebGIS 核心数据
 * 覆盖：老门东、夫子庙、科巷、南湖、熙南里、颐和路、三七八巷
 */

export const districts = [
  { id: 'laomendong', name: '老门东', center: [32.0120, 118.7900], color: '#C23B3B' },
  { id: 'fuzimiao', name: '夫子庙', center: [32.0190, 118.7920], color: '#D44040' },
  { id: 'kexiang', name: '科巷', center: [32.0420, 118.7950], color: '#A0522D' },
  { id: 'nanhu', name: '南湖', center: [32.0250, 118.7400], color: '#D4A574' },
  { id: 'xinanli', name: '熙南里', center: [32.0300, 118.7850], color: '#8B6914' },
  { id: 'yihelu', name: '颐和路', center: [32.0580, 118.7750], color: '#7A7A7A' },
  { id: 'sanqiba', name: '三七八巷', center: [32.0150, 118.7930], color: '#5C5C5C' }
]

export const categories = [
  { id: 'gaotuan', name: '糕团点心', icon: '🥮' },
  { id: 'yaxue', name: '鸭血粉丝', icon: '🍜' },
  { id: 'huntun', name: '馄饨皮肚', icon: '🥟' },
  { id: 'luwei', name: '卤味熟食', icon: '🍖' },
  { id: 'chaguan', name: '老式茶馆', icon: '🍵' },
  { id: 'miantu', name: '面食锅贴', icon: '🥟' },
  { id: 'tangshui', name: '糖水甜食', icon: '🍯' },
  { id: 'xiaochi', name: '地方小吃', icon: '🥢' }
]

export const shops = [
  // ========== 老门东 ==========
  {
    id: 1, name: '蒋有记锅贴', district: 'laomendong', category: 'miantu',
    lat: 32.0115, lng: 118.7892,
    year: 1922, avgPrice: 25,
    hours: '06:00-20:00',
    tags: ['牛肉锅贴', '老字号', '秦淮八绝'],
    signature: '牛肉锅贴',
    story: '蒋有记始于民国十一年，创始人蒋庆琪在门东箍桶巷支起锅贴摊。金黄酥脆的牛肉锅贴，咬一口汁水四溢，是门东人从小吃到大的味道。老南京人说："蒋有记的锅贴，要配一碗牛肉汤，那才叫过瘾。"',
    image: '',
    checkins: 2340,
    favorites: 1890
  },
  {
    id: 2, name: '陆氏梅花糕', district: 'laomendong', category: 'gaotuan',
    lat: 32.0123, lng: 118.7898,
    year: 1945, avgPrice: 12,
    hours: '09:00-21:00',
    tags: ['梅花糕', '甜点', '手工现做'],
    signature: '豆沙梅花糕',
    story: '陆氏梅花糕的铜模子传了三代人，每一锅出炉都带着焦糖的甜香。豆沙馅是自家熬的，细腻绵密，外皮微焦。冬日里捧一块热乎乎的梅花糕，是门东巷口最温暖的画面。',
    image: '',
    checkins: 1890,
    favorites: 1520
  },
  {
    id: 3, name: '小郑酥烧饼', district: 'laomendong', category: 'gaotuan',
    lat: 32.0120, lng: 118.7905,
    year: 1930, avgPrice: 8,
    hours: '07:00-19:00',
    tags: ['酥烧饼', '葱油', '梅干菜'],
    signature: '葱油酥烧饼',
    story: '小郑家的酥烧饼烤炉从民国烧到现在，葱油烧饼层层酥脆，梅干菜烧饼咸香可口。老师傅说："烧饼要趁热吃，凉了就少了三分香。"',
    image: '',
    checkins: 1670,
    favorites: 1350
  },
  {
    id: 4, name: '鸡鸣汤包', district: 'laomendong', category: 'xiaochi',
    lat: 32.0118, lng: 118.7912,
    year: 1955, avgPrice: 22,
    hours: '06:00-20:30',
    tags: ['汤包', '鸡汁', '皮薄汤多'],
    signature: '鸡汁汤包',
    story: '鸡鸣汤包的名号源自鸡鸣寺旁的汤包摊，后来搬到门东。皮薄如纸，轻轻一戳，鸡汤汩汩流出。南京人吃汤包讲究"轻轻提，慢慢移，先开窗，后喝汤"。',
    image: '',
    checkins: 2100,
    favorites: 1750
  },
  {
    id: 5, name: '蓝老大糖粥藕店', district: 'laomendong', category: 'tangshui',
    lat: 32.0125, lng: 118.7890,
    year: 1940, avgPrice: 15,
    hours: '08:00-22:00',
    tags: ['糖粥藕', '赤豆元宵', '糖芋苗'],
    signature: '糖粥藕',
    story: '蓝老大家的糖粥藕，藕粉勾芡浓稠适中，藕块软糯，桂花蜜甜而不腻。一碗下肚，浑身暖和。老门东的娃娃们放学就爱来这儿吃一碗，几十年如一日。',
    image: '',
    checkins: 1560,
    favorites: 1280
  },

  // ========== 夫子庙 ==========
  {
    id: 6, name: '莲湖糕团店', district: 'fuzimiao', category: 'gaotuan',
    lat: 32.0195, lng: 118.7925,
    year: 1961, avgPrice: 20,
    hours: '08:00-21:00',
    tags: ['糕团', '桂花', '秦淮小吃'],
    signature: '桂花糖芋苗',
    story: '莲湖糕团店开在夫子庙贡院街上，各色糕团琳琅满目。桂花糖芋苗是招牌，芋头粉糯，桂花蜜香甜，是秦淮河边最风雅的甜点。',
    image: '',
    checkins: 3200,
    favorites: 2650
  },
  {
    id: 7, name: '奇芳阁', district: 'fuzimiao', category: 'chaguan',
    lat: 32.0190, lng: 118.7930,
    year: 1917, avgPrice: 35,
    hours: '07:00-14:00, 17:00-21:00',
    tags: ['老字号', '秦淮八绝', '茶馆', '包子'],
    signature: '什锦菜包',
    story: '奇芳阁始建于民国六年，是夫子庙最老的茶馆之一。老南京人晨起第一件事——"奇芳阁吃茶去"。一壶雨花茶，一笼什锦菜包，听一段白局，这才是金陵城的早晨。',
    image: '',
    checkins: 4560,
    favorites: 3890
  },
  {
    id: 8, name: '永和园', district: 'fuzimiao', category: 'xiaochi',
    lat: 32.0192, lng: 118.7918,
    year: 1901, avgPrice: 30,
    hours: '06:30-14:00, 17:00-20:30',
    tags: ['百年老店', '秦淮八绝', '黄桥烧饼'],
    signature: '黄桥烧饼',
    story: '永和园始于清光绪年间，是夫子庙最老资格的酒楼之一。黄桥烧饼、开洋干丝是秦淮八绝，文人墨客常聚于此。民国时期，不少文化名流在此留下佳话。',
    image: '',
    checkins: 3890,
    favorites: 3120
  },

  // ========== 科巷 ==========
  {
    id: 9, name: '草桥清真牛肉锅贴', district: 'kexiang', category: 'miantu',
    lat: 32.0415, lng: 118.7945,
    year: 1936, avgPrice: 18,
    hours: '06:00-13:00',
    tags: ['锅贴', '清真', '牛肉'],
    signature: '牛肉锅贴',
    story: '草桥锅贴藏在科巷深处的小巷里，店面不大，但每天清晨排队的食客能拐到街尾。锅贴皮薄底脆，牛肉馅鲜嫩多汁，配上辣椒醋，一口一个停不下来。',
    image: '',
    checkins: 1780,
    favorites: 1450
  },
  {
    id: 10, name: '许记皮肚面', district: 'kexiang', category: 'huntun',
    lat: 32.0422, lng: 118.7952,
    year: 1985, avgPrice: 20,
    hours: '07:00-14:00, 17:00-21:00',
    tags: ['皮肚面', '小煮面', '六合'],
    signature: '三鲜皮肚面',
    story: '皮肚面是南京特有的面条，猪皮经油炸成蜂窝状，煮进面汤里吸饱汤汁。许记的皮肚面汤底用老母鸡熬制，面条筋道，配上皮肚、肉丝、青菜，满满一大碗。',
    image: '',
    checkins: 1450,
    favorites: 1180
  },
  {
    id: 11, name: '科巷馄饨', district: 'kexiang', category: 'huntun',
    lat: 32.0418, lng: 118.7958,
    year: 1950, avgPrice: 12,
    hours: '06:00-20:00',
    tags: ['馄饨', '小馄饨', '辣油'],
    signature: '鲜肉小馄饨',
    story: '科巷馄饨的摊子在巷口摆了七十多年，皮薄馅大，汤里飘着紫菜虾皮。老南京吃馄饨爱加一勺辣油，红亮的油花浮在清汤上，一口下去从舌尖暖到胃里。',
    image: '',
    checkins: 1230,
    favorites: 980
  },

  // ========== 南湖 ==========
  {
    id: 12, name: '南湖牛肉砂锅', district: 'nanhu', category: 'xiaochi',
    lat: 32.0245, lng: 118.7395,
    year: 1978, avgPrice: 25,
    hours: '10:00-22:00',
    tags: ['砂锅', '牛肉', '粉丝'],
    signature: '牛肉粉丝砂锅',
    story: '南湖砂锅用的是煤炉小灶，砂锅端上来还在咕嘟咕嘟冒泡。牛肉炖得酥烂，粉丝吸饱浓汤，天冷时来一锅，暖身又暖胃。南湖老居民说，这里的砂锅吃了几十年都不腻。',
    image: '',
    checkins: 1120,
    favorites: 890
  },
  {
    id: 13, name: '南湖鸭血粉丝', district: 'nanhu', category: 'yaxue',
    lat: 32.0252, lng: 118.7402,
    year: 1965, avgPrice: 18,
    hours: '07:30-21:00',
    tags: ['鸭血粉丝', '老鸭汤', '豆腐果'],
    signature: '全套鸭血粉丝汤',
    story: '南湖的鸭血粉丝汤是老南京做法，汤底用老鸭熬四小时以上，奶白浓郁。鸭血嫩滑、粉丝爽口、豆腐果吸汤，撒上一把香菜，是南京人戒不掉的瘾。',
    image: '',
    checkins: 1350,
    favorites: 1100
  },

  // ========== 熙南里 ==========
  {
    id: 14, name: '熙南里茶馆', district: 'xinanli', category: 'chaguan',
    lat: 32.0305, lng: 118.7855,
    year: 1928, avgPrice: 30,
    hours: '09:00-22:00',
    tags: ['茶馆', '雨花茶', '茶点'],
    signature: '雨花茶配绿豆糕',
    story: '熙南里曾是南京最繁华的商业街区，茶馆林立。这家老茶馆保留了民国时期的装修风格，青砖墙、木格窗，一壶雨花茶配两块绿豆糕，仿佛穿越回百年前的金陵。',
    image: '',
    checkins: 890,
    favorites: 720
  },
  {
    id: 15, name: '金陵卤菜馆', district: 'xinanli', category: 'luwei',
    lat: 32.0300, lng: 118.7848,
    year: 1942, avgPrice: 35,
    hours: '09:00-20:00',
    tags: ['卤味', '盐水鸭', '酱牛肉'],
    signature: '金陵盐水鸭',
    story: '南京人无鸭不成席。金陵卤菜馆的盐水鸭用的是湖熟麻鸭，皮白肉红骨头绿，咸香适口。老板说，他家卤水是老汤，从民国传到现在，越卤越香。',
    image: '',
    checkins: 980,
    favorites: 820
  },

  // ========== 颐和路 ==========
  {
    id: 16, name: '颐和公馆茶室', district: 'yihelu', category: 'chaguan',
    lat: 32.0585, lng: 118.7755,
    year: 1936, avgPrice: 58,
    hours: '10:00-21:00',
    tags: ['民国公馆', '下午茶', '西式糕点'],
    signature: '民国下午茶套餐',
    story: '颐和路是南京最美的民国街区，梧桐掩映下遍布民国公馆。颐和公馆茶室设在一栋民国别墅里，可以品尝融合中西的下午茶，感受民国名流的生活格调。',
    image: '',
    checkins: 1560,
    favorites: 1280
  },
  {
    id: 17, name: '梧桐树下小吃', district: 'yihelu', category: 'xiaochi',
    lat: 32.0580, lng: 118.7745,
    year: 1980, avgPrice: 22,
    hours: '07:00-19:00',
    tags: ['馄饨', '包子', '家常味'],
    signature: '荠菜馄饨',
    story: '藏在颐和路梧桐树下的小吃店，不起眼的门面里藏着地道的南京家常味。荠菜馄饨清香鲜美，包子皮薄馅大，是附近老街坊的日常食堂。',
    image: '',
    checkins: 670,
    favorites: 540
  },

  // ========== 三七八巷 ==========
  {
    id: 18, name: '三七八巷鸭血粉丝', district: 'sanqiba', category: 'yaxue',
    lat: 32.0148, lng: 118.7928,
    year: 1962, avgPrice: 15,
    hours: '07:00-21:00',
    tags: ['鸭血粉丝', '老店', '街边摊'],
    signature: '鸭血粉丝汤',
    story: '三七八巷的鸭血粉丝店开了六十多年，门面虽小，味道却最地道。老板每天早上现杀活鸭熬汤，鸭血嫩得像豆腐，粉丝滑溜，喝完汤底都不剩。',
    image: '',
    checkins: 1450,
    favorites: 1200
  },
  {
    id: 19, name: '巷口卤味铺', district: 'sanqiba', category: 'luwei',
    lat: 32.0152, lng: 118.7932,
    year: 1955, avgPrice: 28,
    hours: '08:00-19:00',
    tags: ['卤味', '鸭四件', '酱鸭'],
    signature: '酱鸭',
    story: '三七八巷卤味铺是街坊的心头好，酱鸭色泽红亮，肉质紧实，甜咸适中。逢年过节，排队买卤味的人能排到巷子口。老南京说，没有卤味不成席。',
    image: '',
    checkins: 890,
    favorites: 760
  },
  {
    id: 20, name: '老南京糖芋苗', district: 'sanqiba', category: 'tangshui',
    lat: 32.0145, lng: 118.7925,
    year: 1948, avgPrice: 10,
    hours: '09:00-21:00',
    tags: ['糖芋苗', '桂花', '甜点'],
    signature: '桂花糖芋苗',
    story: '糖芋苗是南京秋冬必吃的甜点，芋头切小块煮到粉糯，浇上桂花蜜和藕粉芡，甜而不腻。这家老店的手艺传了三代，每一碗都带着桂花香。',
    image: '',
    checkins: 1100,
    favorites: 920
  },

  // ========== 夫子庙补充 ==========
  {
    id: 21, name: '刘长兴面馆', district: 'fuzimiao', category: 'miantu',
    lat: 32.0198, lng: 118.7910,
    year: 1901, avgPrice: 22,
    hours: '06:00-20:00',
    tags: ['百年老店', '小笼包', '面条'],
    signature: '小笼包',
    story: '刘长兴始于清光绪年间，和永和园齐名的百年老店。小笼包皮薄汤多，面条筋道。夫子庙逛累了，来刘长兴歇脚吃碗面，是老南京的习惯。',
    image: '',
    checkins: 2780,
    favorites: 2300
  },

  // ========== 科巷补充 ==========
  {
    id: 22, name: '白下元宵铺', district: 'kexiang', category: 'tangshui',
    lat: 32.0425, lng: 118.7948,
    year: 1938, avgPrice: 12,
    hours: '07:00-20:00',
    tags: ['元宵', '赤豆', '桂花'],
    signature: '赤豆元宵',
    story: '白下元宵铺的赤豆元宵，红豆煮得沙沙的，小元宵软糯Q弹，撒上桂花蜜，甜到心坎里。科巷的早晨，一碗元宵配两个烧饼，就是最地道的南京早餐。',
    image: '',
    checkins: 980,
    favorites: 820
  }
]

/**
 * 获取片区统计
 */
export function getDistrictStats() {
  return districts.map(d => ({
    ...d,
    count: shops.filter(s => s.district === d.id).length,
    shops: shops.filter(s => s.district === d.id)
  }))
}

/**
 * 获取品类统计
 */
export function getCategoryStats() {
  return categories.map(c => ({
    ...c,
    count: shops.filter(s => s.category === c.id).length,
    shops: shops.filter(s => s.category === c.id)
  }))
}

/**
 * 获取热门排行 (按打卡数)
 */
export function getHotRanking() {
  return [...categories]
    .map(c => ({
      name: c.name,
      icon: c.icon,
      count: shops.filter(s => s.category === c.id).length,
      totalCheckins: shops.filter(s => s.category === c.id).reduce((sum, s) => sum + s.checkins, 0)
    }))
    .sort((a, b) => b.totalCheckins - a.totalCheckins)
    .slice(0, 5)
}

/**
 * 获取打卡片区分布
 */
export function getCheckinDistribution() {
  return districts.map(d => ({
    name: d.name,
    value: shops.filter(s => s.district === d.id).reduce((sum, s) => sum + s.checkins, 0),
    color: d.color
  }))
}

/**
 * 筛选店铺
 */
export function filterShops({ district, category, keyword } = {}) {
  let result = [...shops]
  if (district) result = result.filter(s => s.district === district)
  if (category) result = result.filter(s => s.category === category)
  if (keyword) {
    const kw = keyword.toLowerCase()
    result = result.filter(s =>
      s.name.includes(kw) ||
      s.tags.some(t => t.includes(kw)) ||
      s.signature.includes(kw)
    )
  }
  return result
}
