import { publicMetadata } from '@/lib/public-metadata';
import { PublicSchema } from '@/components/PublicSchema';
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramById } from "@/lib/data.server";
import ProgramDetailClient from "./ProgramDetailClient";
import { getAuProgramProfile } from "@/lib/au-applicant-profile.server";
import { getHkProgramProfile } from "@/lib/hk-applicant-profile.server";
import { getSgProgramProfile } from "@/lib/sg-applicant-profile.server";
import { getUkProgramProfile } from "@/lib/uk-applicant-profile.server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const program = await getProgramById(id);
  
  if (!program) {
    return {
      title: "专业详情 - 九万里留学库",
    };
  }

  return publicMetadata(`/programs/${program.id}`, `${program.major_cn || program.major_en} 申请条件｜${program.school_name || "学校"}｜九万里留学库`, `查看${program.school_name || ""}${program.major_cn || program.major_en}的国际生学费、语言要求、申请时间线和AI申请参考。`);
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="design-container pt-6">
      <PublicSchema entries={[{'@type':'Course',name:program.major_cn||program.major_en,provider:{'@type':'CollegeOrUniversity',name:program.school_name}}]} trail={[{name:'专业库',path:'/programs'},{name:program.major_cn||program.major_en,path:'/programs/'+program.id}]}/>
      <div className="mb-0">
        <nav className="flex flex-wrap items-center gap-2 text-xs">
          <Link href="/" className="text-blue-600 hover:text-blue-800">首页</Link>
          <span className="text-gray-400">/</span>
          <Link href="/programs" className="text-blue-600 hover:text-blue-800">专业库</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{program.major_cn || program.major_en}</span>
        </nav>
      </div>

      <ProgramDetailClient program={program} auProfile={program.region_cn === "澳大利亚" && program.education_level === "postgraduate" ? getAuProgramProfile(program.id) : undefined} hkProfile={program.region_cn === "中国香港" && program.education_level === "postgraduate" ? getHkProgramProfile(program.id) : undefined} sgProfile={program.region_cn === "新加坡" && program.education_level === "postgraduate" ? getSgProgramProfile(program.id) : undefined} ukProfile={program.region_cn === "英国" && program.education_level === "postgraduate" ? getUkProgramProfile(program.id) : undefined} />
    </div>
  );
}
