// Pet species options
export const PET_SPECIES = [
    { value: 'dog', label: '狗' },
    { value: 'cat', label: '猫' },
    { value: 'bird', label: '鸟' },
    { value: 'rabbit', label: '兔子' },
    { value: 'other', label: '其他' },
] as const;

// Pet gender options
export const PET_GENDERS = [
    { value: 'male', label: '公' },
    { value: 'female', label: '母' },
    { value: 'unknown', label: '未知' },
] as const;

// Pet size options
export const PET_SIZES = [
    { value: 'small', label: '小型' },
    { value: 'medium', label: '中型' },
    { value: 'large', label: '大型' },
] as const;

// Pet status options
export const PET_STATUS = [
    { value: 'available', label: '可领养' },
    { value: 'pending', label: '待审核' },
    { value: 'adopted', label: '已领养' },
    { value: 'removed', label: '已下架' },
] as const;

// Application status options
export const APPLICATION_STATUS = [
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
] as const;

// Chinese provinces
export const PROVINCES = [
    '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省',
    '浙江省', '安徽省', '福建省', '江西省', '山东省',
    '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区',
    '海南省', '重庆市', '四川省', '贵州省', '云南省',
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
    '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省',
] as const;

// Common cities by province (simplified)
export const CITIES: Record<string, string[]> = {
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '天津市': ['天津市'],
    '重庆市': ['重庆市'],
    '广东省': ['广州市', '深圳市', '珠海市', '东莞市', '佛山市', '惠州市', '中山市', '汕头市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '台州市'],
    '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市', '扬州市', '镇江市', '徐州市'],
    '四川省': ['成都市', '绵阳市', '德阳市', '乐山市', '自贡市', '泸州市', '南充市', '宜宾市'],
    '湖北省': ['武汉市', '宜昌市', '襄阳市', '荆州市', '黄石市', '十堰市', '孝感市', '黄冈市'],
    '湖南省': ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市'],
    '福建省': ['福州市', '厦门市', '泉州市', '漳州市', '莆田市', '宁德市', '龙岩市', '三明市'],
    '山东省': ['济南市', '青岛市', '烟台市', '潍坊市', '淄博市', '临沂市', '济宁市', '威海市'],
    '河南省': ['郑州市', '洛阳市', '开封市', '新乡市', '安阳市', '焦作市', '商丘市', '南阳市'],
    '陕西省': ['西安市', '咸阳市', '宝鸡市', '渭南市', '延安市', '榆林市', '汉中市', '安康市'],
};

// User roles
export const USER_ROLES = [
    { value: 'user', label: '普通用户' },
    { value: 'publisher', label: '宠物发布者' },
    { value: 'admin', label: '管理员' },
] as const;

// Navigation links
export const NAV_LINKS = [
    { href: '/', label: '首页' },
    { href: '/pets', label: '找宠物' },
    { href: '/publish', label: '发布宠物' },
    { href: '/success-stories', label: '领养故事' },
] as const;

// Image upload config
export const IMAGE_CONFIG = {
    maxFiles: 8,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
