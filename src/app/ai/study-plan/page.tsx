"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { defaultStudyPlanForm, StudyPlanForm, StudyPlanStage } from "@/lib/ai/studyPlanMock";
import { AIModels } from "@/config/aiModels";
import { ReportBranding } from "@/config/reportBranding";

const regions = ["英国", "香港", "新加坡", "澳洲", "美国", "加拿大"];
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
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      )}
    </label>
  );
}

export default function StudyPlanPage() {
  const router = useRouter();
  const [form, setForm] = useState<StudyPlanForm>(defaultStudyPlanForm);

  const updateForm = <K extends keyof StudyPlanForm>(key: K, value: StudyPlanForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleRegion = (region: string) => {
    setForm((current) => {
      const exists = current.regions.includes(region);
      return {
        ...current,
        regions: exists
          ? current.regions.filter((item) => item !== region)
          : [...current.regions, region],
      };
    });
  };

  const submit = () => {
    localStorage.setItem("studyPlanForm", JSON.stringify(form));
    router.push("/ai/study-plan/result");
  };

  const isPostgraduate = form.stage === "postgraduate";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50 via-white to-[#F8FAFC] py-14">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {["QS院校数据库", "历史申请趋势", "AI背景分析", "实时策略生成"].map((tag) => (
                <Badge key={tag} variant="primary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
              AI大数据留学规划书
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              输入你的背景信息，生成专属留学战略地图。
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={submit}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                立即生成规划书
              </button>
              <Link
                href="/ai/study-plan/result"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                查看样例
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              ["院校项目数据", "40000+"],
              ["申请分析数据", "300000+"],
              ["AI分析维度", "120+"],
            ].map(([label, value]) => (
              <Card key={label} className="p-6 text-center shadow-sm" hoverable>
                <div className="text-3xl font-black text-blue-600">{value}</div>
                <div className="mt-2 text-sm font-medium text-gray-500">{label}</div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="p-6 shadow-sm md:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">Step 1</p>
              <h2 className="mt-1 text-xl font-bold text-gray-950">申请阶段</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["postgraduate", "硕士"],
                  ["undergraduate", "本科"],
                ].map(([value, label]) => (
                  <OptionButton
                    key={value}
                    active={form.stage === value}
                    onClick={() => updateForm("stage", value as StudyPlanStage)}
                  >
                    {label}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">Step 2</p>
              <h2 className="mt-1 text-xl font-bold text-gray-950">目标地区</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {regions.map((region) => (
                  <OptionButton
                    key={region}
                    active={form.regions.includes(region)}
                    onClick={() => toggleRegion(region)}
                  >
                    {region}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">Step 3</p>
              <h2 className="mt-1 text-xl font-bold text-gray-950">目标方向</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                {directions.map((direction) => (
                  <OptionButton
                    key={direction}
                    active={form.direction === direction}
                    onClick={() => updateForm("direction", direction)}
                  >
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
                    <OptionButton
                      key={background}
                      active={form.backgroundType === background}
                      onClick={() => updateForm("backgroundType", background)}
                    >
                      {background}
                    </OptionButton>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="本科院校名称" value={form.schoolName || ""} placeholder="例如：上海财经大学" onChange={(value) => updateForm("schoolName", value)} />
                  <Field label="本科专业" value={form.major || ""} placeholder="例如：金融学" onChange={(value) => updateForm("major", value)} />
                  <Field label="GPA / 均分" value={form.gpa || ""} placeholder="例如：85/100 或 3.6/4.0" onChange={(value) => updateForm("gpa", value)} />
                  <Field label="语言成绩" value={form.language || ""} placeholder="例如：雅思 6.5" onChange={(value) => updateForm("language", value)} />
                  <Field label="GRE" value={form.gre || ""} placeholder="可选" onChange={(value) => updateForm("gre", value)} />
                  <Field label="GMAT" value={form.gmat || ""} placeholder="可选" onChange={(value) => updateForm("gmat", value)} />
                  <Field label="实习经历" value={form.internship || ""} placeholder="简述实习公司、岗位和成果" onChange={(value) => updateForm("internship", value)} multiline />
                  <Field label="科研经历" value={form.research || ""} placeholder="简述论文、课题或研究经历" onChange={(value) => updateForm("research", value)} multiline />
                  <Field label="项目经历" value={form.projects || ""} placeholder="简述课程项目、竞赛或作品集" onChange={(value) => updateForm("projects", value)} multiline />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-gray-950">本科申请背景</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {curriculumTypes.map((type) => (
                    <OptionButton
                      key={type}
                      active={form.curriculumType === type}
                      onClick={() => updateForm("curriculumType", type)}
                    >
                      {type}
                    </OptionButton>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field label="高中名称" value={form.highSchoolName || ""} placeholder="例如：某某国际学校" onChange={(value) => updateForm("highSchoolName", value)} />
                  <Field label="高中成绩" value={form.highSchoolGrades || ""} placeholder="例如：A-level AAB 或均分 90" onChange={(value) => updateForm("highSchoolGrades", value)} />
                  <Field label="语言成绩" value={form.language || ""} placeholder="例如：雅思 6.5" onChange={(value) => updateForm("language", value)} />
                  <Field label="标化成绩" value={form.standardTests || ""} placeholder="例如：SAT 1450 / ACT 32" onChange={(value) => updateForm("standardTests", value)} />
                  <Field label="活动经历" value={form.activities || ""} placeholder="竞赛、社团、志愿者、科研等" onChange={(value) => updateForm("activities", value)} multiline />
                  <Field label="目标专业" value={form.targetMajor || ""} placeholder="例如：计算机科学" onChange={(value) => updateForm("targetMajor", value)} />
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={submit}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                立即生成规划书
              </button>
              <Link
                href="/ai/study-plan/result"
                className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
              >
                查看样例
              </Link>
            </div>
          </Card>

          <aside className="space-y-4">
            <Card className="p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950">本轮MVP说明</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                当前版本仅做前端交互和数据结构预留，不调用真实AI、不接支付、不生成真实PDF。
              </p>
              <div className="mt-5 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between rounded-xl bg-blue-50 px-4 py-3">
                  <span>规划模型</span>
                  <strong className="text-blue-700">{AIModels.planning.model}</strong>
                </div>
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span>推理模型</span>
                  <strong className="text-gray-800">{AIModels.reasoning.model}</strong>
                </div>
                <div className="flex justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span>品牌模式</span>
                  <strong className="text-gray-800">{ReportBranding.companyName}</strong>
                </div>
              </div>
            </Card>
            <Card className="p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-950">会生成什么？</h3>
              <div className="mt-4 grid gap-2 text-sm text-gray-600">
                {["学生画像", "SWOT分析", "冲刺/匹配/保底方案", "背景差距分析", "申请时间轴", "行动建议"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </Container>
    </main>
  );
}

