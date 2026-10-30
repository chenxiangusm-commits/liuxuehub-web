import type { HkApplicantProfile } from "./hk-applicant-profile";

export interface AuApplicantProfile {
  title: string;
  scope: string;
  summary: string;
  items: { label: string; value: string; detail: string }[];
  notes: string[];
  tips: string[];
  sources: { label: string; url: string }[];
  basis: string;
  inactive: boolean;
  caseProfile?: HkApplicantProfile;
}
