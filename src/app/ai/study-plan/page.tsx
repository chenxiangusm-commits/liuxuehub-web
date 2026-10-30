"use client";

import {ResultView} from "@/components/StudyPlanResultView";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import {
  defaultStudyPlanForm,
  StudyPlanForm,
  StudyPlanResult,
  StudyPlanStage,
  normalizeStudyPlanTimeline,
} from "@/lib/ai/studyPlanMock";

const regions = ["英国", "中国香港", "新加坡", "澳大利亚", "中国澳门", "新西兰"];
const directions = ["金融", "商科", "计算机", "AI", "数据科学", "工程", "教育", "传媒", "法律", "其它"];
const backgrounds = ["985", "211", "双一流", "海外本科", "普通一本", "普通二本", "独立学院", "其他"];
const curriculumTypes = ["普高", "A-level", "IB", "AP", "OSSD", "HKDSE", "SAT/ACT", "国际学校", "其他"];

function OptionButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
          : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, 1200))}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value.slice(0, 300))}
          placeholder={placeholder}
          className={className}
        />
      )}
    </label>
  );
}

export default function StudyPlanPage() {
  const [form, setForm] = useState<StudyPlanForm>(defaultStudyPlanForm);
  const [result, setResult] = useState<StudyPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftReady,setDraftReady]=useState(false);
  useEffect(()=>{try{const raw=localStorage.getItem('studyPlanDraft');if(raw){const d=JSON.parse(raw);if(Array.isArray(d.regions))setForm({...defaultStudyPlanForm,...d});}}catch{}setDraftReady(true);},[]);
  useEffect(()=>{if(draftReady)try{localStorage.setItem('studyPlanDraft',JSON.stringify(form));}catch{}},[form,draftReady]);

  const updateForm = <K extends keyof StudyPlanForm>(key: K, value: StudyPlanForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleRegion = (region: string) => {
    setForm((current) => {
      const exists = current.regions.includes(region);
      return {
        ...current,
        regions: exists ? current.regions.filter((item) => item !== region) : [...current.regions, region],
      };
    });
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      degreeLevel: form.stage === "postgraduate" ? "硕士" : "本科",
      targetRegions: form.regions,
      targetMajor: form.stage === "postgraduate" ? form.direction : form.targetMajor || form.direction,
      schoolBackground: form.stage === "postgraduate" ? `${form.backgroundType || ""} ${form.schoolName || ""} ${form.major || ""}` : `${form.curriculumType || ""} ${form.highSchoolName || ""}`,
      gpa: form.stage === "postgraduate" ? form.gpa || "" : form.highSchoolGrades || "",
      language: form.language || "",
      greGmat: [form.gre, form.gmat, form.standardTests].filter(Boolean).join(" / "),
      experiences: [form.internship, form.research, form.projects, form.activities].filter(Boolean).join("\n"),
      goals: form.goals || "",
    };

    try {
      const response = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "生成失败，请稍后重试。");
      }
      const nextResult = {
        ...(data.data as StudyPlanResult),
        timeline: normalizeStudyPlanTimeline((data.data as StudyPlanResult).timeline),
      };
      setResult(nextResult);
      try {localStorage.setItem("studyPlanResult", JSON.stringify(nextResult));} catch {setError("方案已生成，但浏览器空间不足，请下载保存。");}
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI服务暂时不可用，你填写的资料已保留，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const isPostgraduate = form.stage === "postgraduate";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 via-white to-[#F8FAFC] py-12">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {["QS院校数据库", "历史申请趋势", "AI背景分析", "实时策略生成"].map((tag) => (
                <Badge key={tag} variant="primary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-950 md:text-5xl">
              AI留学规划书
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              输入学生背景，调用AI生成顾问可用于初步沟通的留学战略地图。
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="p-6 shadow-sm md:p-8">
            <div className="grid gap-8">
              <div>
                <p className="text-sm font-semibold text-blue-600">Step 1</p>
                <h2 className="mt-1 text-xl font-bold text-gray-950">申请阶段</h2>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["postgraduate", "硕士"],
                    ["undergraduate", "本科"],
                  ].map(([value, label]) => (
                    <OptionButton key={value} active={form.stage === value} onClick={() => updateForm("stage", value as StudyPlanStage)}>
                      {label}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">Step 2</p>
                <h2 className="mt-1 text-xl font-bold text-gray-950">目标地区</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {regions.map((region) => (
                    <OptionButton key={region} active={form.regions.includes(region)} onClick={() => toggleRegion(region)}>
                      {region}
                    </OptionButton>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">Step 3</p>
                <h2 className="mt-1 text-xl font-bold text-gray-950">目标方向</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {directions.map((direction) => (
                    <OptionButton key={direction} active={form.direction === direction} onClick={() => updateForm("direction", direction)}>
                      {direction}
                    </OptionButton>
                  ))}
                </div>
              </div>

              {isPostgraduate ? (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-gray-950">硕士申请背景</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {backgrounds.map((background) => (
                      <OptionButton key={background} active={form.backgroundType === background} onClick={() => updateForm("backgroundType", background)}>
                        {background}
                      </OptionButton>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field label="本科院校名称" value={form.schoolName || ""} placeholder="例如：上海财经大学" onChange={(value) => updateForm("schoolName", value)} />
                    <Field label="本科专业" value={form.major || ""} placeholder="例如：金融学" onChange={(value) => updateForm("major", value)} />
                    <Field label="GPA / 均分" value={form.gpa || ""} placeholder="例如：85/100 或 3.6/4.0" onChange={(value) => updateForm("gpa", value)} />
                    <Field label="语言成绩" value={form.language || ""} placeholder="例如：IELTS 6.5" onChange={(value) => updateForm("language", value)} />
                    <Field label="GRE" value={form.gre || ""} placeholder="可选" onChange={(value) => updateForm("gre", value)} />
                    <Field label="GMAT" value={form.gmat || ""} placeholder="可选" onChange={(value) => updateForm("gmat", value)} />
                    <Field label="实习经历" value={form.internship || ""} placeholder="简述公司、岗位和成果" onChange={(value) => updateForm("internship", value)} multiline />
                    <Field label="科研经历" value={form.research || ""} placeholder="简述论文、课题或研究经历" onChange={(value) => updateForm("research", value)} multiline />
                    <Field label="项目经历" value={form.projects || ""} placeholder="简述课程项目、竞赛或作品集" onChange={(value) => updateForm("projects", value)} multiline />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-gray-950">本科申请背景</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                    {curriculumTypes.map((type) => (
                      <OptionButton key={type} active={form.curriculumType === type} onClick={() => updateForm("curriculumType", type)}>
                        {type}
                      </OptionButton>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field label="高中名称" value={form.highSchoolName || ""} placeholder="例如：某国际学校" onChange={(value) => updateForm("highSchoolName", value)} />
                    <Field label="高中成绩" value={form.highSchoolGrades || ""} placeholder="例如：A-level AAB 或均分90" onChange={(value) => updateForm("highSchoolGrades", value)} />
                    <Field label="语言成绩" value={form.language || ""} placeholder="例如：IELTS 6.5" onChange={(value) => updateForm("language", value)} />
                    <Field label="标化成绩" value={form.standardTests || ""} placeholder="例如：SAT 1450 / ACT 32" onChange={(value) => updateForm("standardTests", value)} />
                    <Field label="活动经历" value={form.activities || ""} placeholder="竞赛、社团、志愿者、科研等" onChange={(value) => updateForm("activities", value)} multiline />
                    <Field label="目标专业" value={form.targetMajor || ""} placeholder="例如：计算机科学" onChange={(value) => updateForm("targetMajor", value)} />
                  </div>
                </div>
              )}

              <Field label="申请目标和偏好" value={form.goals || ""} placeholder="例如：预算、城市偏好、是否考虑移民、职业方向等" onChange={(value) => updateForm("goals", value)} multiline />

              {error && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "正在生成AI留学规划书..." : "生成AI留学规划书"}
              </button>
            </div>
          </Card>

          <aside className="space-y-4">
            <Card className="p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950">规划使用说明</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                依据你的背景和院校库现有资料整理方案。资料不足会明确说明；生成后可下载或打印，详细录取要求请查看专业页面。
              </p>
            </Card>
            <Card className="p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950">会生成什么？</h3>
              <div className="mt-4 grid gap-2 text-sm text-gray-600">
                {["学生画像", "冲刺/匹配/保底方案", "SWOT分析", "申请时间线", "行动建议", "风险提示"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>

        {result && <ResultView result={result} />}
      </Container>
    </main>
  );
}
