"use client";

import Image from "next/image";
import Link from "next/link";
import { getSchoolMarkPath } from "@/lib/schoolLogos";
import { getRegionDisplayCn, getSchoolNameCn, getSchoolNameEn } from "@/lib/schoolDisplay";
import type { School } from "@/types";

interface SchoolCardProps {
  school: School;
  educationLevel: "all" | "undergraduate" | "postgraduate";
}

export default function SchoolCard({ school, educationLevel }: SchoolCardProps) {
  const counts = school.program_counts;
  const programCount = educationLevel === "undergraduate"
    ? counts?.undergraduate || 0
    : educationLevel === "postgraduate"
      ? counts?.postgraduate || 0
      : counts?.total || school.total_programs || 0;

  const logoPath = getSchoolMarkPath(school.school_code);
  const cnName = getSchoolNameCn(school);
  const enName = getSchoolNameEn(school);
  const region = getRegionDisplayCn(school);

  return (
    <Link href={`/schools/${school.school_code}`} className="school-card-new">
      <div className="card-logo">
        <Image
          src={logoPath}
          alt={cnName}
          width={64}
          height={64}
          className="card-logo-image"
        />
      </div>

      <div className="card-info">
        <h3 className="card-name-cn">{cnName}</h3>
        <p className="card-name-en">{enName}</p>
        <p className="card-region">{region}</p>
      </div>

      <div className="card-ranking">
        <div className="ranking-indicator">
          <span className="ranking-indicator-number">{programCount > 0 ? programCount : "--"}</span>
          <span className="ranking-indicator-label">专业数</span>
        </div>

        <div className="ranking-divider" />

        <div className="ranking-indicator">
          {school.qs_ranking_2026 && school.qs_ranking_2026 > 0 ? (
            <>
              <span className="ranking-indicator-number">{school.qs_ranking_2026}</span>
              <span className="ranking-indicator-label">QS排名</span>
            </>
          ) : (
            <>
              <span className="ranking-indicator-number no-rank">暂无</span>
              <span className="ranking-indicator-label">QS排名</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
