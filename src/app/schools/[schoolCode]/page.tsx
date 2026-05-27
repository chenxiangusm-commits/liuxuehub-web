import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllSchools, getSchoolByCode, getProgramsBySchoolCode } from "@/lib/data.server";
import { getSchoolChineseName } from "@/lib/school-names";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import { getSchoolTags } from "@/lib/schoolTags";
import { formatIntake, formatLanguageRequirement } from "@/lib/displayFormat";
import SchoolDetailClient from "./SchoolDetailClient";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function generateSchoolIntro(chineseName: string, schoolCode: string): string {
  const code = schoolCode.toUpperCase();
  
  // ============ 英国 G5 顶尖名校 ============
  
  // 牛津大学
  if (code === "OXFORD") {
    return "牛津大学（University of Oxford）创建于1096年，是英语世界中最古老的大学，与剑桥大学并称为'金三角名校'和'英国G5超级精英大学'。学校在人文社科、自然科学、医学、数学、经济管理等学科领域均处于全球领先地位，至今已培养了30多位英国首相和70多位诺贝尔奖得主。牛津大学由39个学院组成，提供超过250个研究生项目，是追求卓越学术的理想殿堂。";
  }
  
  // 剑桥大学
  if (code === "CAMBRIDGE") {
    return "剑桥大学（University of Cambridge）创立于1209年，是全球最负盛名的研究型大学之一，也是英国G5超级精英大学和金三角名校成员。剑桥在自然科学、工程技术、医学、经济管理等学科领域拥有卓越实力，迄今为止已培养了超过120位诺贝尔奖得主。学校由31个学院组成，为学生提供世界顶尖的学术资源与多元化的研究机会。";
  }
  
  // 帝国理工学院
  if (code === "IC" || code === "IMPERIAL") {
    return "帝国理工学院（Imperial College London）是英国顶尖的研究型大学，专注于科学、工程、医学和商科领域，是英国G5超级精英大学之一。学校在QS世界大学排名中位居全球前列，尤其在工程与技术、自然科学、医学等领域具有全球领先的科研实力。帝国理工学院位于伦敦心脏地带，与众多世界知名企业保持紧密合作，为学生提供优质的实习和就业机会。";
  }
  
  // 伦敦大学学院
  if (code === "UCL") {
    return "伦敦大学学院（University College London）创立于1826年，是英国历史最悠久的现代大学之一，也是G5超级精英大学成员。UCL是英国第一所不分种族、阶级、宗教录取学生的大学，在人文社科、建筑设计、医学、神经科学等领域享有极高声誉。学校位于伦敦市中心，拥有超过400个研究生项目，培养了30余位诺贝尔奖得主。";
  }
  
  // 伦敦政治经济学院
  if (code === "LSE") {
    return "伦敦政治经济学院（London School of Economics and Political Science）创立于1895年，是英国G5超级精英大学之一，也是'金砖五校'联盟成员。LSE在社会科学、金融、经济学、政治学、法律等领域处于全球领先地位，被誉为'社会科学的殿堂'。学校位于伦敦市中心，95%的教师活跃于国际学术前沿，为学生提供最前沿的社会科学教育。";
  }
  
  // 伦敦国王学院
  if (code === "KCL") {
    return "伦敦国王学院（King's College London）创立于1829年，是英国历史最悠久的大学之一，也是罗素大学集团成员。KCL在医学、护理、牙科、法律、人文社科等领域具有卓越声誉，其牙科专业位居全球前列，医学研究水平享誉国际。学校位于伦敦泰晤士河畔，由五个校区组成，拥有来自150多个国家的学生。";
  }
  
  // ============ 英国其他顶尖大学 ============
  
  // 爱丁堡大学
  if (code === "EDINBURGH") {
    return "爱丁堡大学（University of Edinburgh）创建于1583年，是英语世界第六古老的大学，也是罗素大学集团成员。学校在人工智能、数据科学、兽医学、语言学、医学等领域处于全球领先地位，至今已培养了22位诺贝尔奖得主。爱丁堡大学位于苏格兰首府爱丁堡，拥有超过500个研究生项目，为学生提供世界级的学术研究环境。";
  }
  
  // 曼彻斯特大学
  if (code === "MANCHESTER") {
    return "曼彻斯特大学（University of Manchester）起源于1851年，是英国最大的单一校址大学，也是罗素大学集团创始成员。学校在材料科学、化学工程、物理、生物医学、社会科学等领域具有卓越实力，诞生了25位诺贝尔奖得主。曼彻斯特是英国第二大城市，学校与当地产业界保持紧密合作，为学生提供丰富的实习和就业机会。";
  }
  
  // 布里斯托大学
  if (code === "BRISTOL") {
    return "布里斯托大学（University of Bristol）创立于1876年，是英国红砖大学联盟创始成员，也是罗素大学集团成员。学校在工程学、航空航天、社会科学、地球科学、医学等领域享有崇高声誉，教学质量常年位居英国前列。布里斯托是英国西南部最大的城市，学校为学生提供了优质的学习生活环境。";
  }
  
  // 华威大学
  if (code === "WARWICK") {
    return "华威大学（University of Warwick）创立于1965年，是英国最年轻的顶尖研究型大学之一，也是罗素大学集团成员。华威商学院（WBS）是英国最顶尖的商学院之一，在金融、商科、数学、统计学等领域具有卓越声誉。学校位于英格兰中部，距离伦敦仅一小时车程，为学生提供了便利的地理位置优势。";
  }
  
  // 伯明翰大学
  if (code === "BIRMINGHAM") {
    return "伯明翰大学（University of Birmingham）创立于1900年，是英国第一所获得皇家特许状的大学，也是罗素大学集团创始成员。学校在医学、工程学、社会科学、艺术与人文等领域具有强大实力，是英国最大的毕业生就业培养基地之一。伯明翰是英国第二大城市，学校拥有美丽的公园式校园和先进的教学设施。";
  }
  
  // 格拉斯哥大学
  if (code === "GLASGOW") {
    return "格拉斯哥大学（University of Glasgow）创立于1451年，是英语世界第四古老的大学，也是英国第三古老的大学。学校在医学、兽医学、教育学、艺术与人文、社会科学等领域具有卓越声誉，诞生了8位诺贝尔奖得主。格拉斯哥大学主楼是苏格兰最著名的地标之一，学校为学生提供高质量的教学和丰富的学术资源。";
  }
  
  // 利兹大学
  if (code === "LEEDS") {
    return "利兹大学（University of Leeds）起源于1904年，是英国最大的大学之一，也是罗素大学集团成员。学校在传媒研究、商科、医学与健康科学、工程学等领域具有卓越实力，商学院获得三重认证。利兹大学位于英国中部，是英国第二大金融中心，为学生提供了良好的就业和实习机会。";
  }
  
  // 南安普顿大学
  if (code === "SOUTHAMPTON") {
    return "南安普顿大学（University of Southampton）创立于1862年，是英国红砖大学联盟成员，也是罗素大学集团成员。学校在电子与电气工程、计算机科学、海洋学、护理学等领域处于全球领先地位。南安普顿是英国主要的港口城市，学校拥有先进的科研设施，为学生提供优质的研究和学习环境。";
  }
  
  // 谢菲尔德大学
  if (code === "SHEFFIELD") {
    return "谢菲尔德大学（University of Sheffield）创立于1905年，是英国红砖大学联盟成员，也是罗素大学集团成员。学校在医学研究、工程学、社会科学、信息科学等领域具有卓越声誉，诞生了6位诺贝尔奖得主。谢菲尔德是英国绿化最好的城市之一，拥有美丽的校园环境和完善的学生支持服务。";
  }
  
  // 杜伦大学
  if (code === "DURHAM") {
    return "杜伦大学（University of Durham）创立于1832年，是英国第三古老的大学，也是罗素大学集团创始成员。学校在神学与宗教研究、考古学、历史学、地理学、人类学等人文社科领域具有极高的学术声誉。杜伦大学采用独特的学院制，由17个学院组成，为学生提供独特的学术和生活体验。";
  }
  
  // 诺丁汉大学
  if (code === "NOTTINGHAM") {
    return "诺丁汉大学（University of Nottingham）创立于1881年，是英国罗素大学集团成员，也是一所世界知名的研究型大学。学校在药学与制药科学、农林与食品科学、土木工程、心理学等领域具有卓越实力。诺丁汉大学在马来西亚和中国设有海外校区，是英国最早在海外设立校区的大学之一。";
  }
  
  // ============ 香港顶尖大学 ============
  
  // 香港大学
  if (code === "HKU") {
    return "香港大学（The University of Hong Kong）创立于1911年，是香港历史最悠久的高等学府，也是亚洲最具声望的综合性大学之一。港大在医学、法律、建筑学、工程学、商科等领域具有卓越声誉，培养了多位香港特首和社会各界领袖。学校位于香港岛西环，背山面海，校园建筑融合中西建筑风格。";
  }
  
  // 香港中文大学
  if (code === "CUHK") {
    return "香港中文大学（The Chinese University of Hong Kong）成立于1963年，是香港第二所成立的大学，也是亚洲领先的研究型综合大学。学校在语言学、传播学、神学、社会学、医学等领域具有卓越学术声誉。中大采用独特的书院制，由九所书院组成，为学生提供多元化的学习环境和文化体验。";
  }
  
  // 香港科技大学
  if (code === "HKUST") {
    return "香港科技大学（The Hong Kong University of Science and Technology）创立于1991年，是香港最年轻的公立研究型大学，却已在全球享有极高学术声誉。科大在工程学、计算机科学、商业与管理、材料科学等领域处于世界领先地位，是一所专注于科技与商业管理的顶尖学府。";
  }
  
  // 香港城市大学
  if (code === "CITYU" || code === "CITY_U") {
    return "香港城市大学（City University of Hong Kong）创立于1984年，是香港一所充满活力的国际化学府。城大在工程学、计算机科学、传播学、法学、商业管理等领域具有卓越实力，兽医学位居全球前列。学校位于九龙塘交通便利，为学生提供与业界紧密联系的教育机会。";
  }
  
  // 香港理工大学
  if (code === "POLYU" || code === "POLY_U") {
    return "香港理工大学（The Hong Kong Polytechnic University）创立于1937年，是香港历史最悠久的职业技术大学。理工大在酒店管理、土木工程、时装设计、建筑学、艺术设计等领域具有卓越声誉，其中酒店管理专业位居全球前列。学校位于香港红磡，是一所注重实践与创新的应用型大学。";
  }
  
  // 香港浸会大学
  if (code === "HKBU") {
    return "香港浸会大学（Hong Kong Baptist University）创立于1956年，是香港历史第二悠久的大学。浸大在传理与影视、中医药、艺术与设计、体育与健康管理等领域具有独特优势，是一所兼具基督教传统与国际视野的综合性大学。";
  }
  
  // ============ 新加坡顶尖大学 ============
  
  // 新加坡国立大学
  if (code === "NUS") {
    return "新加坡国立大学（National University of Singapore）创立于1905年，是新加坡历史最悠久、规模最大的公立研究型大学，也是环太平洋大学联盟成员。学校在工程学、生命科学、医学、社会科学、艺术与人文等领域处于亚洲领先地位，QS世界大学排名稳居全球前15名。NUS拥有三个校区，为学生提供多元化的学术环境。";
  }
  
  // 南洋理工大学
  if (code === "NTU") {
    return "南洋理工大学（Nanyang Technological University）创立于1981年，是新加坡另一所世界顶尖的研究型大学，也是环太平洋大学联盟成员。NTU在纳米材料科学、人工智能、工程学、商科等领域具有卓越实力，是全球工科排名前十的顶尖学府。学校校园被誉为全球最美丽的校园之一，拥有先进的研究设施。";
  }
  
  // ============ 澳大利亚八大 ============
  
  // 墨尔本大学
  if (code === "UNIMELB") {
    return "墨尔本大学（University of Melbourne）创立于1853年，是澳大利亚历史第二悠久的大学，也是八大名校联盟成员。学校在医学、生物医学、法律、教育学、艺术与人文、会计与金融等领域具有卓越声誉，培养了8位诺贝尔奖得主和多位澳大利亚总理。墨尔本大学采用独特的Melbourne Model教学模式，注重培养学生的批判性思维。";
  }
  
  // 悉尼大学
  if (code === "USYD") {
    return "悉尼大学（University of Sydney）创立于1850年，是澳大利亚历史最悠久的大学，也是八大名校联盟成员。学校在医学、法律、商科、建筑学、工程学、艺术与人文等领域具有卓越声誉，毕业生质量和师资水平享誉全球。悉尼大学的砂岩建筑群是澳大利亚最著名的建筑地标之一。";
  }
  
  // 澳大利亚国立大学
  if (code === "ANU") {
    return "澳大利亚国立大学（Australian National University）创立于1946年，是澳大利亚唯一的国立大学，也是八大名校联盟成员。ANU在政治学与国际关系、哲学、艺术史、历史学、人类学、物理学等领域具有极高的学术声誉，是澳大利亚首屈一指的研究型大学。学校位于澳大利亚首都堪培拉，为学生提供专注学术研究的环境。";
  }
  
  // 新南威尔士大学
  if (code === "UNSW") {
    return "新南威尔士大学（University of New South Wales）创立于1949年，是澳大利亚最具创新实力和研究影响力的大学之一，也是八大名校联盟成员。学校在工程学、商科、法律、医学、建筑设计等领域具有卓越实力，商学院和工程学院均为澳大利亚顶尖水平。UNSW位于悉尼，毕业生就业率和起薪均位居澳大利亚前列。";
  }
  
  // 蒙纳士大学
  if (code === "MONASH") {
    return "蒙纳士大学（Monash University）创立于1958年，是澳大利亚规模最大的大学，也是八大名校联盟成员。学校在药学与制药科学、教育学、护理学、工程学、商科等领域具有卓越声誉，其中药学专业位居全球第一。蒙纳士大学在马来西亚和南非设有国际校区，是一所真正的全球化大学。";
  }
  
  // 昆士兰大学
  if (code === "UQ") {
    return "昆士兰大学（University of Queensland）创立于1909年，是澳大利亚历史第五悠久的大学，也是八大名校联盟成员。学校在生物医学、临床健康、医学、环境科学、农业与林业等领域具有卓越实力，拥有全球顶尖的医学院和生物科学研究设施。昆士兰大学位于阳光之州昆士兰首府布里斯班，为学生提供优质的学习生活环境。";
  }
  
  // 阿德莱德大学
  if (code === "ADELAIDE") {
    return "阿德莱德大学（University of Adelaide）创立于1874年，是澳大利亚历史第三悠久的大学，也是八大名校联盟成员。学校在医学、牙科、工程学、葡萄酒酿造、环境科学等领域具有卓越声誉，是澳大利亚主要的葡萄酒研究教育中心。阿德莱德大学位于南澳大利亚州首府，气候宜人，生活成本相对较低。";
  }
  
  // 西澳大学
  if (code === "UWA") {
    return "西澳大学（University of Western Australia）创立于1911年，是澳大利亚历史第六悠久的大学，也是八大名校联盟成员。学校在矿业与海洋工程、地球科学、医学、法律、商科等领域具有卓越实力。西澳大学位于西澳大利亚州首府珀斯，濒临印度洋，拥有独特的地缘优势和研究资源。";
  }
  
  // ============ 新西兰顶尖大学 ============
  
  // 奥克兰大学
  if (code === "AUCKLAND") {
    return "奥克兰大学（The University of Auckland）创立于1883年，是新西兰排名最高的大学，也是环太平洋大学联盟成员。学校在考古学、教育学、护理学、土木工程、地理学等领域具有卓越声誉，是新西兰规模最大、学科最齐全的综合性大学。奥克兰是新西兰最大的城市，为学生提供了丰富的文化和就业机会。";
  }
  
  // 奥塔哥大学
  if (code === "OTAGO") {
    return "奥塔哥大学（University of Otago）创立于1869年，是新西兰历史最悠久的大学，也是新西兰研究实力最强的大学。学校在医学、牙科、健康科学、生物医学、体育科学等领域具有卓越声誉，是南半球医学教育的先驱。奥塔哥大学位于新西兰南岛但尼丁，环境优美，文化氛围浓厚。";
  }
  
  // 梅西大学
  if (code === "MASSEY") {
    return "梅西大学（Massey University）创立于1927年，是新西兰最大的大学之一，也是三所国立大学之一。学校在兽医学、农林科学、航空学、艺术与设计、传播学等领域具有卓越实力，其中兽医科学位居全球前列。梅西大学在惠灵顿、奥克兰和北帕默斯顿均设有校区。";
  }
  
  // 惠灵顿维多利亚大学
  if (code === "VUW") {
    return "惠灵顿维多利亚大学（Victoria University of Wellington）创立于1897年，是新西兰首都的大学，也是八大国联成员。学校在酒店与旅游管理、艺术与设计、建筑学、信息系统、图书馆与信息管理等领域具有卓越声誉。维多利亚大学位于新西兰政治文化中心惠灵顿，为学生提供了独特的学术环境。";
  }
  
  // 坎特伯雷大学
  if (code === "CANTERBURY") {
    return "坎特伯雷大学（University of Canterbury）创立于1873年，是新西兰历史第三悠久的大学，也是八大国联成员。学校在工程学（尤其是土木工程）、法律、教育学、艺术与人文等领域具有卓越声誉。坎特伯雷大学位于新西兰南岛基督城，校园环境优美，学术氛围浓厚。";
  }
  
  // 怀卡托大学
  if (code === "WAIKATO") {
    return "怀卡托大学（University of Waikato）创立于1964年，是新西兰较年轻的大学之一，也是八大国联成员。学校在法律、商科、计算机科学、教育学、毛利文化研究等领域具有独特优势，是新西兰管理学研究领域的领导者。怀卡托大学位于新西兰北岛汉密尔顿，拥有现代化的校园设施。";
  }
  
  // 林肯大学
  if (code === "LINCOLN") {
    return "林肯大学（Lincoln University）创立于1878年，是新西兰历史第三悠久的大学，也是南半球顶尖的农业大学。学校在农业与园艺、环境科学、土地与不动产管理、食品科学、旅游管理等领域具有卓越声誉，是新西兰农业和环境研究的领导者。林肯大学位于坎特伯雷地区，拥有优质的教学和科研设施。";
  }
  
  // 奥克兰理工大学
  if (code === "AUT") {
    return "奥克兰理工大学（Auckland University of Technology）创立于1895年，是新西兰八所国立大学中最年轻的成员。学校在酒店管理、旅游管理、护理学、艺术与设计、信息技术等领域具有实践导向的优势，是一所注重职业教育和创新研究的现代化大学。";
  }
  
  // ============ 新加坡/香港其他院校 ============
  
  // 岭南大学
  if (code === "LINGNANU" || code === "LINGNAN_U") {
    return "岭南大学（Lingnan University）是香港唯一的博雅大学，前身为1888年创办的广州岭南学堂。学校专注于人文社科、商科和创意艺术教育，采用小班教学模式，注重培养学生的批判性思维和跨文化交流能力。岭南大学是亚洲博雅大学联盟成员，致力于全人教育。";
  }
  
  // 树仁大学
  if (code === "HKSYU") {
    return "香港树仁大学（Hong Kong Shue Yan University）创立于1971年，是香港首所私立大学。学校以'仁者爱人'为校训，专注于人文社科、商科和新闻传播教育，注重培养学生的社会责任感和专业能力。树仁大学是香港历史悠久的私立高等教育机构。";
  }
  
  // 都会大学
  if (code === "MUST") {
    return "澳门科技大学（Macau University of Science and Technology）创立于2000年，是澳门最大的综合性大学，也是两岸四地最年轻的大学之一。学校在酒店与旅游管理、中医药学、资讯科技、艺术设计等领域具有特色优势，是一所充满活力的现代化大学。";
  }
  
  // 理工大学（澳门）
  if (code === "MPU") {
    return "澳门理工大学（Macao Polytechnic University）创立于1981年，是澳门一所提供多学科教育的公立大学。学校在旅游与酒店管理、语言翻译、信息技术、艺术与设计等领域具有实践导向的优势，与业界保持紧密合作，为学生提供实用的职业技能培训。";
  }
  
  // 旅游学院
  if (code === "UTM") {
    return "澳门旅游学院（Institute for Tourism Management）创立于1993年，是亚洲顶尖的旅游教育机构，也是联合国世界旅游组织的培训合作伙伴。学校在酒店管理、旅游管理、厨艺教育等领域具有卓越声誉，培养了大量旅游业专业人才。";
  }
  
  // 教育大学
  if (code === "EDUHK") {
    return "香港教育大学（The Education University of Hong Kong）是香港唯一专注于教师教育的高等学府，也是八所公立大学中唯一的师范类大学。学校在教育学、语言学、心理学、社会科学等领域具有卓越声誉，是香港及亚洲地区教师教育领域的领导者。";
  }
  
  // 恒生大学
  if (code === "HSUHK" || code === "HSU_HK") {
    return "香港恒生大学（The Hang Seng University of Hong Kong）创立于2010年，前身为恒生管理学院，是香港一所私立大学。学校以商科教育为特色，在商业管理、金融学、数据科学、新闻传播等领域具有实践导向的优势，致力于培养具有社会责任感的专业人才。";
  }
  
  // 都会大学（香港）
  if (code === "HKMU" || code === "HK_MU") {
    return "香港都会大学（Hong Kong Metropolitan University）创立于1989年，是香港首所公立自资大学。学校提供多元化的遥距及全日制课程，涵盖商业、语文、创意艺术、科学及科技等领域，致力于灵活的高等教育机会。";
  }
  
  // ============ 加拿大顶尖大学 ============
  
  // 英属哥伦比亚大学
  if (code === "UBC") {
    return "英属哥伦比亚大学（University of British Columbia）创立于1908年，是加拿大历史最悠久的国际研究型大学之一，也是加拿大著名的U15研究型大学联盟成员。学校在可持续发展研究、海洋科学、林业学、医学、计算机科学等领域具有卓越实力，主校区位于温哥华，被评为全球最美校园之一。";
  }
  
  // 多伦多大学
  if (code === "TORONTO" || code === "UTORONTO") {
    return "多伦多大学（University of Toronto）创立于1827年，是加拿大历史最悠久、规模最大的研究型大学，也是U15联盟成员。学校在医学、计算机科学、数学、心理学、金融学、法学等领域处于北美领先地位，诞生了11位诺贝尔奖得主和5位图灵奖得主，是全球最重要的学术机构之一。";
  }
  
  // 麦吉尔大学
  if (code === "MCGILL") {
    return "麦吉尔大学（McGill University）创立于1821年，是加拿大历史最悠久的大学，也是U15联盟创始成员。学校在医学、法学、商科、工程学、心理学等领域具有卓越声誉，被誉为'加拿大的哈佛'。麦吉尔大学位于蒙特利尔，采用英语和法语双语教学，是一所具有国际化视野的顶尖学府。";
  }
  
  // ============ 马来西亚顶尖大学 ============
  
  // 马来亚大学
  if (code === "UM") {
    return "马来亚大学（University of Malaya）创立于1949年，是马来西亚历史最悠久、排名第一的国立大学，也是亚洲大学联盟成员。学校在医学、工程学、法律、商业与会计、社会科学等领域具有卓越声誉，是马来西亚高等教育的旗舰学府。";
  }
  
  // 博特拉大学
  if (code === "UPM") {
    return "马来西亚博特拉大学（Universiti Putra Malaysia）创立于1931年，是马来西亚著名的国立研究型大学，在农业科学、林业学、兽医学、环境科学等领域具有卓越实力。学校拥有马来西亚最完善的农业与生命科学研究设施，是亚洲农学领域的领导者。";
  }
  
  // 国民大学
  if (code === "UKM") {
    return "马来西亚国民大学（Universiti Kebangsaan Malaysia）创立于1973年，是马来西亚五所国立研究型大学之一，在医学、工程学、法律、商科、社会科学等领域具有良好声誉。学校拥有多个国家级研究机构，致力于推动马来西亚的科研创新。";
  }
  
  // 理科大学
  if (code === "USM") {
    return "马来西亚理科大学（Universiti Sains Malaysia）创立于1969年，是马来西亚历史第二悠久的国立大学，在医学、牙科、工程学、药剂学、科学等领域具有卓越声誉。学校是亚洲医科类大学的重要代表，拥有先进的医学教育和研究设施。";
  }
  
  // 理工大学（马来西亚）
  if (code === "UTM_MALAYSIA") {
    return "马来西亚理工大学（Universiti Teknologi Malaysia）创立于1975年，是马来西亚著名的国立科技大学，在工程学、建筑学、信息科学等领域具有卓越实力。学校是东南亚地区工程技术教育的重要基地，培养了大量工程技术人才。";
  }
  
  // 泰莱大学
  if (code === "TAYLOR") {
    return "泰莱大学（Taylor's University）创立于1969年，是马来西亚历史悠久的私立大学，在酒店与旅游管理、商业、法律等领域具有良好声誉。学校与众多国际大学建立合作关系，提供双学位和学分转移项目，是马来西亚私立教育的先驱。";
  }
  
  // 思特雅大学
  if (code === "UCSI") {
    return "思特雅大学（UCSI University）创立于1986年，是马来西亚知名的私立大学，在音乐表演、酒店管理、医学、商业等领域具有卓越声誉。学校是马来西亚教育部核准的三所私立大学之一，拥有先进的教学设施和国际化的师资队伍。";
  }
  
  // 精英大学
  if (code === "HELP") {
    return "精英大学（Help University）创立于1986年，是马来西亚一所知名的私立大学，在商业管理、心理 学、法律等领域具有良好声誉。学校提供多样化的本科和研究生课程，致力于培养学生的专业技能和全球视野。";
  }
  
  // 斯特雷德大学（英国）
  if (code === "UOL_LONDON") {
    return "伦敦大学（University of London）是由多所学院组成的联邦制大学，包括伦敦政治经济学院、伦敦国王学院等知名学府。学校提供广泛的本科和研究生课程，学位证书由伦敦大学统一颁发，在国际上享有极高声誉。";
  }
  
  // 皇家墨尔本理工大学
  if (code === "RMIT") {
    return "皇家墨尔本理工大学（RMIT University）创立于1887年，是澳大利亚历史最悠久的职业教育型大学，在艺术设计、建筑学、工程学、商科等领域具有卓越声誉。学校是全澳唯一被指定为'澳洲原住民大学'的公立院校，在设计领域享有全球盛誉。";
  }
  
  // 麦考瑞大学
  if (code === "MACQUARIE") {
    return "麦考瑞大学（Macquarie University）创立于1964年，是澳大利亚一所著名的研究型大学，在语言学、心理学、医学、金融学、传媒等领域具有卓越声誉。学校位于悉尼北部，校园环境优美，是澳大利亚创新型大学的代表。";
  }
  
  // 纽卡斯尔大学
  if (code === "NEWCASTLE") {
    return "纽卡斯尔大学（University of Newcastle）创立于1965年，是澳大利亚一所著名的研究型大学，在医学、工程学、商科、教育学等领域具有良好声誉。学校位于新南威尔士州纽卡斯尔市，是澳大利亚主要的大学之一。";
  }
  
  // 昆士兰科技大学
  if (code === "QUT") {
    return "昆士兰科技大学（Queensland University of Technology）创立于1989年，是澳大利亚一所著名的科技大学，在商科、创意产业、工程学、信息技术等领域具有卓越声誉。学校位于布里斯班，注重实践与创新，是澳大利亚年轻大学的佼佼者。";
  }
  
  // 悉尼科技大学
  if (code === "UTS") {
    return "悉尼科技大学（University of Technology Sydney）创立于1988年，是澳大利亚一所著名的科技大学，在工程学、信息技术、商科、设计等领域具有卓越实力。学校位于悉尼市中心，是澳大利亚最具创新性的大学之一。";
  }
  
  // 卧龙岗大学
  if (code === "UOW") {
    return "伍伦贡大学（University of Wollongong）创立于1951年，是澳大利亚著名的研究型大学，在材料科学、纳米技术、工程学、计算机科学等领域具有卓越声誉。学校在迪拜和香港设有国际校区，是一所真正的全球化大学。";
  }
  
  // 迪肯大学
  if (code === "DEAKIN") {
    return "迪肯大学（Deakin University）创立于1974年，是澳大利亚一所著名的公立大学，在运动科学、营养学、教育学、商科、信息技术等领域具有卓越声誉。学校在墨尔本、悉尼等多个城市设有校区，是澳大利亚最具创新性的大学之一。";
  }
  
  // 格里菲斯大学
  if (code === "GRIFFITH") {
    return "格里菲斯大学（Griffith University）创立于1971年，是澳大利亚一所著名的公立大学，在酒店管理、音乐与表演艺术、环境科学、医学等领域具有卓越声誉。学校位于昆士兰州，在黄金海岸和布里斯班均设有校区。";
  }
  
  // 科廷大学
  if (code === "CURTIN") {
    return "科廷大学（Curtin University）创立于1966年，是澳大利亚一所著名的研究型大学，在矿业与石油工程、医学、创意产业、商科等领域具有卓越实力。学校在珀斯、马来西亚、新加坡等地设有校区，是一所真正的国际化大学。";
  }
  
  // 南澳大学
  if (code === "UNISA") {
    return "南澳大学（University of South Australia）创立于1991年，是澳大利亚一所著名的公立大学，在商科、工程学、药学、护理学等领域具有良好声誉。学校是南澳大利亚州最大的大学，拥有先进的教学设施和研究条件。";
  }
  
  // 乐卓广大学
  if (code === "LATROBE") {
    return "乐卓广大学（La Trobe University）创立于1964年，是澳大利亚一所著名的公立大学，在护理学、公共健康、生物科学、人文社科等领域具有卓越声誉。学校在墨尔本、悉尼等多个城市设有校区，是澳大利亚主要的大学之一。";
  }
  
  // 皇家理工大学（英国）
  if (code === "RU") {
    return "雷丁大学（University of Reading）创立于1892年，是英国一所著名的研究型大学，在法学、教育学、商科、农学等领域具有良好声誉。学校位于伦敦西部雷丁市，交通便利，是英国主要的大学之一。";
  }
  
  // 卡迪夫大学
  if (code === "CARDIFF") {
    return "卡迪夫大学（Cardiff University）创立于1883年，是威尔士最大的大学，也是罗素大学集团成员。学校在新闻传播、建筑学、医学、工程学等领域具有卓越声誉，是英国主要的大学之一。";
  }
  
  // 利物蒲大学
  if (code === "LIVERPOOL") {
    return "利物蒲大学（University of Liverpool）创立于1881年，是英国著名的研究型大学，也是罗素大学集团成员。学校在医学、工程学、商科、法律等领域具有卓越声誉，是英国历史悠久的大学之一。";
  }
  
  // 纽卡斯尔大学（英国）
  if (code === "NEWCASTLE_UK") {
    return "纽卡斯尔大学（Newcastle University）创立于1834年，是英国著名的研究型大学，也是罗素大学集团成员。学校在医学、工程学、商科、人文社科等领域具有卓越声誉，是英国最好的大学之一。";
  }
  
  // 约克大学
  if (code === "YORK") {
    return "约克大学（University of York）创立于1963年，是英国著名的研究型大学，在历史、法律、教育学、商科等领域具有良好声誉。学校位于英格兰北部的约克市，校园环境优美，是英国主要的大学之一。";
  }
  
  // 兰卡斯特大学
  if (code === "LANCASTER") {
    return "兰卡斯特大学（University of Lancaster）创立于1964年，是英国著名的研究型大学，在商科、社会学、环境科学等领域具有卓越声誉。学校位于英格兰西北部，是英国最好的大学之一。";
  }
  
  // 爱尔兰都柏林大学
  if (code === "UCD") {
    return "都柏林大学学院（University College Dublin）创立于1854年，是爱尔兰最著名的大学，也是爱尔兰国立大学联盟成员。学校在商科、医学、工程学、法律等领域具有卓越声誉，是欧洲主要的大学之一。";
  }
  
  // 爱尔兰国立大学戈尔韦
  if (code === "NUIG") {
    return "爱尔兰国立大学戈尔韦（National University of Ireland, Galway）创立于1845年，是爱尔兰历史最悠久的大学之一，在医学、工程学、商科、艺术与人文等领域具有良好声誉。学校位于爱尔兰西部城市戈尔韦，校园环境优美。";
  }
  
  // 都柏林城市大学
  if (code === "DCU") {
    return "都柏林城市大学（Dublin City University）创立于1975年，是爱尔兰著名的公立大学，在教育学、工程学、商业与创新等领域具有卓越声誉。学校位于爱尔兰首都都柏林，是爱尔兰最现代化的大学之一。";
  }
  
  // 科克大学学院
  if (code === "UCC") {
    return "科克大学学院（University College Cork）创立于1845年，是爱尔兰国立大学的成员学院，在医学、食品科学、工程学、法律、商科等领域具有卓越声誉。学校是爱尔兰食品安全研究的领导者，位于爱尔兰第二大城市科克。";
  }
  
  // ============ 通用模板 ============
  
  // 通用模板 - 用于未匹配到具体学校的默认简介
  return `${chineseName}是一所具有国际影响力的高等教育机构，致力于为学生提供高质量的学术教育和研究机会。学校拥有丰富的学科设置和优秀的师资力量，注重培养学生的创新能力和综合素质。无论是在学术研究还是职业发展方面，学校都为学生提供了良好的平台和发展空间。`;
}

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  const schools = await getAllSchools();
  return schools.map(school => ({
    schoolCode: school.school_code,
  }));
}

interface PageProps {
  params: Promise<{ schoolCode: string }>;
}

function fixRegion(region: string): string {
  if (region === "婢冲ぇ鍒╀簹") return "澳大利亚";
  if (region === "鏂板姞鍧?") return "新加坡";
  if (region === "涓?浗婢抽棬") return "中国香港";
  if (region === "涓?浗棣欐腐") return "中国澳门";
  if (region === "鑻卞浗") return "英国";
  return region;
}

function formatSchoolFee(fees: string[]): { local: string; rmb: string } {
  if (fees.length === 0) {
    return { local: "官网确认", rmb: "" };
  }

  const validFees = fees.filter(f => f && f !== "待确认" && f !== "官网暂未明确" && !String(f).toLowerCase().includes("see official"));
  if (validFees.length === 0) {
    return { local: "官网确认", rmb: "" };
  }

  const exchangeRates: Record<string, number> = {
    "£": 9.2,
    "GBP": 9.2,
    "HKD": 0.92,
    "SGD": 5.35,
    "AUD": 4.75,
    "NZD": 4.4,
    "$": 7.2,
    "USD": 7.2,
    "€": 7.8,
    "EUR": 7.8,
  };

  const formatMoney = (currency: string, amount: number) => {
    const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
    return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  const extractFeeParts = (fee: string): { currency: string; amount: number } | null => {
    const feeLower = fee.toLowerCase();
    
    // 过滤掉 Home fee，只保留 Overseas/国际生
    if (feeLower.includes('home') && !feeLower.includes('overseas')) {
      return null;
    }
    if (feeLower.includes("band") || feeLower.includes("see official") || fee.includes("待确认")) {
      return null;
    }
    
    // 提取金额（支持 £、HKD、SGD、AUD 等）
    const amountMatch = fee.match(/(£|€|\$|GBP|HKD|SGD|AUD|NZD|USD|EUR)?\s*([0-9,]+(?:\.[0-9]+)?)/i);
    if (!amountMatch) return null;
    
    const currency = (amountMatch[1] || "").toUpperCase();
    const amount = Number(amountMatch[2].replace(/,/g, ""));
    if (!amount || amount < 1000) return null;
    
    return {
      currency,
      amount,
    };
  };

  const extractedFees = validFees
    .map(extractFeeParts)
    .filter((f): f is { currency: string; amount: number } => f !== null);

  if (extractedFees.length === 0) {
    return { local: "官网确认", rmb: "" };
  }

  // 按金额排序
  const sortedFees = extractedFees.sort((a, b) => a.amount - b.amount);

  const minFee = sortedFees[0];
  const maxFee = sortedFees[sortedFees.length - 1];
  const currency = minFee.currency || maxFee.currency;
  const rate = exchangeRates[currency];

  const local = minFee.amount === maxFee.amount
    ? `${formatMoney(currency, minFee.amount)}/年`
    : `${formatMoney(currency, minFee.amount)}–${formatMoney(currency, maxFee.amount)}/年`;

  const rmb = rate
    ? minFee.amount === maxFee.amount
      ? `约${(minFee.amount * rate / 10000).toFixed(1)}万元人民币`
      : `约${(minFee.amount * rate / 10000).toFixed(1)}–${(maxFee.amount * rate / 10000).toFixed(1)}万元人民币`
    : "";

  return { local, rmb };
}

function getApplicationDifficulty(ranking: number | undefined): { level: string; stars: string } {
  if (!ranking || ranking <= 0) {
    return { level: "中等竞争", stars: "⭐⭐⭐☆☆" };
  }
  if (ranking <= 30) {
    return { level: "高竞争", stars: "⭐⭐⭐⭐⭐" };
  }
  if (ranking <= 100) {
    return { level: "高竞争", stars: "⭐⭐⭐⭐☆" };
  }
  if (ranking <= 200) {
    return { level: "中等竞争", stars: "⭐⭐⭐☆☆" };
  }
  return { level: "相对友好", stars: "⭐⭐☆☆☆" };
}

export async function generateMetadata({ params }: PageProps) {
  const { schoolCode } = await params;
  const school = await getSchoolByCode(schoolCode);

  if (!school) {
    return {
      title: "学校详情 - 留学Hub",
    };
  }

  const chineseName = getSchoolChineseName(school.school_code);

  return {
    title: `${chineseName} - 留学Hub`,
    description: `查看 ${chineseName} 的详细招生信息，包括专业设置、学费、申请要求等。`,
  };
}

export default async function SchoolDetailPage({ params }: PageProps) {
  const { schoolCode } = await params;

  const [school, programs] = await Promise.all([
    getSchoolByCode(schoolCode),
    getProgramsBySchoolCode(schoolCode),
  ]);

  if (!school) {
    notFound();
  }

  const chineseName = getSchoolChineseName(school.school_code);
  const logoPath = getSchoolMarkPath(school.school_code);

  const schoolPrograms = programs;
  const programCount = schoolPrograms.length;

  // 提取学费信息
  const fees = schoolPrograms
    .map(p => p.fee)
    .filter(f => f && f !== "待确认");
  const feeRangeInfo = formatSchoolFee(fees);

  // 统计入学季
  const intakeCounts: Record<string, number> = {};
  schoolPrograms.forEach(p => {
    if (p.intake) {
      intakeCounts[p.intake] = (intakeCounts[p.intake] || 0) + 1;
    }
  });
  const mainIntake = Object.entries(intakeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "";

  // 计算申请难度
  const difficulty = getApplicationDifficulty(school.qs_ranking_2026);

  // 获取语言要求（从第一个有数据的项目获取）
  const sampleProgram = schoolPrograms.find(p => p.ielts || p.toefl);
  const languageRequirement = sampleProgram 
    ? formatLanguageRequirement(sampleProgram.ielts, sampleProgram.toefl)
    : "官网暂未明确，请以官网为准";

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* 返回按钮 + 面包屑 */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/schools"
            className="back-to-schools-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回院校库</span>
          </Link>

          <nav className="flex items-center space-x-2 text-sm flex-wrap">
            <Link href="/" className="text-blue-600 hover:text-blue-800">首页</Link>
            <span className="text-gray-400">/</span>
            <Link href="/schools" className="text-blue-600 hover:text-blue-800">院校库</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate max-w-[200px]" title={chineseName}>{chineseName}</span>
          </nav>
        </div>

        {/* 学校头部信息区域 */}
        <div className="bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50 rounded-2xl p-6 mb-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧：Logo + 学校信息 */}
            <div className="lg:col-span-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 p-2 shadow-sm ring-1 ring-blue-100">
                  {logoPath ? (
                    <Image
                      src={logoPath}
                      alt={`${chineseName} logo`}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                      priority
                    />
                  ) : (
                    <span className="text-blue-600 font-bold text-lg">
                      {school.school_code?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 mb-1 truncate">
                    {chineseName}
                  </h1>
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    {school.school_name_en || school.school_name || "待确认"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      {fixRegion(school.region_cn) || "待确认"}
                    </Badge>
                    {school.qs_ranking_2026 && school.qs_ranking_2026 > 0 && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        QS #{school.qs_ranking_2026}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {/* 学校标签 */}
              <div className="flex flex-wrap gap-2 mt-4">
                {getSchoolTags(school.school_code).map((tag: string) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 右侧：国际学生学费、项目数量、主要入学季 */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 国际学生学费 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">国际生学费</div>
                  <div className="text-base font-bold text-blue-600">
                    {feeRangeInfo.local}
                  </div>
                  {feeRangeInfo.rmb && (
                    <div className="text-sm text-blue-500 mt-1">
                      {feeRangeInfo.rmb}
                    </div>
                  )}
                </div>
                {/* 项目数量 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">项目数量</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {programCount}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    本科{schoolPrograms.filter(p => p.education_level === 'undergraduate').length} / 硕士{schoolPrograms.filter(p => p.education_level === 'postgraduate').length}
                  </div>
                </div>
                {/* 主要入学季 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">主要入学季</div>
                  <div className="text-base font-bold text-blue-600">
                    {mainIntake ? formatIntake(mainIntake) : "官网暂未明确"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 学校简介 */}
        <Card className="p-5 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2">学校简介</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {school.intro || generateSchoolIntro(chineseName, school.school_code)}
          </p>
        </Card>

        {/* 申请概览模块 */}
        <Card className="p-5 mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">申请概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 申请难度 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">申请难度</div>
              <div className="text-lg font-bold text-gray-900 mb-1">{difficulty.stars}</div>
              <div className={`text-sm font-medium ${
                difficulty.level === '高竞争' ? 'text-red-600' :
                difficulty.level === '中等竞争' ? 'text-orange-600' : 'text-green-600'
              }`}>
                {difficulty.level}
              </div>
            </div>
            {/* 语言要求 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">语言要求</div>
              <div className="text-sm font-medium text-gray-900 leading-relaxed">
                {languageRequirement}
              </div>
            </div>
            {/* 录取偏好 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">录取偏好</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-white text-xs text-gray-700 rounded-full">偏好985/211</span>
                <span className="px-2 py-1 bg-white text-xs text-gray-700 rounded-full">偏好相关背景</span>
                <span className="px-2 py-1 bg-white text-xs text-gray-700 rounded-full">偏好实习科研</span>
              </div>
            </div>
            {/* 截止时间 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">截止时间</div>
              <div className="text-sm font-medium text-gray-900">滚动录取</div>
              <div className="text-xs text-gray-500 mt-1">建议尽早申请</div>
            </div>
            {/* AI录取率评估 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-2">AI录取率评估</div>
              <Link
                href={`/ai/school-match?school=${encodeURIComponent(chineseName)}&region=${encodeURIComponent(fixRegion(school.region_cn) || '')}`}
                className="block w-full py-2 bg-blue-600 text-white text-sm font-medium text-center rounded-lg hover:bg-blue-700 transition-colors"
              >
                立即评估
              </Link>
              <div className="text-xs text-gray-500 mt-2 text-center">
                基于历史项目数据推测，仅供参考
              </div>
            </div>
          </div>
        </Card>

        {/* 专业列表 */}
        <SchoolDetailClient programs={schoolPrograms} schoolName={chineseName} region={fixRegion(school.region_cn) || ''} />
      </Container>
    </div>
  );
}
