import {catalogPage} from '@/lib/catalog.server';
import {explorerFilters,explorerQuery} from '@/lib/explorer-filters';
import {budgetIssue} from '@/lib/budget-policy';
import { publicMetadata } from '@/lib/public-metadata';
export const metadata = publicMetadata('/programs', '专业库｜九万里留学库', '按地区、学科和招生年份筛选专业，比较国际学生学费、语言条件和申请截止日期。');
import ProgramExplorer from "@/components/ProgramExplorer";
export const dynamic="force-dynamic";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const initial=await searchParams;
  const query=explorerQuery(explorerFilters(initial));
  const seed=budgetIssue(query)?undefined:await catalogPage(query);
  return <ProgramExplorer key={query.toString()} initial={initial} seed={seed}/>;
}
