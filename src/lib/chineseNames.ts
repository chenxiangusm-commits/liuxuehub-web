// 中文名称映射文件
// 用于将英文学校名、学院名等转换为中文展示

// 学校名称中文映射
export const schoolNameZhMap: Record<string, string> = {
  // 英国
  'University of Oxford': '牛津大学',
  'University of Cambridge': '剑桥大学',
  'University College London': '伦敦大学学院',
  'Imperial College London': '帝国理工学院',
  'University of Manchester': '曼彻斯特大学',
  'University of Edinburgh': '爱丁堡大学',
  "King's College London": '伦敦国王学院',
  'University of Bristol': '布里斯托尔大学',
  'University of Glasgow': '格拉斯哥大学',
  'University of Birmingham': '伯明翰大学',
  'University of Leeds': '利兹大学',
  'University of Sheffield': '谢菲尔德大学',
  'University of Southampton': '南安普顿大学',
  'University of Nottingham': '诺丁汉大学',
  'University of Liverpool': '利物浦大学',
  
  // 中国香港
  'The University of Hong Kong': '香港大学',
  'The Hong Kong University of Science and Technology': '香港科技大学',
  'The Chinese University of Hong Kong': '香港中文大学',
  'Hong Kong Polytechnic University': '香港理工大学',
  'City University of Hong Kong': '香港城市大学',
  
  // 中国澳门
  'University of Macau': '澳门大学',
  
  // 新加坡
  'National University of Singapore': '新加坡国立大学',
  'Nanyang Technological University': '南洋理工大学',
  
  // 澳大利亚
  'Australian National University': '澳大利亚国立大学',
  'University of Sydney': '悉尼大学',
  'University of Melbourne': '墨尔本大学',
  'University of Queensland': '昆士兰大学',
  'Monash University': '莫纳什大学',
  'University of New South Wales': '新南威尔士大学',
};

// 学院名称中文映射
export const collegeNameZhMap: Record<string, string> = {
  // 牛津大学特色学院
  'Saïd Business School': '赛德商学院',
  'Mathematical Institute': '数学研究所',
  'Nuffield Department of Medicine': '纳菲尔德医学系',
  'Department of Geography and the Environment': '地理与环境系',
  'Department of Politics and International Relations': '政治与国际关系系',
  
  // 剑桥大学特色学院
  'Cambridge Judge Business School': '剑桥贾吉商学院',
  'Department of Computer Science and Technology': '计算机科学与技术系',
  
  // 伦敦大学学院特色学院
  'UCL School of Management': '伦敦大学学院管理学院',
  'Faculty of Engineering Sciences': '工程科学学院',
  'Department of Physics and Astronomy': '物理与天文系',
  'Institute of Education': '教育学院',
  'Department of Psychology and Human Development': '心理学与人类发展系',
  'Faculty of Medical Sciences': '医学科学学院',
  
  // 帝国理工学院特色学院
  'Imperial College Business School': '帝国理工商学院',
  'Department of Computing': '计算机系',
  
  // 曼彻斯特大学特色学院
  'Alliance Manchester Business School': '联盟曼彻斯特商学院',
  
  // 爱丁堡大学特色学院
  'University of Edinburgh Business School': '爱丁堡大学商学院',
  'School of Informatics': '信息学院',
  
  // 香港大学特色学院
  'Faculty of Business and Economics': '商学院及经济学院',
  'Faculty of Social Sciences': '社会科学学院',
  
  // 香港科技大学特色学院
  'School of Business and Management': '商学院及管理学院',
  'School of Humanities and Social Science': '人文与社会科学学院',
  
  // 香港中文大学特色学院
  'Faculty of Business Administration': '工商管理学院',
  'Faculty of Social Science': '社会科学学院',
  
  // 新加坡国立大学特色学院
  'NUS Business School': '新加坡国立大学商学院',
  'School of Computing': '计算机学院',
  'Yong Loo Lin School of Medicine': '杨潞龄医学院',
  
  // 南洋理工大学特色学院
  'Nanyang Business School': '南洋商学院',
  'School of Computer Science and Engineering': '计算机科学与工程学院',
  'School of Physical and Mathematical Sciences': '物理与数学科学学院',
  
  // 澳大利亚国立大学特色学院
  'ANU College of Business and Economics': '澳大利亚国立大学商学与经济学院',
  'College of Engineering and Computer Science': '工程与计算机科学学院',
  'College of Arts and Social Sciences': '艺术与社会科学学院',
  
  // 悉尼大学特色学院
  'University of Sydney Business School': '悉尼大学商学院',
  
  // 墨尔本大学特色学院
  'Melbourne Business School': '墨尔本商学院',
  'School of Computing and Information Systems': '计算与信息系统学院',
  'Faculty of Engineering and Information Technology': '工程与信息技术学院',
  'Faculty of Medicine, Dentistry and Health Sciences': '医学、牙科学与健康科学学院',
  
  // 通用学院名称映射
  'Department of Computer Science': '计算机科学系',
  'Department of Education': '教育系',
  'Department of Economics': '经济系',
  'Faculty of Law': '法学系',
  'Department of Sociology': '社会学系',
  'Department of Engineering Science': '工程科学系',
  'Department of Physics': '物理系',
  'Department of Chemistry': '化学系',
  'Department of Biology': '生物系',
  'Department of Medicine': '医学系',
  'Department of History': '历史系',
  'Department of Philosophy': '哲学系',
  'Department of Psychology': '心理学系',
  'Department of Linguistics': '语言学系',
  'Faculty of Music': '音乐系',
  'Department of Fine Art': '美术系',
  'Department of Archaeology': '考古学系',
  'Department of Anthropology': '人类学系',
  'Department of Statistics': '统计学系',
  'Department of Engineering': '工程系',
  'Faculty of Mathematics': '数学学院',
  'Faculty of Economics': '经济学院',
  'Faculty of Education': '教育学院',
  'Faculty of Medicine': '医学院',
  'Faculty of Engineering': '工程学院',
  'Department of Mathematics': '数学系',
  'Faculty of Laws': '法学院',
  'School of Engineering': '工程学院',
  'School of Law': '法学院',
  'School of Economics': '经济学院',
  'Faculty of Science': '理学院',
  'Faculty of Arts': '文学院',
  'School of Science': '理学院',
  'College of Engineering': '工程学院',
  'College of Science': '理学院',
  'College of Law': '法学院',
  'School of Computer Science': '计算机学院',
  'Faculty of Medicine and Health': '医学与健康学院',
  'School of Mathematics': '数学学院',
  'School of Physics and Astronomy': '物理与天文学院',
  'School of Business': '商学院',
  'Business School': '商学院',
  'School of Education': '教育学院',
  'School of Arts': '文学院',
  'School of Social Sciences': '社会科学学院',
  'School of Psychology': '心理学院',
  'School of History': '历史学院',
  'School of Philosophy': '哲学学院',
  'School of Politics': '政治学院',
  'School of Music': '音乐学院',
  'School of Fine Arts': '美术学院',
  'Department of Music': '音乐系',
  'Department of Fine Arts': '美术系',
  'Department of Politics': '政治系',
};

// 专业方向中文映射
export const majorDirectionZhMap: Record<string, string> = {
  '商科': '商科',
  '计算机': '计算机',
  '工程': '工程',
  '传媒': '传媒',
  '教育': '教育',
  '法律': '法律',
  '艺术': '艺术',
  '医学': '医学',
  '社科': '社科',
  'science': '科学',
  'technology': '技术',
  'management': '管理',
  'finance': '金融',
  'economics': '经济',
  'business': '商业',
  'engineering': '工程',
  'computer': '计算机',
  'medicine': '医学',
  'law': '法律',
  'education': '教育',
  'arts': '艺术',
  'social': '社会',
};

// 获取学校中文名称
export function getSchoolZhName(name: string): string {
  return schoolNameZhMap[name] || name;
}

// 获取学院中文名称
export function getCollegeZhName(college: string): string {
  if (!college) return '';
  
  // 优先查找完整匹配
  if (collegeNameZhMap[college]) {
    return collegeNameZhMap[college];
  }
  
  // 尝试移除常见前缀后匹配
  const cleaned = college
    .replace(/^The\s+/i, '')
    .replace(/^Department\s+of\s+/i, '')
    .replace(/^Faculty\s+of\s+/i, '')
    .replace(/^School\s+of\s+/i, '')
    .replace(/^College\s+of\s+/i, '')
    .replace(/^Institute\s+of\s+/i, '')
    .replace(/^Centre\s+for\s+/i, '')
    .replace(/^Center\s+for\s+/i, '');
  
  if (collegeNameZhMap[cleaned]) {
    return collegeNameZhMap[cleaned];
  }
  
  // 尝试翻译常见术语
  let result = college;
  
  const termMap: Record<string, string> = {
    'Department': '系',
    'Faculty': '学院',
    'School': '学院',
    'College': '学院',
    'Institute': '研究所',
    'Centre': '中心',
    'Center': '中心',
    'of': '',
    '&': '与',
    'and': '与',
    'Science': '科学',
    'Engineering': '工程',
    'Computer': '计算机',
    'Mathematics': '数学',
    'Physics': '物理',
    'Chemistry': '化学',
    'Biology': '生物',
    'Medicine': '医学',
    'Law': '法学',
    'Education': '教育',
    'Economics': '经济',
    'Business': '商',
    'Management': '管理',
    'Finance': '金融',
    'Social': '社会',
    'Psychology': '心理',
    'History': '历史',
    'Philosophy': '哲学',
    'Politics': '政治',
    'International Relations': '国际关系',
    'Linguistics': '语言',
    'Music': '音乐',
    'Art': '艺术',
    'Fine Art': '美术',
    'Archaeology': '考古',
    'Anthropology': '人类学',
    'Statistics': '统计',
    'Geography': '地理',
    'Environment': '环境',
    'Architecture': '建筑',
    'Design': '设计',
    'Media': '媒体',
    'Communication': '传播',
    'Journalism': '新闻',
    'Nursing': '护理',
    'Health': '健康',
  };
  
  // 长词优先替换
  const sortedTerms = Object.entries(termMap)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [termEn, termCn] of sortedTerms) {
    const regex = new RegExp(`\\b${termEn}\\b`, 'gi');
    result = result.replace(regex, termCn);
  }
  
  // 清理多余空格
  result = result.replace(/\s+/g, '').trim();
  
  // 如果结果还是全英文，返回原名称
  if (/^[a-zA-Z\s]+$/.test(result)) {
    return college;
  }
  
  return result;
}

// 获取专业方向中文名称
export function getMajorDirectionZhName(direction: string): string {
  return majorDirectionZhMap[direction] || direction;
}
