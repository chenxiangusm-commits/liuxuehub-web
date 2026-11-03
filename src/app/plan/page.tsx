import {Suspense} from 'react';
import PlanClient from './PlanClient';
export const metadata={title:'选校方案｜九万里留学库',robots:{index:false,follow:false}};
export default function Page(){return <Suspense fallback={<p className="p-8">正在整理方案…</p>}><PlanClient/></Suspense>;}
