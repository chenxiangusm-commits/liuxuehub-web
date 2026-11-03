import ProgramExplorer from "@/components/ProgramExplorer";
export const dynamic="force-dynamic";
export const metadata={title:"专业库｜九万里留学库"};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {return <ProgramExplorer initial={await searchParams}/>;}
