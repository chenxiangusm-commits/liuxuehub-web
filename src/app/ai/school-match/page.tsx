import ProgramExplorer from "@/components/ProgramExplorer";
export const dynamic="force-dynamic";
export const metadata={title:"个人选校与申请匹配｜九万里留学库"};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {const params=await searchParams;return <ProgramExplorer matching initial={{...params,q:params.q||params.program||""}}/>;}
