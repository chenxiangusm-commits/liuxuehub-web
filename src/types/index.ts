export interface QSRanking {
  year: number;
  rank: number | null;
  rank_max: number | null;
  label: string;
  status: "ranked" | "unconfirmed";
  source: string;
  checked_on: string;
}

export interface School {
  school_code: string;
  school_name: string;
  school_name_en: string;
  school_name_cn?: string;
  region_cn: string;
  region_en: string;
  qs_ranking_2026: number;
  qs_ranking_latest?: QSRanking;
  education_levels: string[];
  program_counts?: {
    undergraduate: number;
    postgraduate: number;
    total: number;
  };
  total_programs: number;
  last_updated: string;
  data_source: string | string[];
  source_file: string;
  intro?: string;
  school_type?: string;
  logo_url?: string;
}

export interface AdmissionsEvidence {
  status: "verified" | "not_published" | "conflict" | "unconfirmed";
  cycle: string;
  sources: { url: string; key: string; label: string }[];
  note?: string;
}

export interface AdmissionsReview {
  checked_on: string;
  catalogue_status: "confirmed" | "unconfirmed" | "pending_approval" | "not_offered";
  catalogue_sources: { url: string; key: string; label: string }[];
  newness?: "existing" | "added_to_database" | "newly_offered";
  fields: Partial<Record<"deadline" | "fee" | "language", AdmissionsEvidence>>;
}

export interface AdmissionsPreview {
  cycle: string;
  entryYear: number | null;
  applicantScope: string;
  mode: string;
  updatedOn: string;
  intakeLabel: string;
  feeShort: string;
  feeNote: string;
  languageShort: string;
  languageDetails: string[];
  deadlineSummary: string;
  rounds: { label: string; date: string; time: string | null; display: string; closed: boolean }[];
  notices: string[];
  sections: { title: string; lines: string[]; sources: { url: string; key: string; label: string }[] }[];
  sources: Record<"deadline" | "fee" | "language" | "catalogue", { url: string; key: string; label: string }[]>;
}

export interface Program {
  id: string;
  education_level: "undergraduate" | "postgraduate";
  school_code: string;
  school_name: string;
  school_name_en: string;
  region_cn: string;
  region_en: string;
  qs_ranking_2026: number;
  qs_ranking_latest?: QSRanking;
  college: string;
  major_cn: string;
  major_en: string;
  degree: string;
  duration: string;
  intake: string;
  fee: string;
  deadline: string;
  ielts: string;
  toefl: string;
  gaokao_requirement: string | null;
  language_requirement: string | null;
  subject_requirement: string | null;
  admission_route: string | null;
  req_detail: string;
  official_url: string;
  study_mode: string;
  curriculum: string[];
  objectives: string;
  careers: string[];
  source_file: string;
  last_updated?: string;
  admissions_review?: AdmissionsReview;
  admissions_preview?: AdmissionsPreview;
}

export interface Database {
  meta: {
    name: string;
    version: string;
    generated_at: string;
    school_count: number;
    program_count: number;
    regions: string[];
    education_levels: string[];
  };
  schools: School[];
  programs: Program[];
}

export type ProgramIndexItem = Pick<
  Program,
  | "id"
  | "education_level"
  | "school_code"
  | "school_name"
  | "school_name_en"
  | "region_cn"
  | "qs_ranking_2026"
  | "qs_ranking_latest"
  | "major_cn"
  | "major_en"
  | "degree"
  | "duration"
  | "fee"
  | "deadline"
  | "ielts"
  | "toefl"
  | "language_requirement"
  | "admissions_review"
  | "admissions_preview"
>;

export interface FilterOptions {
  region?: string;
  educationLevel?: "undergraduate" | "postgraduate";
  school?: string;
  qsRanking?: string;
  feeKeyword?: string;
  ieltsKeyword?: string;
  majorKeyword?: string;
}
