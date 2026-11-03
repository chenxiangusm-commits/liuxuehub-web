import {Suspense} from 'react';
import ContactClient from './ContactClient';
export const metadata={title:'联系顾问｜九万里留学库',description:'整理选校清单，与九万里顾问沟通申请方向。',robots:{index:false,follow:true}};
export default function Page(){return <Suspense fallback={<p className="p-8">正在整理咨询资料…</p>}><ContactClient/></Suspense>;}
