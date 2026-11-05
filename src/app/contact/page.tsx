import { SITE } from '@/config/site';
import { publicMetadata } from '@/lib/public-metadata';
import { parseSharedIds } from '@/lib/plan';
import { resolveCollection } from '@/lib/catalog.server';
import ContactClient from './ContactClient';

type Props = { searchParams: Promise<{ ids?: string | string[] }> };
export async function generateMetadata({searchParams}: Props) {
  return {
    ...publicMetadata('/contact', '联系顾问｜九万里留学库', '整理申请目标和选校清单，通过九万里咨询邮箱联系顾问。'),
    robots: { index: (await searchParams).ids === undefined, follow: true },
  };
}
export default async function ContactPage({searchParams}: Props) {
  const rawIds = (await searchParams).ids;
  const ids = parseSharedIds(typeof rawIds === 'string' ? rawIds : null);
  const {items} = ids.length ? await resolveCollection(ids) : {items: []};
  return <main className="design-container py-10"><div className="mx-auto max-w-3xl">
    <h1 className="text-3xl font-semibold">联系九万里留学顾问</h1>
    <p className="mt-3 leading-7 text-slate-600">可以直接发邮件，也可以先整理申请目标和选校清单。</p>
    <section className="mt-6 rounded-2xl border bg-white p-6">
      <h2 className="font-semibold">九万里留学库咨询邮箱</h2>
      <a className="mt-2 inline-block break-all text-xl text-blue-700 underline" href={'mailto:'+SITE.email}>{SITE.email}</a>
    </section>
    {rawIds !== undefined && (!ids.length || items.length < ids.length) && <p role="status" className="mt-4 text-sm">部分清单项目无法读取，可以在邮件中补充项目名称。</p>}
    <ContactClient items={items}/>
  </div></main>;
}
