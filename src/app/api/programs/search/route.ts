import { NextRequest, NextResponse } from "next/server";
import { searchProgramIndex } from "@/lib/data.server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() || "";
  const region = searchParams.get("region")?.trim() || "";
  const educationLevel = searchParams.get("educationLevel")?.trim() || "";
  const schoolCode = searchParams.get("schoolCode")?.trim() || "";
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") || searchParams.get("limit") || "20", 10), 1), 100);
  const offsetParam = searchParams.get("offset");
  const offset = offsetParam ? Math.max(parseInt(offsetParam, 10), 0) : undefined;

  if (!keyword && !region && !educationLevel && !schoolCode) {
    return NextResponse.json(
      { success: false, error: "Please enter a keyword or select a filter." },
      { status: 400 },
    );
  }

  const {
    results,
    total,
    offset: resolvedOffset,
    pageSize: resolvedPageSize,
  } = await searchProgramIndex({
    keyword,
    region,
    educationLevel,
    schoolCode,
    page,
    pageSize,
    offset,
  });

  return NextResponse.json({
    success: true,
    data: results.map(program => ({
      id: program.id,
      schoolName: program.school_name,
      schoolNameEn: program.school_name_en,
      region: program.region_cn,
      qsRanking: program.qs_ranking_2026,
      majorCn: program.major_cn,
      majorEn: program.major_en,
      degree: program.degree,
      duration: program.duration || "TBD",
      fee: program.fee || "TBD",
      deadline: program.deadline || "TBD",
      ielts: program.ielts || "TBD",
      toefl: program.toefl || "TBD",
    })),
    meta: {
      total,
      returned: results.length,
      keyword,
      region,
      educationLevel,
      schoolCode,
      page,
      pageSize: resolvedPageSize,
      offset: resolvedOffset,
      hasMore: resolvedOffset + results.length < total,
    },
  });
}
