import type { HkApplicantProfile } from './hk-applicant-profile';
import type { AdmissionState } from './admissions-state';
export interface CatalogItem {
 id:string; schoolCode:string; school:string; name:string; nameEn:string; region:string;
 degree:string; level:string; duration:string; fee:string; feeNote?:string; language:string; deadline:string;
 cycle:string; year:number|null; updated:string; rank:string; officialUrl:string;
 state:AdmissionState; hasCurrentPresentation:boolean; profile?:HkApplicantProfile;
}
export interface SchoolSummary {id:string;name:string;region:string;programs:number}
