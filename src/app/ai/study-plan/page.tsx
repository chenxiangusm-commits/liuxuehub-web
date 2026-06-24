"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import {
  defaultStudyPlanForm,
  StudyPlanForm,
  StudyPlanResult,
  StudyPlanStage,
  normalizeStudyPlanTimeline,
  studyPlanMockResult,
} from "@/lib/ai/studyPlanMock";

const regions = ["英国", "中国香港", "新加坡", "澳大利亚", "美国", "加拿大"];
const directions = ["金融", "商科", "计算机", "AI", "数据科学", "工程", "教育", "传媒", "法律", "其它"];
const backgrounds = ["985", "211", "双一流", "海外本科", "普通一本", "普通二本", "独立学院", "其他"];
const curriculumTypes = ["普高", "A-level", "IB", "AP", "OSSD", "HKDSE", "SAT/ACT", "国际学校", "其他"];

type BetaMetricEvent = "generate_click" | "generate_failure" | "json_fallback" | "lead_submit";

function trackBetaMetric(event: BetaMetricEvent) {
  if (typeof window === "undefined") return;
  const key = "studyPlanBetaMetrics";
  const current = JSON.parse(localStorage.getItem(key) || "{}") as Record<string, number>;
  localStorage.setItem(
    key,
    JSON.stringify({
      ...current,
      [event]: (current[event] || 0) + 1,
      lastEvent: event,
      lastEventAt: new Date().toISOString(),
    })
  );
}

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

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {(items.length ? items : ["建议补充确认"]).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultView({ result }: { result: StudyPlanResult }) {
  const [betaMessage, setBetaMessage] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", contact: "", note: "" });
  const timeline = normalizeStudyPlanTimeline(result.timeline);
  const strategies = [
    ["冲刺", result.schoolStrategy.reach, "border-red-100 bg-red-50/50"],
    ["匹配", result.schoolStrategy.match, "border-blue-100 bg-blue-50/50"],
    ["保底", result.schoolStrategy.safe, "border-emerald-100 bg-emerald-50/50"],
  ] as const;

  const showBetaMessage = () => {
    setBetaMessage("正式版开放，当前可先提交内测申请。");
  };

  return (
    <div className="mt-10 space-y-6">
      <Card className="p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge variant="primary">AI生成结果</Badge>
            <h2 className="mt-3 text-2xl font-black text-slate-950">学生画像</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{result.studentProfile.summary}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-6 py-5 text-center">
            <div className="text-4xl font-black text-blue-600">{result.studentProfile.competitivenessScore}</div>
            <div className="mt-1 text-xs font-bold text-blue-700">竞争力评分</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ListBlock title="优势" items={result.studentProfile.strengths} />
          <ListBlock title="短板" items={result.studentProfile.weaknesses} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {strategies.map(([label, list, style]) => (
          <Card key={label} className={`p-5 shadow-sm ${style}`}>
            <h3 className="text-xl font-black text-slate-950">{label}方案</h3>
            <div className="mt-4 space-y-3">
              {(list.length ? list : [{ school: "建议补充确认", program: "建议补充确认", reason: "需要更多学生背景后细化。", risk: "信息不足。" }]).map((item) => (
                <div key={`${label}-${item.school}-${item.program}`} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="font-bold text-slate-950">{item.school}</div>
                  <div className="mt-1 text-sm font-semibold text-blue-600">{item.program}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                  <p className="mt-2 text-xs leading-5 text-red-600">风险：{item.risk}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">SWOT分析</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ListBlock title="优势" items={result.swot.strengths} />
          <ListBlock title="劣势" items={result.swot.weaknesses} />
          <ListBlock title="机会" items={result.swot.opportunities} />
          <ListBlock title="风险" items={result.swot.threats} />
        </div>
      </Card>

      <Card className="p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">申请时间线</h2>
        <div className="mt-5 space-y-4">
          {timeline.map((item) => (
            <div key={`${item.time}-${item.stage}`} className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-950">{item.stage}</h3>
                <span className="text-sm font-bold text-blue-600">{item.time}</span>
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                {(item.tasks.length ? item.tasks : ["建议补充确认"]).map((task) => (
                  <li key={task}>✓ {task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">行动建议</h2>
          <div className="mt-5 space-y-3">
            {result.actionPlan.map((item) => (
              <div key={`${item.priority}-${item.action}`} className="rounded-2xl bg-slate-50 p-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">优先级：{item.priority}</span>
                <h3 className="mt-3 font-bold text-slate-950">{item.action}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">顾问备注与风险提示</h2>
          <div className="mt-5 space-y-4">
            <ListBlock title="顾问备注" items={result.advisorNotes} />
            <ListBlock title="风险提示" items={result.riskNotes} />
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm">
        <p className="text-sm leading-6 text-slate-500">{result.disclaimer}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {["保存方案", "导出PDF", "发给学生"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={showBetaMessage}
              title="正式版开放，当前可先提交内测申请。"
              className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-bold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
            >
              {label}（Beta）
            </button>
          ))}
        </div>
        {betaMessage && (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {betaMessage}
          </div>
        )}
      </Card>

      <Card className="overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <Badge variant="default">Beta 内测</Badge>
          <h2 className="mt-3 text-2xl font-black">保存这份学生规划方案</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
            当前为 Beta 版本。你可以留下联系方式，我们将在正式版开放方案保存、PDF导出和发送给学生功能。
          </p>
        </div>
        <form
          className="grid gap-4 p-6 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            trackBetaMetric("lead_submit");
            setLeadSubmitted(true);
            setBetaMessage("");
          }}
        >
          <Field
            label="姓名/机构名"
            value={leadForm.name}
            placeholder="例如：王老师 / 某某留学"
            onChange={(value) => setLeadForm((current) => ({ ...current, name: value }))}
          />
          <Field
            label="微信号或手机号"
            value={leadForm.contact}
            placeholder="方便我们联系你开通内测"
            onChange={(value) => setLeadForm((current) => ({ ...current, contact: value }))}
          />
          <div className="md:col-span-2">
            <Field
              label="备注（可选）"
              value={leadForm.note}
              placeholder="例如：机构规模、希望优先体验的功能、学生数量等"
              onChange={(value) => setLeadForm((current) => ({ ...current, note: value }))}
              multiline
            />
          </div>
          <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              提交内测申请
            </button>
            {leadSubmitted && (
              <span className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                已收到内测申请，我们会尽快联系你。
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function StudyPlanPage() {
  const [form, setForm] = useState<StudyPlanForm>(defaultStudyPlanForm);
  const [result, setResult] = useState<StudyPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);

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
    trackBetaMetric("generate_click");
    setLoading(true);
    setError("");
    setUsedFallback(false);

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
      localStorage.setItem("studyPlanResult", JSON.stringify(nextResult));
    } catch (err) {
      trackBetaMetric("generate_failure");
      setError(err instanceof Error ? err.message : "AI服务暂时不可用，已展示样例结果。");
      setResult(studyPlanMockResult);
      setUsedFallback(true);
      trackBetaMetric("json_fallback");
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
                  {error.includes("AI服务暂未配置") ? error : usedFallback ? "AI服务暂时不可用，当前展示样例规划书。" : error}
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
              <h3 className="text-lg font-bold text-gray-950">Beta真实AI闭环</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                本页会调用后端AI接口生成结构化JSON规划书。不会写入数据库，不接登录、支付或PDF导出。
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
