import {NextResponse} from "next/server";
export const dynamic="force-dynamic";
export async function POST(){return NextResponse.json({ok:false,message:"账户服务尚未开放。可直接浏览院校、专业并使用本机清单。"},{status:503});}
