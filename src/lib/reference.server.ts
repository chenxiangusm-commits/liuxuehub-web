import {readRelease} from './release.server';
import {getAllSchools} from './data.server';
import type {HkApplicantProfile} from './hk-applicant-profile';
export async function referenceSchools(){
 const release=readRelease();const schools=await getAllSchools();
 if(!release)return [];
 return schools.flatMap(s=>{
  const profile:HkApplicantProfile|undefined=release.profiles.hk.schools[s.school_code]||release.profiles.sg.schools[s.school_code]||release.profiles.uk.schools[s.school_code]||release.profiles.au.schools[s.school_code]?.caseProfile;
  return profile?[{code:s.school_code,name:s.school_name,region:s.region_cn,profile}]:[];
 }).sort((a,b)=>a.name.localeCompare(b.name,'zh-CN'));
}
