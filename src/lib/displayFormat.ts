// 中文格式化工具
// 用于将英文展示内容转换成中文

import { getCollegeZhName } from './chineseNames';

// 月份映射
const MONTH_MAP: Record<string, string> = {
  'January': '1月',
  'Jan': '1月',
  'February': '2月',
  'Feb': '2月',
  'March': '3月',
  'Mar': '3月',
  'April': '4月',
  'Apr': '4月',
  'May': '5月',
  'June': '6月',
  'Jun': '6月',
  'July': '7月',
  'Jul': '7月',
  'August': '8月',
  'Aug': '8月',
  'September': '9月',
  'Sep': '9月',
  'October': '10月',
  'Oct': '10月',
  'November': '11月',
  'Nov': '11月',
  'December': '12月',
  'Dec': '12月',
};

// 学院术语映射
const COLLEGE_TERM_MAP: Record<string, string> = {
  'Department of': '系',
  'Faculty of': '学院',
  'School of': '学院',
  'Centre for': '中心',
  'Center for': '中心',
  'Institute of': '研究所',
  'College of': '学院',
  'Business School': '商学院',
  'Engineering': '工程',
  'Computer Science': '计算机',
  'Computing': '计算机',
  'Chemical Engineering': '化学工程',
  'Aeronautics': '航空',
  'Aerospace': '航空航天',
  'Natural Sciences': '自然科学',
  'Life Sciences': '生命科学',
  'Medicine': '医学',
  'Law': '法学',
  'Education': '教育',
  'Management': '管理',
  'Finance': '金融',
  'Data Science': '数据科学',
  'Environmental Policy': '环境政策',
  'Mathematics': '数学',
  'Physics': '物理',
  'Chemistry': '化学',
  'Biology': '生物',
  'Artificial Intelligence': '人工智能',
  'Machine Learning': '机器学习',
  'Civil Engineering': '土木工程',
  'Electrical Engineering': '电子工程',
  'Mechanical Engineering': '机械工程',
  'Architecture': '建筑',
  'Design': '设计',
  'Media': '媒体',
  'Arts': '艺术',
  'Sciences': '科学',
  'Social Sciences': '社会科学',
  'Business': '商业',
};

// 学习模式映射
const MODE_MAP: Record<string, string> = {
  'full-time': '全日制',
  'Full-time': '全日制',
  'part-time': '非全日制',
  'Part-time': '非全日制',
  'hybrid': '混合式',
  'Hybrid': '混合式',
  'online': '在线',
  'Online': '在线',
};

// 学制映射
const DURATION_MAP: Record<string, string> = {
  '1 year': '1年',
  '1 Year': '1年',
  '2 years': '2年',
  '2 Years': '2年',
  '3 years': '3年',
  '3 Years': '3年',
  '4 years': '4年',
  '4 Years': '4年',
  '12 months': '12个月',
  '18 months': '18个月',
  '24 months': '24个月',
  '36 months': '36个月',
};

// 开学月份格式化：September 2026 → 2026年9月入学
export function formatIntake(intake: string): string {
  if (!intake || intake === '待确认' || intake === '' || intake === 'undefined') return '官网暂未明确';
  
  // 处理滚动录取
  if (intake.toLowerCase().includes('rolling')) {
    return '滚动录取，建议尽早申请';
  }
  
  // 处理 "See official page"
  if (intake.toLowerCase().includes('see official') || intake.toLowerCase().includes('以官网为准')) {
    return '以官网为准';
  }
  
  // 处理多个月份：September / January → 9月 / 1月
  if (intake.includes('/')) {
    const parts = intake.split('/').map(part => part.trim());
    return parts.map(part => formatSingleIntake(part)).join(' / ') + '入学';
  }
  
  return formatSingleIntake(intake) + '入学';
}

// 格式化单个开学日期
function formatSingleIntake(intake: string): string {
  if (!intake) return '';
  
  // 匹配 "September 2026" 格式
  const fullMonthYearMatch = intake.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (fullMonthYearMatch) {
    const month = fullMonthYearMatch[1];
    const year = fullMonthYearMatch[2];
    const monthCn = MONTH_MAP[month] || month;
    return `${year}年${monthCn}`;
  }
  
  // 匹配 "Sep 2026" 格式
  const shortMonthYearMatch = intake.match(/^([A-Za-z]{3})\s+(\d{4})$/);
  if (shortMonthYearMatch) {
    const month = shortMonthYearMatch[1];
    const year = shortMonthYearMatch[2];
    const monthCn = MONTH_MAP[month] || month;
    return `${year}年${monthCn}`;
  }
  
  // 只匹配月份
  for (const [monthEn, monthCn] of Object.entries(MONTH_MAP)) {
    if (intake.includes(monthEn)) {
      return intake.replace(monthEn, monthCn);
    }
  }
  
  return intake;
}

// 雅思成绩格式化：IELTS Overall 6.5, no component below 6.0 → 雅思总分6.5，单项不低于6.0
export function formatIELTS(ielts: string): string {
  if (!ielts || ielts === '待确认' || ielts === '' || ielts === 'undefined') return '';
  
  // 处理 "See official page"
  if (ielts.toLowerCase().includes('see official')) {
    return '';
  }
  
  // 匹配 "IELTS Overall 6.5, no component below 6.0" 或 "Overall 6.5, no component below 6.0"
  const match = ielts.match(/(?:IELTS\s*)?Overall\s+([0-9.]+)(?:,\s*no\s+component\s+below\s+([0-9.]+))?/i);
  if (match) {
    const overall = match[1];
    const component = match[2];
    if (component) {
      return `雅思总分${overall}，单项不低于${component}`;
    }
    return `雅思总分${overall}`;
  }
  
  // 匹配 "IELTS 6.5" 简单格式
  const simpleMatch = ielts.match(/IELTS\s*([0-9.]+)/i);
  if (simpleMatch) {
    return `雅思${simpleMatch[1]}`;
  }
  
  // 只匹配数字
  const numMatch = ielts.match(/([0-9.]+)/);
  if (numMatch) {
    return `雅思${numMatch[1]}`;
  }
  
  return '';
}

// 托福成绩格式化：TOEFL 92 overall minimum 20 → 托福总分92，单项不低于20
export function formatTOEFL(toefl: string): string {
  if (!toefl || toefl === '待确认' || toefl === '' || toefl === 'undefined') return '';
  
  // 处理 "See official page"
  if (toefl.toLowerCase().includes('see official')) {
    return '';
  }
  
  // 匹配 "TOEFL 92 overall, minimum sub-scores 20" 或 "92 overall, minimum sub-scores 20"
  const match = toefl.match(/(?:TOEFL\s*)?([0-9]+)(?:\s+overall)?(?:,\s*minimum\s+sub-scores\s+([0-9]+))?/i);
  if (match) {
    const overall = match[1];
    const component = match[2];
    if (component) {
      return `托福总分${overall}，单项不低于${component}`;
    }
    return `托福${overall}`;
  }
  
  // 匹配 "TOEFL iBT 92" 格式
  const ibtMatch = toefl.match(/TOEFL\s+iBT\s+([0-9]+)/i);
  if (ibtMatch) {
    return `托福${ibtMatch[1]}`;
  }
  
  // 匹配简单格式 "92"
  const simpleMatch = toefl.match(/([0-9]+)/);
  if (simpleMatch) {
    return `托福${simpleMatch[1]}`;
  }
  
  return '';
}

// 截止日期格式化：Rolling admission → 滚动录取，建议尽早申请
export function formatDeadline(deadline: string): string {
  if (!deadline || deadline === '待确认' || deadline === '' || deadline === 'undefined') return '官网暂未明确';
  
  // 处理滚动录取
  if (deadline.toLowerCase().includes('rolling') || deadline.toLowerCase().includes('ongoing')) {
    return '滚动录取，建议尽早申请';
  }
  
  // 处理 "Open"
  if (deadline.toLowerCase() === 'open') {
    return '申请开放中';
  }
  
  // 处理 "See official page"
  if (deadline.toLowerCase().includes('see official')) {
    return '以官网为准';
  }

  const toChineseDate = (value: string) => {
    const isoMatch = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (isoMatch) {
      return `${isoMatch[1]}年${Number(isoMatch[2])}月${Number(isoMatch[3])}日`;
    }
    return value;
  };

  // 处理轮次：Round 2: 2026-01-07; Round 3: 2026-03-11
  if (/Round\s*\d+/i.test(deadline)) {
    const parts = deadline
      .split(/[;；]/)
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const match = part.match(/Round\s*(\d+)\s*:\s*([0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2})/i);
        if (match) return `第${match[1]}轮截止：${toChineseDate(match[2])}`;
        return part.replace(/Round\s*(\d+)/i, '第$1轮');
      });
    return parts.join('；');
  }

  const isoDate = deadline.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})/);
  if (isoDate) {
    return `申请截止：${toChineseDate(isoDate[1])}`;
  }

  return deadline;
}

// 语言要求格式化（综合雅思和托福）
export function formatLanguageRequirement(ielts?: string, toefl?: string): string {
  const ieltsFormatted = formatIELTS(ielts || '');
  const toeflFormatted = formatTOEFL(toefl || '');
  
  if (ieltsFormatted && toeflFormatted) {
    return `${ieltsFormatted} / ${toeflFormatted}`;
  }
  
  if (ieltsFormatted) {
    return ieltsFormatted;
  }
  
  if (toeflFormatted) {
    return toeflFormatted;
  }
  
  return '官网暂未明确';
}

// 学院名称中文化
export function formatCollege(college: string): string {
  if (!college) return '';
  
  // 使用中文名称映射优先获取中文名称
  const zhName = getCollegeZhName(college);
  if (zhName && zhName !== college) {
    return zhName;
  }
  
  // 如果没有找到中文映射，使用原有的翻译逻辑作为后备
  let result = college;
  
  // 先替换完整短语
  const sortedTerms = Object.entries(COLLEGE_TERM_MAP)
    .sort((a, b) => b[0].length - a[0].length); // 长词优先
  
  for (const [termEn, termCn] of sortedTerms) {
    if (result.includes(termEn)) {
      result = result.replace(termEn, termCn);
    }
  }
  
  // 处理 "of" 结构，如 "Department of Engineering" → "工程系"
  if (result.includes(' of ')) {
    result = result.replace(/ of /g, '');
  }
  
  return result;
}

// 学习模式中文化
export function formatStudyMode(mode: string): string {
  if (!mode) return '';
  
  for (const [modeEn, modeCn] of Object.entries(MODE_MAP)) {
    if (mode === modeEn || mode.toLowerCase() === modeEn.toLowerCase()) {
      return modeCn;
    }
  }
  
  return mode;
}

// 学制中文化
export function formatDuration(duration: string): string {
  if (!duration) return '';
  
  for (const [durEn, durCn] of Object.entries(DURATION_MAP)) {
    if (duration === durEn) {
      return durCn;
    }
  }
  
  return duration;
}

// 学历层级中文化
export function formatEducationLevel(level: string): string {
  if (!level) return '';
  
  const map: Record<string, string> = {
    'undergraduate': '本科',
    'Undergraduate': '本科',
    'postgraduate': '硕士',
    'Postgraduate': '硕士',
  };
  
  return map[level] || level;
}

// 通用显示值格式化 - 处理可能为 object 的字段
export function formatDisplayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '官网暂未明确';
  }
  
  if (typeof value === 'string') {
    return value.trim() || '官网暂未明确';
  }
  
  if (typeof value === 'number') {
    return String(value);
  }
  
  if (Array.isArray(value)) {
    return value.filter(Boolean).join('、') || '官网暂未明确';
  }
  
  if (typeof value === 'object') {
    // 处理学费对象 { international, home_uk }
    const obj = value as Record<string, unknown>;
    const international = obj.international;
    const homeUk = obj.home_uk;
    
    if (international && typeof international === 'string') {
      return international.trim();
    }
    if (homeUk && typeof homeUk === 'string') {
      return homeUk.trim();
    }
    
    // 尝试获取其他字符串值
    const strValues = Object.values(obj).filter(v => typeof v === 'string' && v.trim());
    if (strValues.length > 0) {
      return strValues.join(' / ');
    }
    
    return '官网暂未明确';
  }
  
  return '官网暂未明确';
}



// 学院名称展示清洗
// 去除括号及括号内的中英混杂内容，只显示干净的中文名
// 优先使用全局映射表，其次使用清洗规则，最后使用通用规则
// 原始值始终不变，筛选逻辑使用原始值

// 全局学院名称映射表
const COLLEGE_DISPLAY_MAP: Record<string, string> = {
  // ========== Imperial College London ==========
  'Department of Aeronautics, Faculty of Engineering': '航空工程系',
  'Department of Chemical Engineering, Faculty of Engineering': '化学工程系',
  'Department of Computing, Faculty of Engineering': '计算机系',
  'Department of Electrical and Electronic Engineering, Faculty of Engineering': '电子电气工程系',
  'Department of Mechanical Engineering, Faculty of Engineering': '机械工程系',
  'Department of Bioengineering, Faculty of Engineering': '生物工程系',
  'Centre for Environmental Policy, Faculty of Natural Sciences': '环境政策中心',
  'Department of Life Sciences, Silwood Park Campus': '生命科学系',
  'Imperial College Business School': '帝国理工商学院',

  // ========== Oxford ==========
  'Department of Computer Science': '计算机科学系',
  'Department of Economics': '经济系',
  'Department of Statistics': '统计系',
  'Department of Engineering Science': '工程科学系',
  'Mathematical Institute': '数学研究所',
  'Law Faculty': '法学院',
  'Saïd Business School': '赛德商学院',
  'Said Business School': '赛德商学院',
  'Blavatnik School of Government': '布拉瓦尼克政府学院',
  'Said Business School & Department of Economics': '赛德商学院 / 经济系',
  'Mathematical Institute & Department of Statistics': '数学研究所 / 统计系',
  'Department of Statistics & Department of Computer Science': '统计系 / 计算机科学系',
  'Department of Computer Science & Department of Statistics': '计算机科学系 / 统计系',
  'Law Faculty & Said Business School': '法学院 / 赛德商学院',

  // ========== NTU Singapore ==========
  'Nanyang Business School': '南洋商学院',
  'Nanyang商学院': '南洋商学院',
  'School of Physical and Mathematical Sciences': '物理与数学科学学院',
  'School of Electrical and Electronic Engineering': '电气与电子工程学院',
  'School of Mechanical and Aerospace Engineering': '机械与航空工程学院',
  'School of Materials Science and Engineering': '材料科学与工程学院',
  'School of Chemistry, Chemical Engineering and Biotechnology': '化学、化工与生物技术学院',
  'School of Civil and Environmental Engineering': '土木与环境工程学院',
  'School of Computer Science and Engineering': '计算机科学与工程学院',
  'College of Computing and Data Science': '计算与数据科学学院',

  // ========== 其他常见学院 ==========
  'School of Business': '商学院',
  'School of Business Administration': '商学院',
  'Business School': '商学院',
  'Faculty of Business': '商学院',
  'Faculty of Business Administration': '商学院',
  'School of Economics': '经济学院',
  'Faculty of Economics': '经济学院',
  'School of Law': '法学院',
  'Law School': '法学院',
  'Faculty of Law': '法学院',
  'School of Medicine': '医学院',
  'Medical School': '医学院',
  'Faculty of Medicine': '医学院',
  'School of Engineering': '工程学院',
  'Faculty of Engineering': '工程学院',
  'School of Science': '理学院',
  'Faculty of Science': '理学院',
  'School of Arts': '文学院',
  'Faculty of Arts': '文学院',
  'School of Social Sciences': '社会科学学院',
  'Faculty of Social Sciences': '社会科学学院',
  'School of Education': '教育学院',
  'Faculty of Education': '教育学院',
  'School of Finance': '金融学院',
  'Faculty of Finance': '金融学院',
  'School of Management': '管理学院',
  'Faculty of Management': '管理学院',
  'School of Psychology': '心理学院',
  'Faculty of Psychology': '心理学院',
  'School of Journalism': '新闻学院',
  'Faculty of Journalism': '新闻学院',
  'School of Architecture': '建筑学院',
  'Faculty of Architecture': '建筑学院',
  'School of Design': '设计学院',
  'Faculty of Design': '设计学院',
  'School of Public Health': '公共卫生学院',
  'Faculty of Public Health': '公共卫生学院',
  'School of Nursing': '护理学院',
  'Faculty of Nursing': '护理学院',
  'School of Pharmacy': '药学院',
  'Faculty of Pharmacy': '药学院',
  'School of Dentistry': '牙医学院',
  'Faculty of Dentistry': '牙医学院',
  'School of Veterinary Science': '兽医学院',
  'Faculty of Veterinary Science': '兽医学院',
  'School of Agriculture': '农学院',
  'Faculty of Agriculture': '农学院',
  'School of Environmental Studies': '环境学院',
  'Faculty of Environmental Studies': '环境学院',
  'School of Information': '信息学院',
  'Faculty of Information': '信息学院',
  'School of Computer Science': '计算机学院',
  'Faculty of Computer Science': '计算机学院',
  'School of Mathematics': '数学学院',
  'Faculty of Mathematics': '数学学院',
  'School of Physics': '物理学院',
  'Faculty of Physics': '物理学院',
  'School of Chemistry': '化学学院',
  'Faculty of Chemistry': '化学学院',
  'School of Biology': '生物学院',
  'Faculty of Biology': '生物学院',
  'School of History': '历史学院',
  'Faculty of History': '历史学院',
  'School of Philosophy': '哲学学院',
  'Faculty of Philosophy': '哲学学院',
  'School of Politics': '政治学院',
  'Faculty of Politics': '政治学院',
  'School of Sociology': '社会学学院',
  'Faculty of Sociology': '社会学学院',
  'School of Linguistics': '语言学院',
  'Faculty of Linguistics': '语言学院',
  'School of Media': '传媒学院',
  'Faculty of Media': '传媒学院',
  'School of Communication': '传播学院',
  'Faculty of Communication': '传播学院',
  'School of International Relations': '国际关系学院',
  'Faculty of International Relations': '国际关系学院',
  'School of Finance and Economics': '金融与经济学院',
  'Faculty of Finance and Economics': '金融与经济学院',
};

// 通用 Department 规则
function translateDepartment(dept: string): string {
  const deptMap: Record<string, string> = {
    'Finance': '金融',
    'Economics': '经济',
    'Management': '管理',
    'Marketing': '市场营销',
    'Accounting': '会计',
    'Business': '商业',
    'Computer Science': '计算机科学',
    'Data Science': '数据科学',
    'Artificial Intelligence': '人工智能',
    'Machine Learning': '机器学习',
    'Statistics': '统计',
    'Mathematics': '数学',
    'Physics': '物理',
    'Chemistry': '化学',
    'Biology': '生物',
    'Medicine': '医学',
    'Nursing': '护理',
    'Pharmacy': '药学',
    'Law': '法学',
    'Education': '教育',
    'Psychology': '心理学',
    'Engineering': '工程',
    'Mechanical Engineering': '机械工程',
    'Electrical Engineering': '电气工程',
    'Electronic Engineering': '电子工程',
    'Civil Engineering': '土木工程',
    'Chemical Engineering': '化学工程',
    'Aerospace Engineering': '航空航天工程',
    'Aeronautics': '航空',
    'Bioengineering': '生物工程',
    'Environmental Engineering': '环境工程',
    'Materials Science': '材料科学',
    'Architecture': '建筑',
    'Design': '设计',
    'Art': '艺术',
    'History': '历史',
    'Philosophy': '哲学',
    'Politics': '政治学',
    'Sociology': '社会学',
    'Linguistics': '语言学',
    'Journalism': '新闻学',
    'Communication': '传播学',
    'International Relations': '国际关系',
    'Public Health': '公共卫生',
    'Environmental Policy': '环境政策',
    'Life Sciences': '生命科学',
    'Earth Sciences': '地球科学',
    'Geology': '地质学',
    'Geography': '地理学',
    'Agriculture': '农业',
    'Veterinary': '兽医',
    'Dentistry': '牙科',
    'Optometry': '眼视光',
    'Nutrition': '营养学',
    'Sports': '体育学',
    'Music': '音乐',
    'Theatre': '戏剧',
    'Film': '电影',
    'Literature': '文学',
    'Language': '语言',
    'Translation': '翻译',
    'Information': '信息',
    'Library': '图书馆',
    'Tourism': '旅游',
    'Hotel Management': '酒店管理',
    'Real Estate': '房地产',
    'Supply Chain': '供应链',
    'Operations': '运营管理',
    'Strategy': '战略管理',
    'Entrepreneurship': '创业学',
    'Innovation': '创新',
    'Leadership': '领导力',
    'Ethics': '伦理',
    'Policy': '政策',
    'Government': '政府',
    'Public Policy': '公共政策',
    'Social Policy': '社会政策',
    'Econometrics': '计量经济学',
    'Finance and Economics': '金融经济学',
    'Computational': '计算',
    'Quantitative': '量化',
    'Applied': '应用',
    'Theoretical': '理论',
    'Clinical': '临床',
    'Health': '健康',
    'Molecular': '分子',
    'Cellular': '细胞',
    'Genetics': '遗传学',
    'Neuroscience': '神经科学',
    'Immunology': '免疫学',
    'Oncology': '肿瘤学',
    'Cardiology': '心脏病学',
    'Pediatrics': '儿科',
    'Surgery': '外科',
    'Radiology': '放射学',
    'Anatomy': '解剖学',
    'Physiology': '生理学',
    'Pathology': '病理学',
    'Microbiology': '微生物学',
    'Biotechnology': '生物技术',
    'Biochemistry': '生物化学',
    'Biomedical': '生物医学',
    'Nanotechnology': '纳米技术',
    'Robotics': '机器人',
    'Automation': '自动化',
    'Telecommunications': '电信',
    'Signal Processing': '信号处理',
    'Control Systems': '控制系统',
    'Power Systems': '电力系统',
    'Energy': '能源',
    'Renewable Energy': '可再生能源',
    'Climate': '气候',
    'Sustainability': '可持续发展',
    'Urban Planning': '城市规划',
    'Transportation': '交通运输',
    'Infrastructure': '基础设施',
    'Construction': '建筑施工',
    'Surveying': '测量',
    'Mining': '采矿',
    'Petroleum': '石油',
    'Geophysics': '地球物理',
    'Ocean': '海洋',
    'Atmospheric': '大气',
    'Meteorology': '气象学',
    'Astronomy': '天文学',
    'Astrophysics': '天体物理',
    'Cosmology': '宇宙学',
    'Particle Physics': '粒子物理',
    'Quantum': '量子',
    'Materials': '材料',
    'Metallurgy': '冶金',
    'Polymer': '高分子',
    'Ceramics': '陶瓷',
    'Textile': '纺织',
    'Food Science': '食品科学',
    'Chemical': '化学',
    'Process Engineering': '过程工程',
    'Product Design': '产品设计',
    'Industrial Design': '工业设计',
    'Visual Communication': '视觉传达',
    'Graphic Design': '平面设计',
    'Interior Design': '室内设计',
    'Landscape Architecture': '景观建筑',
    'Urban Design': '城市设计',
    'Film and Television': '影视',
    'Animation': '动画',
    'Photography': '摄影',
    'Creative Writing': '创意写作',
    'English': '英语',
    'Chinese': '中文',
    'French': '法语',
    'German': '德语',
    'Spanish': '西班牙语',
    'Japanese': '日语',
    'Korean': '韩语',
    'Arabic': '阿拉伯语',
    'Classics': '古典学',
    'Archaeology': '考古学',
    'Anthropology': '人类学',
    'Cultural Studies': '文化研究',
    'Gender Studies': '性别研究',
    'Development Studies': '发展研究',
    'International Development': '国际发展',
    'Area Studies': '区域研究',
    'Asian Studies': '亚洲研究',
    'European Studies': '欧洲研究',
    'American Studies': '美洲研究',
    'African Studies': '非洲研究',
    'Middle Eastern Studies': '中东研究',
    'Security Studies': '安全研究',
    'Terrorism Studies': '恐怖主义研究',
    'Criminology': '犯罪学',
    'Forensic': '法医',
    'Psychiatry': '精神病学',
    'Psychoanalysis': '精神分析',
    'Counselling': '辅导',
    'Social Work': '社会工作',
    'Public Administration': '公共管理',
    'Nonprofit Management': '非营利管理',
    'Project Management': '项目管理',
    'Risk Management': '风险管理',
    'Insurance': '保险',
    'Actuarial': '精算',
    'Banking': '银行学',
    'Investment': '投资',
    'Wealth Management': '财富管理',
    'Corporate Finance': '公司金融',
    'Asset Pricing': '资产定价',
    'Financial Engineering': '金融工程',
    'Financial Technology': '金融科技',
    'FinTech': '金融科技',
    'Digital Finance': '数字金融',
    'Management of Technology': '技术管理',
    'Innovation Management': '创新管理',
    'Knowledge Management': '知识管理',
    'Information Systems': '信息系统',
    'Information Management': '信息管理',
    'Business Informatics': '商业信息学',
    'E-Business': '电子商务',
    'E-Commerce': '电子商务',
    'Digital Business': '数字商业',
    'Digital Marketing': '数字营销',
    'Human Resources': '人力资源',
    'Organizational Behavior': '组织行为',
    'Organisational Behavior': '组织行为',
    'Labour Economics': '劳动经济学',
    'Labor Economics': '劳动经济学',
    'Industrial Relations': '劳动关系',
    'Operations Research': '运筹学',
    'Decision Science': '决策科学',
    'System Science': '系统科学',
    'Systems Engineering': '系统工程',
    'Software Engineering': '软件工程',
    'Computer Engineering': '计算机工程',
    'Information Engineering': '信息工程',
    'Network Engineering': '网络工程',
    'Cybersecurity': '网络安全',
    'Information Security': '信息安全',
    'Cryptography': '密码学',
    'Blockchain': '区块链',
    'Distributed Systems': '分布式系统',
    'Cloud Computing': '云计算',
    'Big Data': '大数据',
    'Data Analytics': '数据分析',
    'Business Analytics': '商业分析',
    'Predictive Analytics': '预测分析',
    'Prescriptive Analytics': '处方分析',
    'Descriptive Analytics': '描述性分析',
    'Statistical Learning': '统计学习',
    'Deep Learning': '深度学习',
    'Neural Networks': '神经网络',
    'Computer Vision': '计算机视觉',
    'Natural Language Processing': '自然语言处理',
    'Speech Processing': '语音处理',
    'Pattern Recognition': '模式识别',
    'Human-Computer Interaction': '人机交互',
    'User Experience': '用户体验',
    'User Interface': '用户界面',
    'Interaction Design': '交互设计',
    'Game Design': '游戏设计',
    'Gamification': '游戏化',
    'Virtual Reality': '虚拟现实',
    'Augmented Reality': '增强现实',
    'Mixed Reality': '混合现实',
    'Extended Reality': '扩展现实',
    'Multimedia': '多媒体',
    'Digital Media': '数字媒体',
    'Media Studies': '媒体研究',
    'Media Management': '媒体管理',
    'Film Studies': '电影研究',
    'Film Production': '电影制作',
    'Screenwriting': '剧本创作',
    'Theatre Studies': '戏剧研究',
    'Performing Arts': '表演艺术',
    'Dance': '舞蹈',
    'Music Performance': '音乐表演',
    'Music Composition': '音乐作曲',
    'Music Theory': '音乐理论',
    'Ethnomusicology': '民族音乐学',
    'Art History': '艺术史',
    'Art Theory': '艺术理论',
    'Curating': '策展',
    'Museum Studies': '博物馆学',
    'Conservation': '文物保护',
    'Cultural Heritage': '文化遗产',
    'Tourism Management': '旅游管理',
    'Hospitality Management': '酒店管理',
    'Event Management': '活动管理',
    'Convention Management': '会展管理',
    'Leisure Studies': '休闲研究',
    'Recreation Management': '休闲管理',
    'Sports Management': '体育管理',
    'Sports Science': '体育科学',
    'Kinesiology': '运动学',
    'Physical Education': '体育教育',
    'Coaching': '教练',
    'Sports Medicine': '运动医学',
    'Sports Psychology': '运动心理学',
    'Sport Management': '体育管理',
    'Exercise Science': '运动科学',
    'Public Relations': '公共关系',
    'Corporate Communication': '企业传播',
    'Strategic Communication': '战略传播',
    'Advertising': '广告学',
    'Brand Management': '品牌管理',
    'Marketing Communications': '营销传播',
    'Consumer Behavior': '消费者行为',
    'Consumer Psychology': '消费者心理学',
    'Sales Management': '销售管理',
    'Retail Management': '零售管理',
    'Supply Chain Management': '供应链管理',
    'Logistics Management': '物流管理',
    'Procurement': '采购',
    'Purchasing': '采购',
    'Inventory Management': '库存管理',
    'Warehouse Management': '仓储管理',
    'Transportation Management': '运输管理',
    'International Business': '国际商务',
    'Cross-Cultural Management': '跨文化管理',
    'Global Business': '全球商务',
    'Export-Import Management': '进出口管理',
    'Trade': '贸易',
    'Customs': '海关',
    'Tax': '税务',
    'Auditing': '审计',
    'Accounting and Finance': '会计与金融',
    'Management Accounting': '管理会计',
    'Financial Accounting': '财务会计',
    'Government Accounting': '政府会计',
    'Forensic Accounting': '法务会计',
    'Taxation': '税务',
    'Corporate Taxation': '公司税务',
    'International Taxation': '国际税务',
    'Estate Planning': '遗产规划',
    'Wealth Planning': '财富规划',
    'Pension': '养老金',
    'Corporate Governance': '公司治理',
    'Business Ethics': '商业伦理',
    'Corporate Social Responsibility': '企业社会责任',
    'Sustainability Management': '可持续发展管理',
    'Environmental Management': '环境管理',
    'Green Management': '绿色管理',
    'Climate Change': '气候变化',
    'Carbon Management': '碳管理',
    'Waste Management': '废弃物管理',
    'Water Management': '水资源管理',
    'Energy Management': '能源管理',
    'Building Services': '建筑服务',
    'Facilities Management': '设施管理',
    'Property Management': '物业管理',
    'Real Estate Management': '房地产管理',
    'Housing Studies': '住房研究',
    'Urban Studies': '城市研究',
    'Regional Development': '区域发展',
    'Rural Development': '农村发展',
    'Development Economics': '发展经济学',
    'Development Finance': '发展金融',
    'Project Finance': '项目融资',
    'Infrastructure Finance': '基础设施融资',
    'Public-Private Partnership': '公私合作',
    'PPP': '公私合作',
    'Policy Analysis': '政策分析',
    'Policy Design': '政策设计',
    'Regulatory Policy': '监管政策',
    'Economic Policy': '经济政策',
    'Health Policy': '卫生政策',
    'Education Policy': '教育政策',
    'Energy Policy': '能源政策',
    'Trade Policy': '贸易政策',
    'Industrial Policy': '产业政策',
    'Technology Policy': '技术政策',
    'Innovation Policy': '创新政策',
    'Science Policy': '科学政策',
    'Research Policy': '研究政策',
    'Higher Education': '高等教育',
    'TVET': '职业教育培训',
    'Vocational Education': '职业教育',
    'Lifelong Learning': '终身学习',
    'Adult Education': '成人教育',
    'Distance Learning': '远程学习',
    'Online Learning': '在线学习',
    'Blended Learning': '混合学习',
    'E-Learning': '电子学习',
    'MOOC': '慕课',
    'Educational Technology': '教育技术',
    'Instructional Design': '教学设计',
    'Curriculum Development': '课程开发',
    'Teaching Methods': '教学方法',
    'Pedagogy': '教育学',
    'Andragogy': '成人教育学',
    'Early Childhood Education': '学前教育',
    'Primary Education': '小学教育',
    'Secondary Education': '中学教育',
    'Special Education': '特殊教育',
    'Inclusive Education': '全纳教育',
    'Gifted Education': '天才教育',
    'Remedial Education': '补救教育',
    'Literacy Education': '识字教育',
    'Numeracy Education': '算术教育',
    'Language Education': '语言教育',
    'STEM Education': 'STEM教育',
    'Science Education': '科学教育',
    'Mathematics Education': '数学教育',
    'Engineering Education': '工程教育',
    'Technology Education': '技术教育',
  };
  return deptMap[dept] || '';
}

// 通用 School of X 规则
function translateSchoolOf(name: string): string {
  if (!name.startsWith('School of ')) return '';
  const rest = name.replace('School of ', '');
  const translated = translateDepartment(rest);
  return translated ? `${translated}学院` : '';
}

// 通用 Faculty of X 规则
function translateFacultyOf(name: string): string {
  if (!name.startsWith('Faculty of ')) return '';
  const rest = name.replace('Faculty of ', '');
  const translated = translateDepartment(rest);
  return translated ? `${translated}学院` : '';
}

// 通用 Department of X 规则
function translateDepartmentOf(name: string): string {
  if (!name.startsWith('Department of ')) return '';
  const rest = name.replace('Department of ', '');
  const translated = translateDepartment(rest);
  return translated ? `${translated}系` : '';
}

const ENGLISH_COLLEGE_DISPLAY_MAP: Record<string, string> = {
  'Imperial College Business School': '帝国理工商学院',
  'Department of Aeronautics, Faculty of Engineering': '航空工程系',
  'UCL Computer Science': '计算机科学系',
  'UCL School of Management': '管理学院',
  "IOE, UCL's Faculty of Education and Society": '教育与社会学院',
  "IOE教育学院": '教育学院',
  'UCL Faculty of Laws': '法学院',
  'UCL Department of Political Science': '政治学系',
  'UCL Global Business School for Health': '全球健康商学院',
  'UCL Department of Statistical Science': '统计科学系',
  'UCL Division of Medicine': '医学部',
  'UCL Division of Psychology and Language Sciences': '心理学与语言科学部',
  'UCL Institute for Global Health': '全球健康研究所',
  'UCL Department of Economics': '经济系',
  'UCL Department of Civil, Environmental and Geomatic Engineering': '土木、环境与测绘工程系',
  'UCL Department of Mechanical Engineering': '机械工程系',
  'UCL Department of Electronic and Electrical Engineering': '电子电气工程系',
  'UCL Department of Chemical Engineering': '化学工程系',
  'UCL School of Pharmacy': '药学院',
  'UCL Department of Information Studies': '信息研究系',
  'UCL School of Slavonic and East European Studies': '斯拉夫与东欧研究学院',
  'UCL Centre for Translation Studies': '翻译研究中心',
  'UCL Institute for Sustainable Resources': '可持续资源研究所',
  'UCL Department of Geography': '地理系',
  'The Bartlett School of Planning': '巴特莱特规划学院',
  'The Bartlett Development Planning Unit': '发展规划研究中心',
  'The Bartlett School of Sustainable Construction': '巴特莱特可持续建设学院',
  'The Bartlett School of Architecture': '巴特莱特建筑学院',
  'The Bartlett School of Environment, Energy and Resources': '巴特莱特环境、能源与资源学院',
  'The Bartlett Real Estate Institute': '巴特莱特房地产研究所',
  'School of Geography and the Environment': '地理与环境学院',
  'Faculty of English': '英语学院',
  'King\'s Business School': '国王商学院',
  'The Dickson Poon School of Law': '迪克森潘法学院',
  'Department of Informatics': '信息学系',
  'Institute of Psychiatry, Psychology and Neuroscience': '精神病学、心理学与神经科学研究所',
  'School of Life Course and Population Sciences': '生命历程与人口科学学院',
  'Faculty of Life Sciences and Medicine': '生命科学与医学学院',
  'School of Politics and Economics': '政治与经济学院',
  'School of Education, Communication and Society': '教育、传播与社会学院',
  'School of Global Affairs': '全球事务学院',
  'Department of Culture, Media and Creative Industries': '文化、媒体与创意产业系',
  'Department of Digital Humanities': '数字人文系',
  'Florence Nightingale Faculty of Nursing, Midwifery and Palliative Care': '弗洛伦斯·南丁格尔护理、助产与姑息治疗学院',
  'Alliance Manchester Business School': '曼彻斯特商学院',
  'University of Bristol Business School': '布里斯托商学院',
  'Bristol Medical School': '布里斯托医学院',
  'Bristol Law School': '布里斯托法学院',
  'Department of War Studies': '战争研究系',
  'Faculty of Humanities, School of Environment, Education and Development': '环境、教育与发展学院',
  'Faculty of Humanities, School of Arts, Languages and Cultures': '艺术、语言与文化学院',
  'School of Electrical, Electronic and Mechanical Engineering, Faculty of Science and Engineering': '电气、电子与机械工程学院',
  'School of Civil, Aerospace and Design Engineering, Faculty of Science and Engineering': '土木、航空航天与设计工程学院',
  'School for Policy Studies, Faculty of Arts, Law and Social Sciences': '政策研究学院',
  'Bristol Medical School, Faculty of Health Sciences': '布里斯托医学院',
  'Nuffield Department of Clinical Neurosciences': '纳菲尔德临床神经科学系',
  'Nuffield Department of Clinical Medicine': '纳菲尔德临床医学系',
  'Nuffield Department of Medicine': '纳菲尔德医学系',
  'Department of Social Policy and Intervention': '社会政策与干预系',
  'Centre for Evidence-Based Intervention': '循证干预中心',
  'School of Global and Area Studies': '全球与区域研究学院',
  'Latin American Centre': '拉丁美洲中心',
  'School of Anthropology and Museum Ethnography': '人类学与博物馆民族志学院',
  'Smith School of Enterprise and the Environment': '史密斯企业与环境学院',
  'Migration Observatory / Department of Social Policy': '移民观察中心 / 社会政策系',
  'Department of Politics and International Relations': '政治与国际关系系',
  'Nuffield Department of Obstetrics and Gynaecology': '纳菲尔德妇产科学系',
  'Department of Pharmacology': '药理学系',
  'Refugee Studies Centre, Department of International Development': '难民研究中心 / 国际发展系',
};

const COLLEGE_SUBJECT_MAP: Record<string, string> = {
  'Arts, Law and Social Sciences': '艺术、法律与社会科学',
  'Science and Engineering': '科学与工程',
  'Electrical, Electronic and Mechanical Engineering': '电气、电子与机械工程',
  'Sociology, Politics and International Studies': '社会学、政治与国际研究',
  'Civil, Aerospace and Design Engineering': '土木、航空航天与设计工程',
  'Engineering Mathematics and Technology': '工程数学与技术',
  'Psychological Science': '心理科学',
  'Physiology, Pharmacology and Neuroscience': '生理学、药理学与神经科学',
  'Environment, Education and Development': '环境、教育与发展',
  'Social Sciences': '社会科学',
  'War Studies': '战争研究',
  'Policy Studies': '政策研究',
  'Clinical Neurosciences': '临床神经科学',
  'Clinical Medicine': '临床医学',
  'Social Policy and Intervention': '社会政策与干预',
  'Evidence-Based Intervention': '循证干预',
  'Global and Area Studies': '全球与区域研究',
  'Anthropology and Museum Ethnography': '人类学与博物馆民族志',
  'Politics and International Relations': '政治与国际关系',
  'International Development': '国际发展',
  'Obstetrics and Gynaecology': '妇产科学',
  'Pharmacology': '药理学',
  'Arts, Languages and Cultures': '艺术、语言与文化',
  'Earth and Environmental Sciences': '地球与环境科学',
  'Health Sciences': '健康科学',
  'Medical Sciences': '医学科学',
  'Physics and Astronomy': '物理与天文',
  'Computer Science': '计算机科学',
  'Statistical Science': '统计科学',
  'Political Science': '政治学',
  'Information Studies': '信息研究',
  'Slavonic and East European Studies': '斯拉夫与东欧研究',
  'Translation Studies': '翻译研究',
  'Sustainable Resources': '可持续资源',
  'Global Health': '全球健康',
  'Global Business School for Health': '全球健康商学',
  'Life Course and Population Sciences': '生命历程与人口科学',
  'Education, Communication and Society': '教育、传播与社会',
  'Global Affairs': '全球事务',
  'Culture, Media and Creative Industries': '文化、媒体与创意产业',
  'Digital Humanities': '数字人文',
  'Politics and Economics': '政治与经济',
  'Informatics': '信息学',
  'Humanities': '人文学科',
  'Law': '法律',
  'Laws': '法律',
  'English': '英语',
  'Geography': '地理',
  'Economics': '经济',
  'Education': '教育',
  'History': '历史',
  'Philosophy': '哲学',
  'Psychology': '心理学',
  'Medicine': '医学',
  'Pharmacy': '药学',
  'Management': '管理',
  'Business': '商业',
  'Engineering': '工程',
  'Mathematics': '数学',
  'Physics': '物理',
  'Chemistry': '化学',
  'Biology': '生物',
  'Geographical Sciences': '地理科学',
  'Modern Languages': '现代语言',
  'Music': '音乐',
  'Anthropology and Archaeology': '人类学与考古学',
  'Film and Television': '电影与电视',
  'History of Art': '艺术史',
};

function hasChinese(value: string): boolean {
  return /[\u4e00-\u9fff]/.test(value);
}

function stripCollegeEnglishNoise(value: string): string {
  return value
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*（[^）]*）/g, '')
    .replace(/^[A-Za-z&.'’\-,\s]+(?=[\u4e00-\u9fff])/g, '')
    .replace(/^UCL(?=[\u4e00-\u9fff])/i, '')
    .trim();
}

function cleanEnglishCollegeName(value: string): string {
  return value
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*（[^）]*）/g, '')
    .replace(/^UCL\s+/i, '')
    .replace(/^King's\s+/i, '')
    .replace(/^University of Bristol\s+/i, '')
    .replace(/^The University of Manchester,\s*/i, '')
    .trim();
}

function translateCollegeSubject(subject: string): string {
  const normalized = subject
    .replace(/^the\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (COLLEGE_SUBJECT_MAP[normalized]) return COLLEGE_SUBJECT_MAP[normalized];
  if (translateDepartment(normalized)) return translateDepartment(normalized);

  const matched = Object.entries(COLLEGE_SUBJECT_MAP)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([key]) => normalized.toLowerCase().includes(key.toLowerCase()));

  return matched ? matched[1] : '';
}

function translateEnglishCollegeName(value: string): string {
  const exact = ENGLISH_COLLEGE_DISPLAY_MAP[value] || ENGLISH_COLLEGE_DISPLAY_MAP[cleanEnglishCollegeName(value)];
  if (exact) return exact;

  const cleaned = cleanEnglishCollegeName(value);
  const parts = cleaned.split(/\s*(?:&|\/)\s*/).filter(Boolean);
  if (parts.length > 1) {
    const translatedParts = parts.map(part => translateEnglishCollegeName(part)).filter(Boolean);
    if (translatedParts.length === parts.length) return translatedParts.join(' / ');
  }

  const commaParts = cleaned.split(',').map(part => part.trim()).filter(Boolean);
  const priorityPart = commaParts.find(part => /^(Department|School|Centre|Center|Institute|Division) of /i.test(part))
    || commaParts.find(part => /Business School|Law School|Medical School/i.test(part))
    || commaParts[0]
    || cleaned;

  const businessSchool = priorityPart.match(/(?:^|\\s)(.+?\\s)?Business School$/i);
  if (businessSchool) return '商学院';

  const lawSchool = priorityPart.match(/(?:^|\\s)(.+?\\s)?Law School$/i);
  if (lawSchool) return '法学院';

  const medicalSchool = priorityPart.match(/(?:^|\\s)(.+?\\s)?Medical School$/i);
  if (medicalSchool) return '医学院';

  const patterns: Array<[RegExp, string]> = [
    [/^Department of (.+)$/i, '系'],
    [/^School of (.+)$/i, '学院'],
    [/^Faculty of (.+)$/i, '学院'],
    [/^Division of (.+)$/i, '部'],
    [/^Institute (?:of|for) (.+)$/i, '研究所'],
    [/^Centre (?:of|for) (.+)$/i, '中心'],
    [/^Center (?:of|for) (.+)$/i, '中心'],
    [/^School for (.+)$/i, '学院'],
    [/^Department for (.+)$/i, '系'],
  ];

  for (const [pattern, suffix] of patterns) {
    const match = priorityPart.match(pattern);
    if (match) {
      const subject = translateCollegeSubject(match[1]);
      if (subject) return `${subject}${suffix}`;
    }
  }

  const keyword = translateCollegeSubject(priorityPart);
  if (keyword) {
    if (/school/i.test(priorityPart)) return `${keyword}学院`;
    if (/department/i.test(priorityPart)) return `${keyword}系`;
    if (/faculty/i.test(priorityPart)) return `${keyword}学院`;
    if (/institute/i.test(priorityPart)) return `${keyword}研究所`;
    if (/centre|center/i.test(priorityPart)) return `${keyword}中心`;
    return keyword;
  }

  return '';
}

export function formatCollegeDisplayName(name: string): string {
  if (!name) return '';

  // 1. 首先检查原始名称是否在映射表中
  const trimmed = name.trim();
  if (COLLEGE_DISPLAY_MAP[trimmed]) {
    return COLLEGE_DISPLAY_MAP[trimmed];
  }

  const englishTranslated = translateEnglishCollegeName(trimmed);
  if (englishTranslated) {
    return englishTranslated;
  }

  // 2. 去掉括号及括号内的所有内容（包括中文括号和英文括号）
  const cleaned = trimmed
    .replace(/\s*\([^)]*\)/g, '') // 去掉英文括号及其内容
    .replace(/\s*（[^）]*）/g, '') // 去掉中文括号及其内容
    .trim();

  if (hasChinese(cleaned)) {
    return stripCollegeEnglishNoise(cleaned);
  }

  // 3. 检查清洗后的名称是否在映射表中
  if (cleaned && COLLEGE_DISPLAY_MAP[cleaned]) {
    return COLLEGE_DISPLAY_MAP[cleaned];
  }

  const cleanedEnglishTranslated = translateEnglishCollegeName(cleaned);
  if (cleanedEnglishTranslated) {
    return cleanedEnglishTranslated;
  }

  // 4. 尝试通用规则转换
  // 4a. Department of X, Faculty of Y 格式
  if (cleaned.includes(', Faculty of ')) {
    const deptPart = cleaned.split(', Faculty of ')[0].replace('Department of ', '');
    const translated = translateDepartment(deptPart);
    if (translated) {
      return `${translated}系`;
    }
  }

  // 4b. School of X 格式
  const schoolOfResult = translateSchoolOf(cleaned);
  if (schoolOfResult) {
    return schoolOfResult;
  }

  // 4c. Faculty of X 格式
  const facultyOfResult = translateFacultyOf(cleaned);
  if (facultyOfResult) {
    return facultyOfResult;
  }

  // 4d. Department of X 格式
  const departmentOfResult = translateDepartmentOf(cleaned);
  if (departmentOfResult) {
    return departmentOfResult;
  }

  // 4e. Centre for X 格式
  if (cleaned.startsWith('Centre for ')) {
    const rest = cleaned.replace('Centre for ', '');
    const translated = translateDepartment(rest);
    if (translated) {
      return `${translated}中心`;
    }
  }

  // 4f. Center for X 格式
  if (cleaned.startsWith('Center for ')) {
    const rest = cleaned.replace('Center for ', '');
    const translated = translateDepartment(rest);
    if (translated) {
      return `${translated}中心`;
    }
  }

  // 4g. Institute of X 格式
  if (cleaned.startsWith('Institute of ')) {
    const rest = cleaned.replace('Institute of ', '');
    const translated = translateDepartment(rest);
    if (translated) {
      return `${translated}研究所`;
    }
  }

  // 5. 如果清洗后结果为空，fallback显示原始值
  if (!cleaned) {
    return trimmed;
  }

  // 6. 返回清洗后的名称（已经去掉括号）
  return cleaned;
}

// 货币符号映射
const CURRENCY_SYMBOLS: Record<string, string> = {
  'GBP': '£',
  'HKD': 'HKD',
  'SGD': 'SGD',
  'AUD': 'AUD',
  'NZD': 'NZD',
  'USD': '$',
  'EUR': '€',
};

// 汇率（仅供参考，实际汇率会变动）
const EXCHANGE_RATES: Record<string, number> = {
  'GBP': 9.2,   // 英镑兑人民币
  'HKD': 0.92,  // 港币兑人民币
  'SGD': 5.35,  // 新加坡元兑人民币
  'AUD': 4.75,  // 澳元兑人民币
  'NZD': 4.4,   // 新西兰元兑人民币
  'USD': 7.2,   // 美元兑人民币
  'EUR': 7.8,   // 欧元兑人民币
};

// 将金额字符串转换为数字
function parseAmount(amountStr: string): number {
  return parseFloat(amountStr.replace(/,/g, '').trim());
}

// 将金额转换为人民币（万元）
function convertToRMB(currency: string, amount: number): string {
  const rate = EXCHANGE_RATES[currency];
  if (!rate) return '';
  const rmbAmount = amount * rate / 10000; // 转换为万元
  return rmbAmount.toFixed(1);
}

// 解析学费字符串，提取货币和金额（只处理国际生学费）
function parseFeeString(feeStr: string): { currency: string; amount: string; rmbAmount?: string } {
  if (!feeStr || feeStr === '待确认') {
    return { currency: '', amount: '官网暂未明确' };
  }
  
  // 标准化输入，移除异常字符
  const normalized = feeStr.trim().replace(/\?{2,}/g, '').replace(/\s{2,}/g, ' ');
  
  // 过滤掉 Home fee 相关内容
  const filtered = normalized
    .replace(/Home\s+fee[^,)]*/gi, '')
    .replace(/Home[^,)]*/gi, '')
    .replace(/Overseas\s+Band\s*\d+/gi, '')
    .replace(/Band\s*\d+/gi, '')
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
  
  // 检查是否包含不允许显示的内容
  if (filtered.toLowerCase().includes('see official') || 
      filtered.toLowerCase().includes('home') ||
      filtered.toLowerCase().includes('overseas band') ||
      filtered.toLowerCase().includes('band')) {
    return { currency: '', amount: '官网确认' };
  }
  
  if (!filtered) {
    return { currency: '', amount: '官网暂未明确' };
  }

  // 匹配符号金额范围（如 £34,500 - £51,000）
  const symbolRangeMatch = filtered.match(/([£$€])\s*([0-9,.]+)\s*[-–]\s*(?:[£$€]\s*)?([0-9,.]+)/);
  if (symbolRangeMatch) {
    const symbol = symbolRangeMatch[1];
    const currency = symbol === '£' ? 'GBP' : symbol === '$' ? 'USD' : 'EUR';
    const amount1 = parseAmount(symbolRangeMatch[2]);
    const amount2 = parseAmount(symbolRangeMatch[3]);
    const rmb1 = convertToRMB(currency, amount1);
    const rmb2 = convertToRMB(currency, amount2);
    return {
      currency,
      amount: `${symbol}${symbolRangeMatch[2]} – ${symbol}${symbolRangeMatch[3]}/年`,
      rmbAmount: rmb1 && rmb2 ? `${rmb1}–${rmb2}` : undefined,
    };
  }

  // 匹配单一符号金额（如 £45,000 per year）
  const symbolMatch = filtered.match(/([£$€])\s*([0-9,.]+)/);
  if (symbolMatch) {
    const symbol = symbolMatch[1];
    const currency = symbol === '£' ? 'GBP' : symbol === '$' ? 'USD' : 'EUR';
    const amount = parseAmount(symbolMatch[2]);
    const rmb = convertToRMB(currency, amount);
    return {
      currency,
      amount: `${symbol}${symbolMatch[2]}/年`,
      rmbAmount: rmb || undefined,
    };
  }
  
  // 匹配包含 RMB 的情况，提取本地货币和RMB金额（处理范围格式）
  // 格式：SGD 54,990.50 (RMB 123,456) 或 SGD 54,990 - SGD 94,050 (RMB 296,949 - RMB 507,870)
  const rmbRangeMatch = filtered.match(/([A-Z]{3})\s*([0-9,.]+)\s*[-–]\s*([A-Z]{3})\s*([0-9,.]+)\s*[（(]?\s*(?:约\s*)?(?:RMB|人民币)\s*([0-9,.]+)\s*[-–]\s*(?:RMB|人民币\s*)?([0-9,.]+)\s*[）)]?/i);
  if (rmbRangeMatch) {
    const currency = rmbRangeMatch[1];
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const amount1 = parseAmount(rmbRangeMatch[2]);
    const amount2 = parseAmount(rmbRangeMatch[4]);
    const rmb1 = convertToRMB(currency, amount1);
    const rmb2 = convertToRMB(currency, amount2);
    return {
      currency: currency,
      amount: `${symbol}${rmbRangeMatch[2]} – ${symbol}${rmbRangeMatch[4]}/年`,
      rmbAmount: rmb1 && rmb2 ? `${rmb1}–${rmb2}` : `${rmbRangeMatch[5]} – ${rmbRangeMatch[6]}`,
    };
  }
  
  // 匹配单一金额带RMB
  const rmbMatch = filtered.match(/([A-Z]{3})\s*([0-9,.]+)\s*[（(]?\s*(?:约\s*)?(?:RMB|人民币)\s*([0-9,.]+)\s*[）)]?/i);
  if (rmbMatch) {
    const currency = rmbMatch[1];
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const amount = parseAmount(rmbMatch[2]);
    const rmb = convertToRMB(currency, amount);
    return {
      currency: currency,
      amount: `${symbol}${rmbMatch[2]}/年`,
      rmbAmount: rmb || rmbMatch[3],
    };
  }
  
  // 匹配金额范围（如 SGD 54,990 - SGD 94,050）
  const rangeMatch = filtered.match(/([A-Z]{3})\s*([0-9,.]+)\s*[-–]\s*([A-Z]{3})\s*([0-9,.]+)/);
  if (rangeMatch) {
    const currency = rangeMatch[1];
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const amount1 = parseAmount(rangeMatch[2]);
    const amount2 = parseAmount(rangeMatch[4]);
    const rmb1 = convertToRMB(currency, amount1);
    const rmb2 = convertToRMB(currency, amount2);
    return {
      currency: currency,
      amount: `${symbol}${rangeMatch[2]} – ${symbol}${rangeMatch[4]}/年`,
      rmbAmount: rmb1 && rmb2 ? `${rmb1}–${rmb2}` : undefined,
    };
  }
  
  // 匹配单一货币金额
  const currencyMatch = filtered.match(/([A-Z]{3})\s*([0-9,.]+)/);
  if (currencyMatch) {
    const currency = currencyMatch[1];
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const amount = parseAmount(currencyMatch[2]);
    const rmb = convertToRMB(currency, amount);
    return {
      currency: currency,
      amount: `${symbol}${currencyMatch[2]}/年`,
      rmbAmount: rmb || undefined,
    };
  }
  
  // 处理仅数字的情况（如 "54990"）
  const numMatch = filtered.match(/([0-9,.]+)/);
  if (numMatch) {
    return {
      currency: '',
      amount: `${numMatch[1]}/年`,
    };
  }
  
  // 无法解析时返回"官网确认"
  return {
    currency: '',
    amount: '官网确认',
  };
}

// 学费字段格式化（只展示国际生学费）
export function formatFee(value: unknown): { 
  primary: string; 
  secondary: string; 
} {
  if (value === null || value === undefined) {
    return { primary: '官网暂未明确，请以官网为准', secondary: '' };
  }
  
  let feeStr = '';
  
  if (typeof value === 'string') {
    feeStr = value.trim();
  } else if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const international = obj.international;
    
    // 优先使用国际生学费
    if (typeof international === 'string' && international.trim() && international.trim() !== '待确认') {
      feeStr = international.trim();
    }
  }
  
  // 检查是否为空或无效值
  if (!feeStr || feeStr === '待确认' || feeStr === 'undefined' || feeStr === 'NaN') {
    return { primary: '官网暂未明确，请以官网为准', secondary: '' };
  }
  
  const parsed = parseFeeString(feeStr);
  
  // 检查解析结果是否有效
  if (!parsed.amount || parsed.amount === 'undefined' || parsed.amount === 'NaN') {
    return { primary: '官网暂未明确，请以官网为准', secondary: '' };
  }
  
  // 如果解析结果包含原文字段，返回"官网确认"
  if (parsed.amount.toLowerCase().includes('home') || 
      parsed.amount.toLowerCase().includes('band') || 
      parsed.amount.toLowerCase().includes('overseas')) {
    return { primary: '官网确认', secondary: '' };
  }
  
  if (parsed.rmbAmount) {
    // 判断金额是否是范围
    const isRange = parsed.rmbAmount.includes('–');
    return {
      primary: `国际生学费 ${parsed.amount}`,
      secondary: `约${isRange ? '' : ''}${parsed.rmbAmount}万元人民币`,
    };
  }
  
  return {
    primary: `国际生学费 ${parsed.amount}`,
    secondary: '',
  };
}

// 国际生学费格式化（用于学校详情页顶部展示）
export function formatInternationalFee(fee: unknown): string {
  const result = formatFee(fee);
  if (result.secondary) {
    return `${result.primary}\n${result.secondary}`;
  }
  return result.primary;
}
