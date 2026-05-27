import SchoolMatchClient from './SchoolMatchClient';

export const metadata = {
  title: "AI智能定校 - 留学Hub",
  description: "基于院校库、QS排名、专业方向、GPA与语言成绩，生成冲刺/稳妥/保底选校方案",
};

export default function SchoolMatchPage() {
  return <SchoolMatchClient />;
}
