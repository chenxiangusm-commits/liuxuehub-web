import {NextRequest,NextResponse} from 'next/server';
import {catalogPage,resolveCollection} from '@/lib/catalog.server';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){return NextResponse.json(await catalogPage(request.nextUrl.searchParams));}
export async function POST(request:NextRequest){
 const body=await request.json().catch(()=>null);
 if(!body||!Array.isArray(body.ids)||body.ids.length>200||body.ids.some((x:unknown)=>typeof x!=='string'||x.length>300))return NextResponse.json({error:'每次最多读取 200 个收藏。'},{status:400});
 return NextResponse.json(await resolveCollection(body.ids));
}
