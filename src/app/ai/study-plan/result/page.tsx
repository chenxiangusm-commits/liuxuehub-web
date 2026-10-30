"use client";
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {ResultView} from '@/components/StudyPlanResultView';
import type {StudyPlanResult} from '@/lib/ai/studyPlanMock';
export default function SavedPlan(){const [result,setResult]=useState<StudyPlanResult|null>(null);const [ready,setReady]=useState(false);useEffect(()=>{try{const x=JSON.parse(localStorage.getItem('studyPlanResult')||'null');if(x?.studentProfile&&x?.schoolStrategy&&Array.isArray(x.references))setResult(x);}catch{}setReady(true);},[]);return <main className="mx-auto max-w-6xl p-6"><h1 className="text-2xl font-bold">已保存的规划方案</h1>{!ready?<p>读取中…</p>:result?<ResultView result={result}/>:<p className="my-6">本机暂无可用规划，请先填写背景并生成。旧版样例不会作为你的方案显示。</p>}<Link className="text-blue-600 underline" href="/ai/study-plan">返回规划</Link></main>}
