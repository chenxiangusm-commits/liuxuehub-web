import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramById } from "@/lib/data.server";
import ProgramDetailClient from "./ProgramDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const program = await getProgramById(id);
  
  if (!program) {
    return {
      title: "专业详情 - 留学Hub",
    };
  }

  return {
    title: `${program.major_cn || program.major_en} 申请条件｜${program.school_name || "学校"}｜留学Hub`,
    description: `查看${program.school_name || ""}${program.major_cn || program.major_en}的国际生学费、语言要求、申请时间线和AI申请参考。`,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  const program = await getProgramById(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 面包屑 */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-800">首页</Link>
          <span className="text-gray-400">/</span>
          <Link href="/programs" className="text-blue-600 hover:text-blue-800">专业库</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{program.major_cn || program.major_en}</span>
        </nav>
      </div>

      <ProgramDetailClient program={program} />
    </div>
  );
}
