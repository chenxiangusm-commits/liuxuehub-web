import {getAllSchools,getProgramIndex} from '@/lib/data.server';
import {siteUrl} from '@/lib/site-url';
import {admissionsState} from '@/lib/admissions-state';
export const dynamic='force-dynamic';
export async function GET(){const [schools,programs]=await Promise.all([getAllSchools(),getProgramIndex()]);const paths=['/','/schools','/programs','/about','/references',...schools.map(s=>'/schools/'+encodeURIComponent(s.school_code)),...programs.filter(p=>admissionsState(p).code!=='archived').map(p=>'/programs/'+encodeURIComponent(p.id))];const escape=(x:string)=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>'+escape(siteUrl()+p)+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}});}
