import { publicMetadata } from '@/lib/public-metadata';
export const metadata = publicMetadata('/schools', '院校库｜全球大学排名与申请项目｜九万里留学库', '按地区、QS 排名和申请阶段筛选院校，查看专业与申请资料。');
import { getAllSchools } from "@/lib/data.server";
import SchoolsClient from "./SchoolsClient";

export const dynamic = "force-dynamic";



export default async function SchoolsPage({ searchParams }: { searchParams: Promise<{ region?: string | string[] }> }) {
  const [schools, { region }] = await Promise.all([getAllSchools(), searchParams]);

  return (
    <main>
      <SchoolsClient key={String(region || "")} schools={schools} initialRegion={typeof region === "string" ? region : undefined} />
    </main>
  );
}
