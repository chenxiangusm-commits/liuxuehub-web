import { getAllSchools } from "@/lib/data.server";
import SchoolsClient from "./SchoolsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "院校库｜全球大学排名与申请项目｜九万里留学库",
  description: "按地区、QS排名和申请阶段筛选全球院校，查看学校详情、专业项目、学费和语言要求。",
};

export default async function SchoolsPage() {
  const schools = await getAllSchools();

  return (
    <main>
      <SchoolsClient schools={schools} />
    </main>
  );
}
