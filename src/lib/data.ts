export interface Car {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  ipTags: string[];
  city: string;
  cityName: string;
  contactType: 'wechat' | 'qq';
  contactValue: string;
  /** 第二联系方式类型（可选，与 contactType 不同） */
  contactType2?: 'wechat' | 'qq';
  /** 第二联系方式值 */
  contactValue2?: string;
  photos: string[];
  lat: number;
  lng: number;
  isVisible: boolean;
  createdAt: string;
  /** 用户添加的车辆：省份（来自级联选择器） */
  province?: string;
  /** 用户添加的车辆：区/县（来自级联选择器） */
  district?: string;
  /** 用户头像（base64 或默认头像路径） */
  avatar?: string;
  /** 个人简介（最多100字） */
  bio?: string;
  /** 爱好标签（最多5个） */
  hobbies?: string[];
  /** 性别 */
  gender?: 'male' | 'female';
  /** 职业 */
  occupation?: string;
}

/** 城市分组信息（用于地图聚合标记） */
export interface CityGroup {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  count: number;
}

export interface City {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
}

// ======== IP 标签（按热度分组）========

export const IP_TAGS = [
  // 国产二游/手游
  '原神',
  '崩坏星穹铁道',
  '崩坏3',
  '绝区零',
  '明日方舟',
  '碧蓝航线',
  '少女前线',
  '蔚蓝档案',
  '鸣潮',
  '战双帕弥什',
  '重返未来1999',
  '恋与深空',
  '第五人格',
  '王者荣耀',
  '阴阳师',
  '未定事件簿',
  '光与夜之恋',
  '无限暖暖',
  '闪耀暖暖',
  '恋与制作人',
  '崩坏学园2',
  '少女前线2：追放',
  '尘白禁区',
  '无期迷途',
  '幻塔',
  '白夜极光',
  '物华弥新',
  '深空之眼',
  '英雄联盟',
  // 日系动漫
  '初音未来',
  'EVA',
  'Fate',
  '东方Project',
  '海贼王',
  '火影忍者',
  '鬼灭之刃',
  '咒术回战',
  '进击的巨人',
  '赛马娘',
  '间谍过家家',
  '葬送的芙莉莲',
  '我推的孩子',
  '宝可梦',
  'Love Live!',
  '偶像大师',
  '胜利女神NIKKE',
  '弹丸论破',
  'Lycoris Recoil',
  '吉伊卡哇',
  '蓝色监狱',
  '药屋少女的呢喃',
  '龙珠',
  '灌篮高手',
  '死神',
  '刀剑神域',
  'Re:从零开始的异世界生活',
  '关于我转生变成史莱姆这档事',
  'Fate/Grand Order',
  '高达',
  'Code Geass',
  '天元突破',
  'CLANNAD',
  'Angel Beats!',
  '魔法少女小圆',
  'BanG Dream!',
  '电锯人',
  '排球少年!!',
  '黑子的篮球',
  '齐木楠雄的灾难',
  '银魂',
  '名侦探柯南',
  '数码宝贝',
  '工作细胞',
  '紫罗兰永恒花园',
  '约定的梦幻岛',
  '东京复仇者',
  '孤独摇滚',
  '怪物8号',
  '间谍教室',
  '女神异闻录',
  '黑执事',
  '物语系列',
  '某科学的超电磁炮',
  '赛博朋克：边缘行者',
  // 经典游戏/经典IP
  '舰队Collection',
  '公主连结Re:Dive',
  '碧蓝幻想',
  '怪物猎人',
  '最终幻想',
  '勇者斗恶龙',
  '星之卡比',
  '塞尔达传说',
  '超级马力欧',
  '街霸',
  '拳皇KOF',
  '我的世界',
  // 治愈系/可爱系/潮玩
  '三丽鸥',
  'Hello Kitty',
  '库洛米',
  '帕恰狗',
  '布丁狗',
  'Rilakkuma',
  '角落生物',
  'Mofusand',
  '动物森友会',
  'Pusheen',
  '龙与雀斑公主',
  // 韩系游戏
  '第七史诗',
  '天命之子',
  // VTuber
  'Hololive',
  'A-SOUL',
  '绊爱',
  // 欧美/其他
  '黑神话悟空',
  '赛博朋克2077',
  '漫威',
  'DC',
  'Undertale',
  'Cuphead',
  'Hazbin Hotel',
] as const;

export type IpTag = (typeof IP_TAGS)[number];

export const CAR_CATEGORIES = ['全部', '轿车', 'SUV', '跑车', '新能源'] as const;
export type CarCategory = (typeof CAR_CATEGORIES)[number];

// ======== 城市列表（42个）========

export const cities: City[] = [
  { id: 'beijing', name: '北京', province: '北京', lat: 39.9042, lng: 116.4074 },
  { id: 'shanghai', name: '上海', province: '上海', lat: 31.2304, lng: 121.4737 },
  { id: 'guangzhou', name: '广州', province: '广东', lat: 23.1291, lng: 113.2644 },
  { id: 'shenzhen', name: '深圳', province: '广东', lat: 22.5431, lng: 114.0579 },
  { id: 'chengdu', name: '成都', province: '四川', lat: 30.5728, lng: 104.0668 },
  { id: 'hangzhou', name: '杭州', province: '浙江', lat: 30.2741, lng: 120.1551 },
  { id: 'wuhan', name: '武汉', province: '湖北', lat: 30.5928, lng: 114.3055 },
  { id: 'nanjing', name: '南京', province: '江苏', lat: 32.0603, lng: 118.7969 },
  { id: 'chongqing', name: '重庆', province: '重庆', lat: 29.4316, lng: 106.9123 },
  { id: 'changsha', name: '长沙', province: '湖南', lat: 28.2282, lng: 112.9388 },
  { id: 'tianjin', name: '天津', province: '天津', lat: 39.3434, lng: 117.3616 },
  { id: 'xian', name: '西安', province: '陕西', lat: 34.3416, lng: 108.9398 },
  { id: 'zhengzhou', name: '郑州', province: '河南', lat: 34.7466, lng: 113.6253 },
  { id: 'suzhou', name: '苏州', province: '江苏', lat: 31.2990, lng: 120.5853 },
  { id: 'qingdao', name: '青岛', province: '山东', lat: 36.0671, lng: 120.3826 },
  { id: 'shenyang', name: '沈阳', province: '辽宁', lat: 41.8057, lng: 123.4315 },
  { id: 'xiamen', name: '厦门', province: '福建', lat: 24.4798, lng: 118.0894 },
  { id: 'hefei', name: '合肥', province: '安徽', lat: 31.8206, lng: 117.2272 },
  { id: 'fuzhou', name: '福州', province: '福建', lat: 26.0745, lng: 119.2965 },
  { id: 'nanchang', name: '南昌', province: '江西', lat: 28.6820, lng: 115.8579 },
  { id: 'haerbin', name: '哈尔滨', province: '黑龙江', lat: 45.8038, lng: 126.5350 },
  { id: 'changchun', name: '长春', province: '吉林', lat: 43.8171, lng: 125.3235 },
  { id: 'dalian', name: '大连', province: '辽宁', lat: 38.9140, lng: 121.6147 },
  { id: 'ningbo', name: '宁波', province: '浙江', lat: 29.8683, lng: 121.5440 },
  { id: 'wuxi', name: '无锡', province: '江苏', lat: 31.4912, lng: 120.3119 },
  { id: 'jinan', name: '济南', province: '山东', lat: 36.6512, lng: 116.9972 },
  { id: 'shijiazhuang', name: '石家庄', province: '河北', lat: 38.0428, lng: 114.5149 },
  { id: 'kunming', name: '昆明', province: '云南', lat: 25.0389, lng: 102.7183 },
  { id: 'nanning', name: '南宁', province: '广西', lat: 22.8170, lng: 108.3665 },
  { id: 'guiyang', name: '贵阳', province: '贵州', lat: 26.6470, lng: 106.6302 },
  { id: 'dongguan', name: '东莞', province: '广东', lat: 23.0208, lng: 113.7518 },
  { id: 'zhuhai', name: '珠海', province: '广东', lat: 22.2710, lng: 113.5767 },
  { id: 'taiyuan', name: '太原', province: '山西', lat: 37.8706, lng: 112.5489 },
  { id: 'lanzhou', name: '兰州', province: '甘肃', lat: 36.0611, lng: 103.8343 },
  { id: 'haikou', name: '海口', province: '海南', lat: 20.0440, lng: 110.3500 },
  { id: 'wenzhou', name: '温州', province: '浙江', lat: 28.0006, lng: 120.6722 },
  { id: 'huhehaote', name: '呼和浩特', province: '内蒙古', lat: 40.8424, lng: 111.7490 },
  { id: 'wulumuqi', name: '乌鲁木齐', province: '新疆', lat: 43.8256, lng: 87.6168 },
  { id: 'changzhou', name: '常州', province: '江苏', lat: 31.8106, lng: 119.9741 },
  { id: 'yantai', name: '烟台', province: '山东', lat: 37.4639, lng: 121.4479 },
];

// ======== 品牌车型映射（全品牌覆盖）========

export const BRAND_MODELS: Record<string, string[]> = {
  // --- 日系 ---
  '丰田': ['86', 'SUPRA', '凯美瑞', '卡罗拉', '卡罗拉锐放', '亚洲龙', '致炫', '威驰', 'RAV4荣放', '汉兰达', '赛那', '格瑞维亚', '皇冠陆放', '雷凌', 'bZ3', '铂智4X', '普拉多'],
  '本田': ['思域', '飞度', '雅阁', '杰德', '型格', '英仕派', 'CR-V', '皓影', 'XR-V', '缤智', 'e:NP1'],
  '日产': ['轩逸', '骐达', '天籁', '奇骏', '逍客', '蓝鸟', 'ARIYA'],
  '马自达': ['3 昂克赛拉', 'CX-5', 'CX-30', 'CX-50', 'MX-5', 'EZ-6'],
  '斯巴鲁': ['BRZ', '傲虎', '森林人', '旭豹', 'WRX', 'Solterra'],
  '三菱': ['劲炫ASX'],

  // --- 德系 ---
  '大众': ['高尔夫', 'Polo', '朗逸', '帕萨特', '速腾', '迈腾', 'CC', '凌渡', '途观L', '途岳', '探岳', '探歌', 'ID.3', 'ID.4 X', 'ID.7'],
  '宝马': ['1系', '3系', '4系', '5系', '7系', 'Z4', 'X1', 'X3', 'X4', 'X5', 'i3', 'iX3', 'i4', 'M3', 'M4'],
  'MINI': ['MINI Cooper', 'MINI Clubman', 'MINI Countryman', 'MINI JCW'],
  '奔驰': ['A级', 'C级', 'E级', 'CLE', 'GLA', 'GLB', 'GLC', 'EQE', 'EQE SUV', 'CLA', 'S级'],
  '奥迪': ['A3', 'A4L', 'A6L', 'A7L', 'Q3', 'Q5L', 'Q7', 'Q2L', 'Q4 e-tron', 'e-tron GT', 'S4', 'RS4', 'RS6'],
  '保时捷': ['911', '718', 'Macan', 'Cayenne', 'Panamera', 'Taycan'],

  // --- 美系 ---
  '特斯拉': ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  '福特': ['福克斯', 'Mustang', '蒙迪欧', '锐界', '锐际', '烈马Bronco', '游骑侠Ranger', '电马Mach-E'],
  '雪佛兰': ['科鲁泽', '迈锐宝XL', '探界者', '星迈罗', '科沃兹', '开拓者'],
  '凯迪拉克': ['CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'IQ锐歌'],
  '别克': ['君越', '英朗', '威朗', '昂扬', '昂科威', 'GL8'],
  '林肯': ['冒险家', '航海家', '飞行家', '领航员', '林肯Z'],

  // --- 国产主流 ---
  '比亚迪': ['秦PLUS', '秦L', '汉', '汉L', '唐', '宋PLUS', '宋L', '元UP', '元PLUS', '海鸥', '海豚', '海豹', '海豹06 GT', '驱逐舰05', '护卫舰07'],
  '腾势': ['D9', 'N7', 'N8', 'Z9', 'Z9 GT'],
  '方程豹': ['豹5', '豹8', '钛7'],
  '仰望': ['U8', 'U7', 'U9'],
  '极氪': ['001', '007', '009', '7X', 'X', 'MIX'],
  '蔚来': ['ES6', 'ES8', 'ET5', 'ET5T', 'ET7', 'EC7', '乐道L60'],
  '小鹏': ['MONA M03', 'G6', 'G7', 'G9', 'P7+', 'P7i', 'X9', 'P5'],
  '理想': ['L6', 'L7', 'L8', 'L9', 'MEGA'],
  '问界': ['M5', 'M7', 'M8', 'M9'],
  '小米': ['SU7', 'SU7 Ultra'],
  'smart': ['精灵#1', '精灵#3', '精灵#5'],
  '领克': ['01', '02', '02 Hatchback', '03', '03+', '05', '06', '07', '07 EM-P', '08', '09', 'Z10', 'Z20', '900'],
  '长安': ['UNI-V', 'UNI-K', 'UNI-T', 'UNI-Z', 'CS75 PLUS', 'CS55 PLUS', '逸动', '逸达', '启源A05', '启源A07', '启源Q07', '深蓝SL03', '深蓝S07', '深蓝G318', '阿维塔07', '阿维塔12'],
  '吉利': ['星瑞', '星越L', '帝豪', '缤越', '缤瑞', '银河E5', '银河E8', '银河L6', '银河L7'],
  '名爵': ['MG7', 'MG6', 'MG5', 'MG ZS', 'MG Cyberster'],
  '荣威': ['RX5', 'D7', 'D5X', 'i5', 'iMAX8'],
  '奇瑞': ['瑞虎8', '瑞虎7', '瑞虎9', '艾瑞泽8', '艾瑞泽5', '风云T9', '探索06', 'iCAR 03', 'iCAR V23'],
  '长城': ['哈弗H6', '哈弗大狗', '哈弗H9', '坦克300', '坦克500', '坦克700', '魏牌蓝山', '魏牌高山', '长城炮'],
  '五菱': ['宏光MINI EV', '缤果', '星光', '星光S', '宏光', '扬光'],
  '宝骏': ['云朵', '悦也', 'KiWi', '510', '730'],
  '红旗': ['H5', 'H9', 'H6', 'HS5', 'HS7', 'E-HS9', 'E-QM5', 'HQ9'],
  '广汽传祺': ['GS4', 'GS8', 'M8', 'M6', '影豹', '影酷', 'E9'],
  '广汽埃安': ['AION S', 'AION Y', 'AION V', 'AION RT', '昊铂GT', '昊铂SSR'],
  '零跑': ['C01', 'C10', 'C11', 'C16', 'T03'],
  '东风': ['风神皓瀚', '奕派007', '奕派008', '纳米01', '岚图FREE', '岚图梦想家'],
  '捷途': ['旅行者', 'X70', 'X90', '山海T2'],

  // --- 韩系 ---
  '现代': ['伊兰特', '索纳塔', '途胜', '胜达', '库斯途', '沐飒', 'IONIQ 5', 'IONIQ 6'],
  '起亚': ['K3', 'K5', '赛图斯', '嘉华', '智跑', '狮铂拓界', 'EV5', 'EV6'],

  // --- 欧系其他 ---
  '沃尔沃': ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'EX30', 'EX90', 'EM90'],
  '雷克萨斯': ['ES', 'IS', 'NX', 'RX', 'UX', 'RZ', 'LC'],
  '捷尼赛思': ['G70', 'G80', 'GV60', 'GV70', 'GV80'],
  '路虎': ['揽胜', '揽胜运动版', '卫士', '发现', '发现运动版', '极光'],
  '捷豹': ['XFL', 'F-PACE', 'I-PACE'],
  '路特斯': ['ELETRE', 'EMEYA'],

  // --- 超豪华 ---
  '法拉利': ['Roma', 'SF90', '296 GTB', 'Purosangue'],
  '兰博基尼': ['Urus', 'Huracan', 'Revuelto'],
  '宾利': ['欧陆GT', '飞驰', '添越'],
  '劳斯莱斯': ['幻影', '古思特', '闪灵'],
};

// ======== 车辆分类函数 ========

export function getCarCategory(brand: string, model: string): string {
  // 新能源品牌全系列
  const evBrands = ['特斯拉', 'smart', '蔚来', '小鹏', '理想', '问界', '极氪', '小米', '零跑', '腾势', '方程豹', '仰望', '广汽埃安', '岚图', '智界'];
  if (evBrands.includes(brand)) return '新能源';

  // 新能源车型关键词
  const evKeywords = ['EV', 'MINI EV', 'ID.', 'bZ', '铂智', 'ARIYA', 'e-tron', 'EQ', 'IONIQ', 'EV5', 'EV6', 'iX', 'i3', 'i4', 'Taycan', '汉L', '海鸥', '海豚', '海豹', '秦PLUS', '驱逐舰', '护卫舰', '深蓝', '阿维塔', '启源', '岚图', 'e:NP', '乐道', 'MONA', 'P7+', 'P7i', 'IQ锐歌', 'RZ', 'Ex30', 'EM90', 'GV60', 'Cybertruck', '闪灵'];
  if (evKeywords.some((k) => model.includes(k))) return '新能源';

  // 跑车
  const sportsKeywords = ['86', 'SUPRA', 'MX-5', '03+', 'UNI-V', 'Mustang', '911', '718', 'Z4', 'BRZ', 'WRX', 'Cyberster', 'Cayman', 'Roma', 'SF90', '296', 'Huracan', 'Revuelto', 'F-PACE', 'ELETRE', 'EMEYA', 'SU7 Ultra'];
  if (sportsKeywords.some((k) => model.includes(k))) return '跑车';

  // SUV
  const suvKeywords = ['CX-', 'CR-V', '皓影', 'XR-V', '缤智', 'RAV4', '汉兰达', '赛那', '格瑞维亚', '皇冠陆放', '威兰达', '奇骏', '逍客', '傲虎', '森林人', '旭豹', 'Solterra', '途观', '途岳', '探岳', '探歌', 'X1', 'X3', 'X4', 'X5', 'GLA', 'GLB', 'GLC', 'Q3', 'Q5', 'Q7', 'Macan', 'Cayenne', 'Panamera', '锐界', '锐际', '烈马', '探界者', '开拓者', 'XT', '冒险家', '航海家', '飞行家', '领航员', 'Model Y', 'Model X', 'Model S', 'CS75', 'CS55', 'UNI-K', 'UNI-Z', '星越', '博越', 'MG ZS', 'MG HS', 'RX5', '瑞虎', '探索06', 'iCAR', '哈弗', '坦克', '魏牌', '长城炮', 'GS4', 'GS8', '影酷', 'AION V', 'AION Y', 'C11', 'C16', '山海T2', '旅行者', 'X70', 'X90', 'L6', 'L7', 'L8', 'L9', 'MEGA', 'M5', 'M7', 'M8', 'M9', 'G6', 'G7', 'G9', 'X9', '001', '009', '7X', 'MIX', 'ES8', 'EC7', '揽胜', '卫士', '发现', '极光', 'XC40', 'XC60', 'XC90', 'EX90', 'GV70', 'GV80', '添越', 'Urus', 'Purosangue'];
  if (suvKeywords.some((k) => model.includes(k))) return 'SUV';

  return '轿车';
}

// 生成渐变色占位图URL
function placeholderPhoto(color1: string, color2: string, text: string): string {
  return `https://placehold.co/600x400/${color1}/${color2}?text=${encodeURIComponent(text)}`;
}

const CARS: Car[] = [
  // ======== 原有 26 辆 ========

  // 北京 (5辆)
  {
    id: 'bj-001',
    nickname: '绫波车主小王',
    brand: '领克',
    model: '03+',
    ipTags: ['EVA'],
    city: 'beijing',
    cityName: '北京',
    contactType: 'wechat',
    contactValue: 'eva_01_driver',
    photos: [placeholderPhoto('7c3aed', 'ffffff', 'EVA+LynkCo03')],
    lat: 39.9142, lng: 116.4174,
    isVisible: true,
    createdAt: '2025-03-15',
  },
  {
    id: 'bj-002',
    nickname: '原神启动！',
    brand: '比亚迪',
    model: '汉EV',
    ipTags: ['原神'],
    city: 'beijing',
    cityName: '北京',
    contactType: 'qq',
    contactValue: '88234156',
    photos: [placeholderPhoto('2563eb', 'ffffff', 'Genshin+HanEV')],
    lat: 39.9242, lng: 116.3874,
    isVisible: true,
    createdAt: '2025-05-20',
  },
  {
    id: 'bj-003',
    nickname: '深海少女',
    brand: '马自达',
    model: '3 昂克赛拉',
    ipTags: ['初音未来', 'Fate'],
    city: 'beijing',
    cityName: '北京',
    contactType: 'wechat',
    contactValue: 'miku_fan_bj',
    photos: [placeholderPhoto('39c5bb', 'ffffff', 'Miku+Mazda3')],
    lat: 39.8842, lng: 116.4474,
    isVisible: true,
    createdAt: '2025-01-10',
  },
  {
    id: 'bj-004',
    nickname: '提瓦特旅行者',
    brand: '特斯拉',
    model: 'Model 3',
    ipTags: ['崩坏星穹铁道'],
    city: 'beijing',
    cityName: '北京',
    contactType: 'wechat',
    contactValue: 'star_rail_bj',
    photos: [placeholderPhoto('a855f7', 'ffffff', 'HSR+Model3')],
    lat: 39.9342, lng: 116.3674,
    isVisible: true,
    createdAt: '2025-06-01',
  },
  {
    id: 'bj-005',
    nickname: '忍者道',
    brand: '大众',
    model: '高尔夫',
    ipTags: ['火影忍者'],
    city: 'beijing',
    cityName: '北京',
    contactType: 'qq',
    contactValue: '66778899',
    photos: [placeholderPhoto('f97316', 'ffffff', 'Naruto+Golf')],
    lat: 39.9042, lng: 116.4274,
    isVisible: true,
    createdAt: '2025-04-12',
  },

  // 上海 (3辆)
  {
    id: 'sh-001',
    nickname: '幻想乡的快递员',
    brand: '丰田',
    model: '86',
    ipTags: ['东方Project'],
    city: 'shanghai',
    cityName: '上海',
    contactType: 'wechat',
    contactValue: 'touhou_sh',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'Touhou+86')],
    lat: 31.2404, lng: 121.4837,
    isVisible: true,
    createdAt: '2025-02-28',
  },
  {
    id: 'sh-002',
    nickname: '卫宫家的司机',
    brand: '宝马',
    model: '3系',
    ipTags: ['Fate'],
    city: 'shanghai',
    cityName: '上海',
    contactType: 'wechat',
    contactValue: 'fate_stay_night',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'Fate+BMW3')],
    lat: 31.2204, lng: 121.4637,
    isVisible: true,
    createdAt: '2025-07-05',
  },
  {
    id: 'sh-003',
    nickname: '草帽一伙',
    brand: '本田',
    model: '思域',
    ipTags: ['海贼王'],
    city: 'shanghai',
    cityName: '上海',
    contactType: 'qq',
    contactValue: '55443322',
    photos: [placeholderPhoto('eab308', 'ffffff', 'OnePiece+Civic')],
    lat: 31.2504, lng: 121.4437,
    isVisible: true,
    createdAt: '2025-03-22',
  },

  // 广州 (3辆)
  {
    id: 'gz-001',
    nickname: '卡车司机',
    brand: '日产',
    model: '轩逸',
    ipTags: ['吉伊卡哇'],
    city: 'guangzhou',
    cityName: '广州',
    contactType: 'wechat',
    contactValue: 'chiikawa_gz',
    photos: [placeholderPhoto('fbbf24', 'ffffff', 'Chiikawa+Sylphy')],
    lat: 23.1391, lng: 113.2744,
    isVisible: true,
    createdAt: '2025-05-10',
  },
  {
    id: 'gz-002',
    nickname: '蓝色监狱守门员',
    brand: '比亚迪',
    model: '元PLUS',
    ipTags: ['蓝色监狱'],
    city: 'guangzhou',
    cityName: '广州',
    contactType: 'qq',
    contactValue: '11223344',
    photos: [placeholderPhoto('2563eb', 'ffffff', 'Blluelock+YuanPlus')],
    lat: 23.1191, lng: 113.2544,
    isVisible: true,
    createdAt: '2025-06-18',
  },
  {
    id: 'gz-003',
    nickname: '蕾姆的专属座驾',
    brand: '领克',
    model: '03',
    ipTags: ['Fate', '原神'],
    city: 'guangzhou',
    cityName: '广州',
    contactType: 'wechat',
    contactValue: 'rem_fan_gz',
    photos: [placeholderPhoto('7c3aed', 'ffffff', 'Fate+LynkCo03')],
    lat: 23.1491, lng: 113.2844,
    isVisible: true,
    createdAt: '2025-04-05',
  },

  // 深圳 (2辆)
  {
    id: 'sz-001',
    nickname: '绫波丽同款',
    brand: '特斯拉',
    model: 'Model 3',
    ipTags: ['EVA', '初音未来'],
    city: 'shenzhen',
    cityName: '深圳',
    contactType: 'wechat',
    contactValue: 'miku_eva_sz',
    photos: [placeholderPhoto('06b6d4', 'ffffff', 'MikuEVA+Model3')],
    lat: 22.5531, lng: 114.0679,
    isVisible: true,
    createdAt: '2025-07-01',
  },
  {
    id: 'sz-002',
    nickname: '须弥学者',
    brand: '比亚迪',
    model: '海豚',
    ipTags: ['原神'],
    city: 'shenzhen',
    cityName: '深圳',
    contactType: 'wechat',
    contactValue: 'sumeru_scholar',
    photos: [placeholderPhoto('10b981', 'ffffff', 'Genshin+Dolphin')],
    lat: 22.5331, lng: 114.0479,
    isVisible: true,
    createdAt: '2025-05-28',
  },

  // 成都 (3辆)
  {
    id: 'cd-001',
    nickname: '火锅与痛车',
    brand: '长安',
    model: 'UNI-V',
    ipTags: ['火影忍者', '海贼王'],
    city: 'chengdu',
    cityName: '成都',
    contactType: 'qq',
    contactValue: '99887766',
    photos: [placeholderPhoto('ef4444', 'ffffff', 'Naruto+UNIV')],
    lat: 30.5828, lng: 104.0768,
    isVisible: true,
    createdAt: '2025-03-08',
  },
  {
    id: 'cd-002',
    nickname: '天才麻将少女',
    brand: '吉利',
    model: '星瑞',
    ipTags: ['东方Project'],
    city: 'chengdu',
    cityName: '成都',
    contactType: 'wechat',
    contactValue: 'touhou_cd',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'Touhou+Xingrui')],
    lat: 30.5628, lng: 104.0568,
    isVisible: true,
    createdAt: '2025-06-15',
  },
  {
    id: 'cd-003',
    nickname: '开拓者一号',
    brand: '比亚迪',
    model: '秦PLUS EV',
    ipTags: ['崩坏星穹铁道'],
    city: 'chengdu',
    cityName: '成都',
    contactType: 'wechat',
    contactValue: 'astral_cd',
    photos: [placeholderPhoto('a855f7', 'ffffff', 'HSR+QinPLUS')],
    lat: 30.5928, lng: 104.0868,
    isVisible: true,
    createdAt: '2025-04-22',
  },

  // 杭州 (2辆)
  {
    id: 'hz-001',
    nickname: '西湖边的美少女',
    brand: '本田',
    model: '飞度',
    ipTags: ['初音未来'],
    city: 'hangzhou',
    cityName: '杭州',
    contactType: 'wechat',
    contactValue: 'miku_hangzhou',
    photos: [placeholderPhoto('39c5bb', 'ffffff', 'Miku+Fit')],
    lat: 30.2841, lng: 120.1651,
    isVisible: true,
    createdAt: '2025-02-14',
  },
  {
    id: 'hz-002',
    nickname: '鬼灭之刃搬运工',
    brand: '大众',
    model: 'POLO',
    ipTags: ['Fate', 'EVA'],
    city: 'hangzhou',
    cityName: '杭州',
    contactType: 'qq',
    contactValue: '44556677',
    photos: [placeholderPhoto('7c3aed', 'ffffff', 'FateEVA+POLO')],
    lat: 30.2641, lng: 120.1451,
    isVisible: true,
    createdAt: '2025-05-30',
  },

  // 武汉 (2辆)
  {
    id: 'wh-001',
    nickname: '热干面痛车人',
    brand: '马自达',
    model: 'CX-5',
    ipTags: ['海贼王', '火影忍者'],
    city: 'wuhan',
    cityName: '武汉',
    contactType: 'wechat',
    contactValue: 'hotdry_noodle',
    photos: [placeholderPhoto('f97316', 'ffffff', 'OPNaruto+CX5')],
    lat: 30.6028, lng: 114.3155,
    isVisible: true,
    createdAt: '2025-01-20',
  },
  {
    id: 'wh-002',
    nickname: '命运之夜',
    brand: '宝马',
    model: '4系',
    ipTags: ['Fate'],
    city: 'wuhan',
    cityName: '武汉',
    contactType: 'qq',
    contactValue: '33445566',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'Fate+BMW4')],
    lat: 30.5828, lng: 114.2955,
    isVisible: true,
    createdAt: '2025-07-10',
  },

  // 南京 (2辆)
  {
    id: 'nj-001',
    nickname: '秦淮河畔的巫女',
    brand: '丰田',
    model: '86',
    ipTags: ['东方Project', '初音未来'],
    city: 'nanjing',
    cityName: '南京',
    contactType: 'wechat',
    contactValue: 'touhou_nj',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'TouhouMiku+86')],
    lat: 32.0703, lng: 118.8069,
    isVisible: true,
    createdAt: '2025-04-18',
  },
  {
    id: 'nj-002',
    nickname: '星穹铁道列车长',
    brand: '特斯拉',
    model: 'Model Y',
    ipTags: ['崩坏星穹铁道'],
    city: 'nanjing',
    cityName: '南京',
    contactType: 'wechat',
    contactValue: 'express_nj',
    photos: [placeholderPhoto('a855f7', 'ffffff', 'HSR+ModelY')],
    lat: 32.0503, lng: 118.7869,
    isVisible: true,
    createdAt: '2025-06-25',
  },

  // 重庆 (2辆)
  {
    id: 'cq-001',
    nickname: '山城痛车王',
    brand: '领克',
    model: '02 Hatchback',
    ipTags: ['EVA', '蓝色监狱'],
    city: 'chongqing',
    cityName: '重庆',
    contactType: 'qq',
    contactValue: '77889900',
    photos: [placeholderPhoto('7c3aed', 'ffffff', 'EVA+BL+02HB')],
    lat: 29.4416, lng: 106.9223,
    isVisible: true,
    createdAt: '2025-03-30',
  },
  {
    id: 'cq-002',
    nickname: '吉伊卡哇重庆分卡',
    brand: '五菱',
    model: '宏光MINI EV',
    ipTags: ['吉伊卡哇'],
    city: 'chongqing',
    cityName: '重庆',
    contactType: 'wechat',
    contactValue: 'chiikawa_cq',
    photos: [placeholderPhoto('fbbf24', 'ffffff', 'Chiikawa+MINI')],
    lat: 29.4216, lng: 106.9023,
    isVisible: true,
    createdAt: '2025-05-05',
  },

  // 长沙 (2辆)
  {
    id: 'cs-001',
    nickname: '臭豆腐与二次元',
    brand: '本田',
    model: '雅阁',
    ipTags: ['原神', '崩坏星穹铁道'],
    city: 'changsha',
    cityName: '长沙',
    contactType: 'wechat',
    contactValue: 'genshin_cs',
    photos: [placeholderPhoto('2563eb', 'ffffff', 'GenshinHSR+Accord')],
    lat: 28.2382, lng: 112.9488,
    isVisible: true,
    createdAt: '2025-04-10',
  },
  {
    id: 'cs-002',
    nickname: '橘子洲头的火影',
    brand: '日产',
    model: '骐达',
    ipTags: ['火影忍者', '东方Project'],
    city: 'changsha',
    cityName: '长沙',
    contactType: 'qq',
    contactValue: '22334455',
    photos: [placeholderPhoto('f97316', 'ffffff', 'Naruto+Touhou+Qida')],
    lat: 28.2182, lng: 112.9288,
    isVisible: true,
    createdAt: '2025-06-08',
  },

  // ======== 新增城市 Mock 数据 ========

  // 天津 (2辆)
  {
    id: 'tj-001',
    nickname: '相声与绝区零',
    brand: '领克',
    model: '06',
    ipTags: ['绝区零', '明日方舟'],
    city: 'tianjin',
    cityName: '天津',
    contactType: 'wechat',
    contactValue: 'zzz_tj_fan',
    photos: [placeholderPhoto('f59e0b', 'ffffff', 'ZZZ+Lynk06')],
    lat: 39.3534, lng: 117.3716,
    isVisible: true,
    createdAt: '2025-06-20',
  },
  {
    id: 'tj-002',
    nickname: '煎饼果子战车',
    brand: '比亚迪',
    model: '汉L',
    ipTags: ['崩坏3', '胜利女神NIKKE'],
    city: 'tianjin',
    cityName: '天津',
    contactType: 'qq',
    contactValue: '88776655',
    photos: [placeholderPhoto('ef4444', 'ffffff', 'HI3+HanL')],
    lat: 39.3334, lng: 117.3516,
    isVisible: true,
    createdAt: '2025-07-12',
  },

  // 西安 (2辆)
  {
    id: 'xa-001',
    nickname: '兵马俑也玩碧蓝航线',
    brand: '丰田',
    model: 'SUPRA',
    ipTags: ['碧蓝航线', '少女前线'],
    city: 'xian',
    cityName: '西安',
    contactType: 'wechat',
    contactValue: 'azur_xa',
    photos: [placeholderPhoto('3b82f6', 'ffffff', 'AL+SUPRA')],
    lat: 34.3516, lng: 108.9498,
    isVisible: true,
    createdAt: '2025-04-05',
  },
  {
    id: 'xa-002',
    nickname: '肉夹馍骑士',
    brand: '马自达',
    model: 'MX-5',
    ipTags: ['咒术回战', '进击的巨人'],
    city: 'xian',
    cityName: '西安',
    contactType: 'qq',
    contactValue: '44668822',
    photos: [placeholderPhoto('6d28d9', 'ffffff', 'JJK+AOT+MX5')],
    lat: 34.3316, lng: 108.9298,
    isVisible: true,
    createdAt: '2025-05-15',
  },

  // 郑州 (2辆)
  {
    id: 'zz-001',
    nickname: '烩面老板的蔚来',
    brand: '比亚迪',
    model: '海豹06 GT',
    ipTags: ['鸣潮', '战双帕弥什'],
    city: 'zhengzhou',
    cityName: '郑州',
    contactType: 'wechat',
    contactValue: 'wuwa_zz',
    photos: [placeholderPhoto('0ea5e9', 'ffffff', 'WuWa+Seal06GT')],
    lat: 34.7566, lng: 113.6453,
    isVisible: true,
    createdAt: '2025-06-01',
  },
  {
    id: 'zz-002',
    nickname: '中原区罗生门',
    brand: '大众',
    model: '高尔夫',
    ipTags: ['鬼灭之刃', '赛马娘'],
    city: 'zhengzhou',
    cityName: '郑州',
    contactType: 'qq',
    contactValue: '55667788',
    photos: [placeholderPhoto('16a34a', 'ffffff', 'DemonSlayer+Uma+Golf')],
    lat: 34.7366, lng: 113.6053,
    isVisible: true,
    createdAt: '2025-03-28',
  },

  // 苏州 (2辆)
  {
    id: 'szh-001',
    nickname: '园林里的间谍',
    brand: 'smart',
    model: '精灵#1',
    ipTags: ['间谍过家家', '药屋少女的呢喃'],
    city: 'suzhou',
    cityName: '苏州',
    contactType: 'wechat',
    contactValue: 'spy_sz_fam',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'SxF+Apoc+Smart1')],
    lat: 31.3090, lng: 120.6053,
    isVisible: true,
    createdAt: '2025-05-22',
  },
  {
    id: 'szh-002',
    nickname: '姑苏城外葬送的芙莉莲',
    brand: '本田',
    model: '杰德',
    ipTags: ['葬送的芙莉莲', '我推的孩子'],
    city: 'suzhou',
    cityName: '苏州',
    contactType: 'qq',
    contactValue: '33221100',
    photos: [placeholderPhoto('8b5cf6', 'ffffff', 'Frieren+Oshi+Jade')],
    lat: 31.2890, lng: 120.5653,
    isVisible: true,
    createdAt: '2025-06-30',
  },

  // 青岛 (2辆)
  {
    id: 'qd-001',
    nickname: '海风中的宝可梦训练师',
    brand: '名爵',
    model: 'MG7',
    ipTags: ['宝可梦', 'Love Live!'],
    city: 'qingdao',
    cityName: '青岛',
    contactType: 'wechat',
    contactValue: 'poke_qd',
    photos: [placeholderPhoto('eab308', 'ffffff', 'Pokemon+LL+MG7')],
    lat: 36.0771, lng: 120.4026,
    isVisible: true,
    createdAt: '2025-04-18',
  },
  {
    id: 'qd-002',
    nickname: '啤酒节弹丸论破',
    brand: '福特',
    model: 'Mustang',
    ipTags: ['弹丸论破', '我的英雄学院'],
    city: 'qingdao',
    cityName: '青岛',
    contactType: 'qq',
    contactValue: '11990088',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'DR+MHA+Mustang')],
    lat: 36.0571, lng: 120.3626,
    isVisible: true,
    createdAt: '2025-07-08',
  },

  // 沈阳 (2辆)
  {
    id: 'sy-001',
    nickname: '铁西区的Lycoris',
    brand: '宝马',
    model: '3系',
    ipTags: ['Lycoris Recoil', '偶像大师'],
    city: 'shenyang',
    cityName: '沈阳',
    contactType: 'wechat',
    contactValue: 'lyco_sy',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'Lycoris+IMAS+BMW3')],
    lat: 41.8157, lng: 123.4515,
    isVisible: true,
    createdAt: '2025-05-10',
  },
  {
    id: 'sy-002',
    nickname: '东北大乱斗王者',
    brand: '长城',
    model: '哈弗H6',
    ipTags: ['王者荣耀', '第五人格'],
    city: 'shenyang',
    cityName: '沈阳',
    contactType: 'qq',
    contactValue: '66338811',
    photos: [placeholderPhoto('f97316', 'ffffff', 'KOG+IDV+H6')],
    lat: 41.7957, lng: 123.4115,
    isVisible: true,
    createdAt: '2025-06-22',
  },

  // 厦门 (2辆)
  {
    id: 'xm-001',
    nickname: '鼓浪屿的蔚蓝档案',
    brand: 'smart',
    model: '精灵#3',
    ipTags: ['蔚蓝档案', '未定事件簿'],
    city: 'xiamen',
    cityName: '厦门',
    contactType: 'wechat',
    contactValue: 'ba_xm',
    photos: [placeholderPhoto('6366f1', 'ffffff', 'BA+Tears+Smart3')],
    lat: 24.4898, lng: 118.1094,
    isVisible: true,
    createdAt: '2025-03-15',
  },
  {
    id: 'xm-002',
    nickname: '沙茶面与重返未来',
    brand: '领克',
    model: 'Z20',
    ipTags: ['重返未来1999', '恋与深空'],
    city: 'xiamen',
    cityName: '厦门',
    contactType: 'qq',
    contactValue: '99224433',
    photos: [placeholderPhoto('a855f7', 'ffffff', 'R1999+LADS+Z20')],
    lat: 24.4698, lng: 118.0694,
    isVisible: true,
    createdAt: '2025-07-01',
  },

  // 合肥 (2辆)
  {
    id: 'hf-001',
    nickname: '科技城的阴阳师',
    brand: '比亚迪',
    model: '腾势Z9 GT',
    ipTags: ['阴阳师', '黑神话悟空'],
    city: 'hefei',
    cityName: '合肥',
    contactType: 'wechat',
    contactValue: 'onmyo_hf',
    photos: [placeholderPhoto('78350f', 'ffffff', 'Onmyoji+Wukong+Z9GT')],
    lat: 31.8306, lng: 117.2472,
    isVisible: true,
    createdAt: '2025-06-10',
  },
  {
    id: 'hf-002',
    nickname: '中科大的初音研究员',
    brand: '奥迪',
    model: 'A4',
    ipTags: ['初音未来', 'EVA'],
    city: 'hefei',
    cityName: '合肥',
    contactType: 'qq',
    contactValue: '55667700',
    photos: [placeholderPhoto('39c5bb', 'ffffff', 'Miku+EVA+A4')],
    lat: 31.8106, lng: 117.2072,
    isVisible: true,
    createdAt: '2025-04-25',
  },

  // 福州 (1辆)
  {
    id: 'fz-001',
    nickname: '三坊七巷的航海王',
    brand: '吉利',
    model: '帝豪',
    ipTags: ['海贼王', '进击的巨人'],
    city: 'fuzhou',
    cityName: '福州',
    contactType: 'wechat',
    contactValue: 'op_fz',
    photos: [placeholderPhoto('eab308', 'ffffff', 'OP+AOT+Emgrand')],
    lat: 26.0845, lng: 119.3165,
    isVisible: true,
    createdAt: '2025-05-18',
  },

  // 南昌 (1辆)
  {
    id: 'nc-001',
    nickname: '滕王阁下的Fate Master',
    brand: '丰田',
    model: '凯美瑞',
    ipTags: ['Fate', '赛马娘'],
    city: 'nanchang',
    cityName: '南昌',
    contactType: 'qq',
    contactValue: '22446688',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'Fate+Uma+Camry')],
    lat: 28.6920, lng: 115.8779,
    isVisible: true,
    createdAt: '2025-06-15',
  },

  // 哈尔滨 (2辆)
  {
    id: 'heb-001',
    nickname: '冰雪大世界的战双指挥官',
    brand: '大众',
    model: 'POLO',
    ipTags: ['战双帕弥什', '绝区零'],
    city: 'haerbin',
    cityName: '哈尔滨',
    contactType: 'wechat',
    contactValue: 'pgr_heb',
    photos: [placeholderPhoto('0ea5e9', 'ffffff', 'PGR+ZZZ+POLO')],
    lat: 45.8138, lng: 126.5550,
    isVisible: true,
    createdAt: '2025-01-25',
  },
  {
    id: 'heb-002',
    nickname: '索菲亚教堂前的马自达',
    brand: '马自达',
    model: '3 昂克赛拉',
    ipTags: ['东方Project', '明日方舟'],
    city: 'haerbin',
    cityName: '哈尔滨',
    contactType: 'qq',
    contactValue: '88112233',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'Touhou+AK+Mazda3')],
    lat: 45.7938, lng: 126.5150,
    isVisible: true,
    createdAt: '2025-03-10',
  },

  // 长春 (1辆)
  {
    id: 'cc-001',
    nickname: '一汽出身的Fate厨',
    brand: '丰田',
    model: '卡罗拉',
    ipTags: ['Fate', '弹丸论破'],
    city: 'changchun',
    cityName: '长春',
    contactType: 'wechat',
    contactValue: 'fate_cc',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'Fate+DR+Corolla')],
    lat: 43.8271, lng: 125.3435,
    isVisible: true,
    createdAt: '2025-05-08',
  },

  // 大连 (2辆)
  {
    id: 'dl-001',
    nickname: '星海广场的碧蓝指挥官',
    brand: '日产',
    model: '骐达',
    ipTags: ['碧蓝航线', '少女前线'],
    city: 'dalian',
    cityName: '大连',
    contactType: 'wechat',
    contactValue: 'al_dl',
    photos: [placeholderPhoto('3b82f6', 'ffffff', 'AL+GFL+Qida')],
    lat: 38.9240, lng: 121.6347,
    isVisible: true,
    createdAt: '2025-06-05',
  },
  {
    id: 'dl-002',
    nickname: '海滨路的NIKKE',
    brand: '比亚迪',
    model: '元PLUS',
    ipTags: ['胜利女神NIKKE', '恋与深空'],
    city: 'dalian',
    cityName: '大连',
    contactType: 'qq',
    contactValue: '77553311',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'NIKKE+LADS+YuanPlus')],
    lat: 38.9040, lng: 121.5947,
    isVisible: true,
    createdAt: '2025-07-15',
  },

  // 宁波 (1辆)
  {
    id: 'nb-001',
    nickname: '港口的咒术师',
    brand: '福特',
    model: '福克斯',
    ipTags: ['咒术回战', '鬼灭之刃'],
    city: 'ningbo',
    cityName: '宁波',
    contactType: 'wechat',
    contactValue: 'jjk_nb',
    photos: [placeholderPhoto('6d28d9', 'ffffff', 'JJK+DS+Focus')],
    lat: 29.8783, lng: 121.5640,
    isVisible: true,
    createdAt: '2025-04-30',
  },

  // 无锡 (1辆)
  {
    id: 'wx-001',
    nickname: '太湖边的间谍一家人',
    brand: '大众',
    model: '高尔夫',
    ipTags: ['间谍过家家', '吉伊卡哇'],
    city: 'wuxi',
    cityName: '无锡',
    contactType: 'qq',
    contactValue: 'sxf_wx',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'SxF+Chiikawa+Golf')],
    lat: 31.5012, lng: 120.3319,
    isVisible: true,
    createdAt: '2025-05-25',
  },

  // 济南 (2辆)
  {
    id: 'jn-001',
    nickname: '泉城的大英雄',
    brand: '长安',
    model: '逸动',
    ipTags: ['我的英雄学院', 'Lycoris Recoil'],
    city: 'jinan',
    cityName: '济南',
    contactType: 'wechat',
    contactValue: 'mha_jn',
    photos: [placeholderPhoto('16a34a', 'ffffff', 'MHA+Lycoris+Eado')],
    lat: 36.6612, lng: 117.0172,
    isVisible: true,
    createdAt: '2025-06-12',
  },
  {
    id: 'jn-002',
    nickname: '趵突泉边的药屋少女',
    brand: '别克',
    model: '君越',
    ipTags: ['药屋少女的呢喃', '葬送的芙莉莲'],
    city: 'jinan',
    cityName: '济南',
    contactType: 'qq',
    contactValue: '44882266',
    photos: [placeholderPhoto('8b5cf6', 'ffffff', 'Apoc+Frieren+LaCrosse')],
    lat: 36.6412, lng: 116.9772,
    isVisible: true,
    createdAt: '2025-07-02',
  },

  // 石家庄 (1辆)
  {
    id: 'sjz-001',
    nickname: '摇滚之城的崩坏3',
    brand: '长城',
    model: '坦克300',
    ipTags: ['崩坏3', '黑神话悟空'],
    city: 'shijiazhuang',
    cityName: '石家庄',
    contactType: 'wechat',
    contactValue: 'hi3_sjz',
    photos: [placeholderPhoto('ef4444', 'ffffff', 'HI3+Wukong+Tank300')],
    lat: 38.0528, lng: 114.5349,
    isVisible: true,
    createdAt: '2025-03-20',
  },

  // 昆明 (2辆)
  {
    id: 'km-001',
    nickname: '春城的花与爱丽丝',
    brand: '五菱',
    model: '缤果',
    ipTags: ['Love Live!', '偶像大师'],
    city: 'kunming',
    cityName: '昆明',
    contactType: 'wechat',
    contactValue: 'll_km',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'LL+IMAS+Bingo')],
    lat: 25.0489, lng: 102.7383,
    isVisible: true,
    createdAt: '2025-05-01',
  },
  {
    id: 'km-002',
    nickname: '滇池畔的I Spy',
    brand: '本田',
    model: '雅阁',
    ipTags: ['间谍过家家', '我推的孩子'],
    city: 'kunming',
    cityName: '昆明',
    contactType: 'qq',
    contactValue: '66112233',
    photos: [placeholderPhoto('f59e0b', 'ffffff', 'SxF+Oshi+Accord')],
    lat: 25.0289, lng: 102.6983,
    isVisible: true,
    createdAt: '2025-06-28',
  },

  // 南宁 (1辆)
  {
    id: 'nn-001',
    nickname: '螺蛳粉与蔚蓝档案',
    brand: '名爵',
    model: 'MG6',
    ipTags: ['蔚蓝档案', '鸣潮'],
    city: 'nanning',
    cityName: '南宁',
    contactType: 'wechat',
    contactValue: 'ba_nn',
    photos: [placeholderPhoto('6366f1', 'ffffff', 'BA+WuWa+MG6')],
    lat: 22.8270, lng: 108.3865,
    isVisible: true,
    createdAt: '2025-04-15',
  },

  // 贵阳 (1辆)
  {
    id: 'gy-001',
    nickname: '花溪公园的阴阳师',
    brand: '比亚迪',
    model: '秦PLUS EV',
    ipTags: ['阴阳师', '王者荣耀'],
    city: 'guiyang',
    cityName: '贵阳',
    contactType: 'qq',
    contactValue: 'onm_gy',
    photos: [placeholderPhoto('78350f', 'ffffff', 'Onmyoji+KOG+QinEV')],
    lat: 26.6570, lng: 106.6502,
    isVisible: true,
    createdAt: '2025-05-12',
  },

  // 东莞 (2辆)
  {
    id: 'dg-001',
    nickname: '世界工厂的Fate厨',
    brand: '领克',
    model: '07 EM-P',
    ipTags: ['Fate', '初音未来'],
    city: 'dongguan',
    cityName: '东莞',
    contactType: 'wechat',
    contactValue: 'fate_dg',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'Fate+Miku+07EMP')],
    lat: 23.0308, lng: 113.7718,
    isVisible: true,
    createdAt: '2025-06-08',
  },
  {
    id: 'dg-002',
    nickname: '虎门大桥的火影',
    brand: '丰田',
    model: '致炫',
    ipTags: ['火影忍者', '进击的巨人'],
    city: 'dongguan',
    cityName: '东莞',
    contactType: 'qq',
    contactValue: '88332244',
    photos: [placeholderPhoto('f97316', 'ffffff', 'Naruto+AOT+Vios')],
    lat: 23.0108, lng: 113.7318,
    isVisible: true,
    createdAt: '2025-07-18',
  },

  // 珠海 (1辆)
  {
    id: 'zh-001',
    nickname: '情侣路的宝可梦',
    brand: '大众',
    model: 'ID.3',
    ipTags: ['宝可梦', '吉伊卡哇'],
    city: 'zhuhai',
    cityName: '珠海',
    contactType: 'wechat',
    contactValue: 'poke_zh',
    photos: [placeholderPhoto('eab308', 'ffffff', 'Pokemon+Chiikawa+ID3')],
    lat: 22.2810, lng: 113.5967,
    isVisible: true,
    createdAt: '2025-04-22',
  },

  // 太原 (1辆)
  {
    id: 'ty-001',
    nickname: '煤炭之都的黑色执事',
    brand: '福特',
    model: '福克斯',
    ipTags: ['黑神话悟空', '鬼灭之刃'],
    city: 'taiyuan',
    cityName: '太原',
    contactType: 'qq',
    contactValue: 'wukong_ty',
    photos: [placeholderPhoto('1e293b', 'fbbf24', 'Wukong+DS+Focus')],
    lat: 37.8806, lng: 112.5689,
    isVisible: true,
    createdAt: '2025-06-25',
  },

  // 兰州 (1辆)
  {
    id: 'lz-001',
    nickname: '黄河之滨的明日方舟',
    brand: '长安',
    model: 'CS75 PLUS',
    ipTags: ['明日方舟', '重返未来1999'],
    city: 'lanzhou',
    cityName: '兰州',
    contactType: 'wechat',
    contactValue: 'ak_lz',
    photos: [placeholderPhoto('0f172a', '38bdf8', 'AK+R1999+CS75')],
    lat: 36.0711, lng: 103.8543,
    isVisible: true,
    createdAt: '2025-05-05',
  },

  // 海口 (2辆)
  {
    id: 'hk-001',
    nickname: '椰子树下的碧蓝航线',
    brand: '比亚迪',
    model: '海豚',
    ipTags: ['碧蓝航线', '绝区零'],
    city: 'haikou',
    cityName: '海口',
    contactType: 'wechat',
    contactValue: 'al_hk',
    photos: [placeholderPhoto('3b82f6', 'ffffff', 'AL+ZZZ+Dolphin')],
    lat: 20.0540, lng: 110.3700,
    isVisible: true,
    createdAt: '2025-03-18',
  },
  {
    id: 'hk-002',
    nickname: '骑楼老街的恋与深空',
    brand: 'smart',
    model: '精灵#1',
    ipTags: ['恋与深空', 'Love Live!'],
    city: 'haikou',
    cityName: '海口',
    contactType: 'qq',
    contactValue: 'lads_hk',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'LADS+LL+Smart1')],
    lat: 20.0340, lng: 110.3300,
    isVisible: true,
    createdAt: '2025-07-10',
  },

  // 温州 (1辆)
  {
    id: 'wz-001',
    nickname: '瓯江畔的东方Project',
    brand: '本田',
    model: '飞度',
    ipTags: ['东方Project', '少女前线'],
    city: 'wenzhou',
    cityName: '温州',
    contactType: 'wechat',
    contactValue: 'touhou_wz',
    photos: [placeholderPhoto('ec4899', 'ffffff', 'Touhou+GFL+Fit')],
    lat: 28.0106, lng: 120.6922,
    isVisible: true,
    createdAt: '2025-04-28',
  },

  // 呼和浩特 (1辆)
  {
    id: 'hhht-001',
    nickname: '大草原的赛马娘',
    brand: '长城',
    model: '坦克300',
    ipTags: ['赛马娘', '宝可梦'],
    city: 'huhehaote',
    cityName: '呼和浩特',
    contactType: 'qq',
    contactValue: 'uma_hhht',
    photos: [placeholderPhoto('16a34a', 'ffffff', 'Uma+Pokemon+Tank300')],
    lat: 40.8524, lng: 111.7690,
    isVisible: true,
    createdAt: '2025-05-20',
  },

  // 乌鲁木齐 (1辆)
  {
    id: 'wlmq-001',
    nickname: '丝路古道的黑神话',
    brand: '丰田',
    model: '凯美瑞',
    ipTags: ['黑神话悟空', '咒术回战'],
    city: 'wulumuqi',
    cityName: '乌鲁木齐',
    contactType: 'wechat',
    contactValue: 'wukong_wlmq',
    photos: [placeholderPhoto('78350f', 'ffffff', 'Wukong+JJK+Camry')],
    lat: 43.8356, lng: 87.6368,
    isVisible: true,
    createdAt: '2025-06-18',
  },

  // 常州 (1辆)
  {
    id: 'cz-001',
    nickname: '恐龙园的弹丸论破',
    brand: '别克',
    model: '英朗',
    ipTags: ['弹丸论破', '第五人格'],
    city: 'changzhou',
    cityName: '常州',
    contactType: 'qq',
    contactValue: 'dr_cz',
    photos: [placeholderPhoto('dc2626', 'ffffff', 'DR+IDV+Excelle')],
    lat: 31.8206, lng: 119.9941,
    isVisible: true,
    createdAt: '2025-05-28',
  },

  // 烟台 (2辆)
  {
    id: 'yt-001',
    nickname: '蓬莱阁的偶像大师',
    brand: '奥迪',
    model: 'A3',
    ipTags: ['偶像大师', '我推的孩子'],
    city: 'yantai',
    cityName: '烟台',
    contactType: 'wechat',
    contactValue: 'imas_yt',
    photos: [placeholderPhoto('f472b6', 'ffffff', 'IMAS+Oshi+A3')],
    lat: 37.4739, lng: 121.4679,
    isVisible: true,
    createdAt: '2025-06-30',
  },
  {
    id: 'yt-002',
    nickname: '苹果园的未定事件簿',
    brand: '保时捷',
    model: '718',
    ipTags: ['未定事件簿', '恋与深空'],
    city: 'yantai',
    cityName: '烟台',
    contactType: 'qq',
    contactValue: 'tears_yt',
    photos: [placeholderPhoto('a855f7', 'ffffff', 'Tears+LADS+718')],
    lat: 37.4539, lng: 121.4279,
    isVisible: true,
    createdAt: '2025-07-20',
  },
];



export function getInitialCars(): Car[] {
  return [...CARS];
}

export function getCarsByCity(cars: Car[], cityId: string): Car[] {
  return cars.filter((c) => c.city === cityId && c.isVisible);
}

export function getCarCountByCity(cars: Car[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const city of cities) {
    counts[city.id] = cars.filter((c) => c.city === city.id && c.isVisible).length;
  }
  return counts;
}

/**
 * 获取所有城市分组（预定义 + 用户自定义）
 * 用于地图全国视图的聚合标记
 */
export function getCityGroups(cars: Car[]): CityGroup[] {
  const visibleCars = cars.filter((c) => c.isVisible);
  const groupMap = new Map<string, CityGroup>();

  // 先处理预定义城市
  for (const city of cities) {
    const count = visibleCars.filter((c) => c.city === city.id).length;
    if (count > 0) {
      groupMap.set(city.id, {
        id: city.id,
        name: city.name,
        province: city.province,
        lat: city.lat,
        lng: city.lng,
        count,
      });
    }
  }

  // 再处理用户自定义城市（city ID 不在预定义列表中）
  for (const car of visibleCars) {
    // 跳过已处理的预定义城市
    if (cities.some((c) => c.id === car.city)) continue;

    if (groupMap.has(car.city)) {
      // 已有分组，增加计数
      const group = groupMap.get(car.city)!;
      group.count++;
    } else {
      // 新的自定义城市分组
      groupMap.set(car.city, {
        id: car.city,
        name: car.cityName,
        province: car.province || '',
        lat: car.lat,
        lng: car.lng,
        count: 1,
      });
    }
  }

  return Array.from(groupMap.values());
}

export function filterCars(
  cars: Car[],
  ipTag: string | null,
  carCategory: string | null,
  cityFilter: string | null,
  searchQuery: string | null
): Car[] {
  return cars.filter((car) => {
    if (!car.isVisible) return false;
    if (ipTag && !car.ipTags.includes(ipTag)) return false;
    if (carCategory && carCategory !== '全部') {
      const cat = getCarCategory(car.brand, car.model);
      if (cat !== carCategory) return false;
    }
    if (cityFilter) {
      const q = cityFilter.toLowerCase();
      const matches =
        car.cityName.toLowerCase().includes(q) ||
        (car.province && car.province.toLowerCase().includes(q)) ||
        (car.district && car.district.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        // 城市搜索（城市名、省份、区县）
        car.cityName.toLowerCase().includes(q) ||
        (car.province && car.province.toLowerCase().includes(q)) ||
        (car.district && car.district.toLowerCase().includes(q)) ||
        // IP标签搜索
        car.ipTags.some((tag) => tag.toLowerCase().includes(q)) ||
        // 品牌车型搜索
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        // 昵称搜索
        car.nickname.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

export function getCityById(cityId: string): City | undefined {
  return cities.find((c) => c.id === cityId);
}

export function addCar(car: Omit<Car, 'id' | 'isVisible' | 'createdAt'>): Car {
  const newCar: Car = {
    ...car,
    id: `user-${Date.now()}`,
    isVisible: true,
    createdAt: new Date().toISOString().split('T')[0],
  };
  return newCar;
}

// ======== Supabase 数据层 ========

import { supabase } from './supabase';

// 从 Supabase 加载用户添加的车辆
export async function loadUserCars(): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_user_added', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('加载用户车辆失败:', error.message);
      // 降级到 localStorage
      return loadUserCarsFromLocal();
    }

    if (!data) return [];

    return data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      nickname: (row.nickname as string) || '匿名痛车人',
      brand: row.brand as string,
      model: row.model as string,
      ipTags: (row.ip_tags as string[]) || [],
      city: row.city as string,
      cityName: row.city_name as string,
      contactType: row.contact_type as 'wechat' | 'qq',
      contactValue: row.contact_value as string,
      contactType2: (row.contact_type2 as 'wechat' | 'qq') || undefined,
      contactValue2: (row.contact_value2 as string) || undefined,
      photos: (row.photos as string[]) || [],
      lat: row.lat as number,
      lng: row.lng as number,
      isVisible: true,
      createdAt: (row.created_at as string)?.split('T')[0] || new Date().toISOString().split('T')[0],
      province: (row.province as string) || undefined,
      district: (row.district as string) || undefined,
      avatar: (row.avatar as string) || undefined,
      bio: (row.bio as string) || undefined,
      hobbies: (row.hobbies as string[]) || undefined,
      gender: (row.gender as 'male' | 'female') || undefined,
      occupation: (row.occupation as string) || undefined,
    }));
  } catch (err) {
    console.error('Supabase 连接失败，降级到 localStorage:', err);
    return loadUserCarsFromLocal();
  }
}

// 保存车辆到 Supabase（插入单条，绑定用户 ID）
export async function saveCarToSupabase(car: Car, userId?: string): Promise<string | null> {
  try {
    const { error } = await supabase.from('cars').insert({
      id: car.id,
      user_id: userId || null,
      nickname: car.nickname,
      brand: car.brand,
      model: car.model,
      ip_tags: car.ipTags,
      city: car.city,
      city_name: car.cityName,
      contact_type: car.contactType,
      contact_value: car.contactValue,
      contact_type2: car.contactType2 || null,
      contact_value2: car.contactValue2 || null,
      photos: car.photos,
      lat: car.lat,
      lng: car.lng,
      is_visible: true,
      is_user_added: true,
      created_at: car.createdAt,
      province: car.province || null,
      district: car.district || null,
      avatar: car.avatar || null,
      bio: car.bio || null,
      hobbies: car.hobbies || null,
      gender: car.gender || null,
      occupation: car.occupation || null,
    });

    if (error) {
      console.error('保存车辆失败:', error.message);
      return `保存失败: ${error.message}`;
    }
    return null;
  } catch (err) {
    console.error('Supabase 连接失败:', err);
    return `网络错误: ${err instanceof Error ? err.message : '未知错误'}`;
  }
}

// 获取所有车辆（mock + Supabase 用户数据）
export async function getAllCars(): Promise<Car[]> {
  const userCars = await loadUserCars();
  return [...CARS, ...userCars];
}

// ======== localStorage 降级方案 ========

function loadUserCarsFromLocal(): Car[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('itache_user_cars');
    if (stored) {
      return JSON.parse(stored) as Car[];
    }
  } catch {
    // ignore
  }
  return [];
}

// ======== 用户车辆管理（我的痛车）========

// 根据用户ID查询该用户添加的所有车辆
export async function getUserCars(userId: string): Promise<Car[]> {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('user_id', userId)
      .eq('is_user_added', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询用户车辆失败:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      nickname: (row.nickname as string) || '匿名痛车人',
      brand: row.brand as string,
      model: row.model as string,
      ipTags: (row.ip_tags as string[]) || [],
      city: row.city as string,
      cityName: row.city_name as string,
      contactType: row.contact_type as 'wechat' | 'qq',
      contactValue: row.contact_value as string,
      contactType2: (row.contact_type2 as 'wechat' | 'qq') || undefined,
      contactValue2: (row.contact_value2 as string) || undefined,
      photos: (row.photos as string[]) || [],
      lat: row.lat as number,
      lng: row.lng as number,
      isVisible: true,
      createdAt: (row.created_at as string)?.split('T')[0] || new Date().toISOString().split('T')[0],
      province: (row.province as string) || undefined,
      district: (row.district as string) || undefined,
      avatar: (row.avatar as string) || undefined,
      bio: (row.bio as string) || undefined,
      hobbies: (row.hobbies as string[]) || undefined,
      gender: (row.gender as 'male' | 'female') || undefined,
      occupation: (row.occupation as string) || undefined,
    }));
  } catch (err) {
    console.error('查询用户车辆异常:', err);
    return [];
  }
}

// 更新 Supabase 中指定车辆的所有字段
export async function updateCarInSupabase(car: Car, carId: string): Promise<string | null> {
  try {
    const { error } = await supabase.from('cars').update({
      nickname: car.nickname,
      brand: car.brand,
      model: car.model,
      ip_tags: car.ipTags,
      city: car.city,
      city_name: car.cityName,
      contact_type: car.contactType,
      contact_value: car.contactValue,
      contact_type2: car.contactType2 || null,
      contact_value2: car.contactValue2 || null,
      photos: car.photos,
      lat: car.lat,
      lng: car.lng,
      is_visible: car.isVisible,
      province: car.province || null,
      district: car.district || null,
      avatar: car.avatar || null,
      bio: car.bio || null,
      hobbies: car.hobbies || null,
      gender: car.gender || null,
      occupation: car.occupation || null,
    }).eq('id', carId);

    if (error) {
      console.error('更新车辆失败:', error.message);
      return `更新失败: ${error.message}`;
    }
    return null;
  } catch (err) {
    console.error('更新车辆异常:', err);
    return `网络错误: ${err instanceof Error ? err.message : '未知错误'}`;
  }
}

// 从 Supabase 删除指定车辆
export async function deleteCarFromSupabase(carId: string): Promise<string | null> {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', carId);

    if (error) {
      console.error('删除车辆失败:', error.message);
      return `删除失败: ${error.message}`;
    }
    return null;
  } catch (err) {
    console.error('删除车辆异常:', err);
    return `网络错误: ${err instanceof Error ? err.message : '未知错误'}`;
  }
}
