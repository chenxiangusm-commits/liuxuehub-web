import ProgramExplorer from "@/components/ProgramExplorer";
export const dynamic="force-dynamic";
export const metadata={title:"专业库｜留学Hub"};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {return <ProgramExplorer initial={await searchParams}/>;}
