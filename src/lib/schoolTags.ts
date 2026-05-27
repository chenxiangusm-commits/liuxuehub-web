export function getSchoolTags(schoolCode?: string): string[] {
  const tags: string[] = [];
  if (!schoolCode) return tags;
  const code = schoolCode.toUpperCase();

  // 英国 G5 超级精英大学
  const g5Schools = ['OXFORD', 'CAMBRIDGE', 'IC', 'UCL', 'LSE'];
  if (g5Schools.includes(code)) {
    tags.push('G5超级精英大学');
  }

  // 英国金三角名校
  const goldenTriangle = ['OXFORD', 'CAMBRIDGE', 'IC', 'UCL', 'LSE', 'KCL'];
  if (goldenTriangle.includes(code)) {
    tags.push('金三角名校');
  }

  // 英国罗素大学集团
  const russellGroup = [
    'OXFORD', 'CAMBRIDGE', 'IC', 'UCL', 'LSE', 'KCL', 'EDINBURGH', 'MANCHESTER',
    'BIRMINGHAM', 'BRISTOL', 'LEEDS', 'SHEFFIELD', 'NOTTINGHAM', 'NEWCASTLE',
    'DURHAM', 'EXETER', 'WARWICK', 'YORK', 'LANCASTER', 'LEICESTER', 'SOUTHAMPTON',
    'READING', 'BATH', 'ESSEX', 'ST_ANDREWS'
  ];
  if (russellGroup.includes(code)) {
    tags.push('罗素大学集团');
  }

  // 环太平洋大学联盟
  const apru = ['HKU', 'HKUST', 'CUHK', 'NTU', 'NUS', 'SYDNEY', 'MELBOURNE', 'AUCKLAND'];
  if (apru.includes(code)) {
    tags.push('环太平洋大学联盟');
  }

  // 亚洲顶尖大学
  const asiaTop = ['HKU', 'HKUST', 'CUHK', 'HKCityU', 'HKPolyU', 'NTU', 'NUS'];
  if (asiaTop.includes(code)) {
    tags.push('亚洲顶尖大学');
  }

  // 新加坡旗舰大学
  if (code === 'NTU' || code === 'NUS') {
    tags.push('新加坡旗舰大学');
  }

  // 香港顶尖大学
  const hongKongTop = ['HKU', 'HKUST', 'CUHK', 'HKCityU', 'HKPolyU'];
  if (hongKongTop.includes(code)) {
    tags.push('香港顶尖大学');
  }

  // 澳洲八大
  const australianGroupOfEight = [
    'ANU', 'SYDNEY', 'MELBOURNE', 'UNSW', 'UQ', 'MONASH', 'WESTERN_AUSTRALIA', 'ADELAIDE'
  ];
  if (australianGroupOfEight.includes(code)) {
    tags.push('澳洲八大');
  }

  // 爱尔兰名校
  const irelandTop = ['TCD', 'UCD'];
  if (irelandTop.includes(code)) {
    tags.push('爱尔兰名校');
  }

  // 新西兰顶尖大学
  if (code === 'AUCKLAND') {
    tags.push('新西兰顶尖大学');
  }

  // 加拿大顶尖研究型大学
  const canadaTop = ['UBC', 'TORONTO', 'MCGILL', 'WATERLOO', 'ALBERTA', 'MCMASTER'];
  if (canadaTop.includes(code)) {
    tags.push('加拿大顶尖大学');
  }

  // 最多返回3个标签
  return tags.slice(0, 3);
}
