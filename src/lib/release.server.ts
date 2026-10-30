import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import type { Program,School } from '@/types';
import type { HkApplicantProfile } from './hk-applicant-profile';
import type { AuApplicantProfile } from './au-applicant-profile';

type Profiles<T>={schema:number;local_preview_only:boolean;schools:Record<string,T>;programs:Record<string,T>};
export interface ReleaseBundle {
 schema:1;createdAt:string;status:'candidate';schools:School[];programs:Program[];
 profiles:{hk:Profiles<HkApplicantProfile>;uk:Profiles<HkApplicantProfile>;sg:Profiles<HkApplicantProfile>;au:Profiles<AuApplicantProfile>};
}
let cached:{key:string;value:ReleaseBundle}|undefined;
// A single immutable, hash-pinned file replaces incremental multi-file updates.
// Approval is external to the candidate: generating a bundle never approves it.
export function readRelease():ReleaseBundle|undefined {
 const file=process.env.LIUXUEHUB_RELEASE_FILE;
 if(!file){if(process.env.NODE_ENV==='production')throw new Error('Production requires an explicitly selected and approved admissions release.');return undefined;}
 const expected=process.env.LIUXUEHUB_RELEASE_SHA256||'';
 if(!/^[a-f0-9]{64}$/.test(expected))throw new Error('Missing release SHA-256');
 // Preview authorization is scoped to Vercel previews; it cannot approve production.
 const approvedPreview=process.env.VERCEL_ENV==='preview' && process.env.LIUXUEHUB_RELEASE_PREVIEW_SHA256===expected;
 if(process.env.NODE_ENV==='production' && process.env.LIUXUEHUB_REHEARSAL!=='local-only' && !approvedPreview && process.env.LIUXUEHUB_RELEASE_APPROVED_SHA256!==expected)throw new Error('This release has not been approved for publication.');
 const full=path.resolve(file);const stat=fs.statSync(full);const key=`${full}:${stat.size}:${stat.mtimeMs}:${expected}`;
 if(cached?.key===key)return cached.value;
 const bytes=fs.readFileSync(full);
 if(createHash('sha256').update(bytes).digest('hex')!==expected)throw new Error('Release integrity check failed');
 const value=JSON.parse(bytes.toString('utf8')) as ReleaseBundle;
 if(value.schema!==1||!Array.isArray(value.schools)||!Array.isArray(value.programs)||!value.profiles)throw new Error('Invalid release structure');
 const schools=new Set(value.schools.map(s=>s.school_code));const ids=new Set(value.programs.map(p=>p.id));
 if(schools.size!==value.schools.length||ids.size!==value.programs.length||value.programs.some(p=>!p.id||!schools.has(p.school_code)))throw new Error('Release identity/index mismatch');
 for(const profile of Object.values(value.profiles)){if(!profile.programs||!profile.schools||Object.keys(profile.programs).some(id=>!ids.has(id))||Object.keys(profile.schools).some(id=>!schools.has(id)))throw new Error('Release profile identity mismatch');}
 cached={key,value};return value;
}
