export interface HkProfileBand {
  group: string;
  scale: number;
  low: number;
  high: number;
  count: number;
  basis: "program" | "direction" | "school";
  basisLabel: string;
  limited: boolean;
}

export interface HkApplicantProfile {
  label: string;
  period: string;
  count: number;
  bands: HkProfileBand[];
  direction: string | null;
  source: string;
  minimum: number;
  directions?: Record<string, HkApplicantProfile>;
}

export function formatHkBand(band: HkProfileBand): string {
  const value = (n: number) => band.scale === 100 ? String(n) : n.toFixed(1);
  return `${value(band.low)}–${value(band.high)}${band.scale === 100 ? " 分" : ` / ${band.scale}`}`;
}

export interface HkMatchInput {
  group: string;
  scale: number;
  grade: string;
  academic: string;
  language: string;
  intake: string;
}

// Comparison against historical case distributions only; never an admission probability.
export function compareHkBackground(profile: HkApplicantProfile | undefined, input: HkMatchInput, closed: boolean) {
  if (closed) return { title: "当前批次已截止", detail: "请先查看新一轮招生安排，再进行申请匹配。" };
  if ([input.academic, input.language, input.intake].includes("no")) {
    return { title: "需补条件", detail: "先处理未满足的学历、专业背景、语言或招生批次条件，分数不能代替这些要求。" };
  }
  if ([input.academic, input.language, input.intake].some(v => v !== "yes")) {
    return { title: "请先确认申请条件", detail: "对照下方官网要求，确认学历与先修课、语言条件，以及拟申请批次。" };
  }
  if (!input.grade.trim() || !/^\d+(\.\d+)?$/.test(input.grade.trim())) return { title: "请填写有效成绩", detail: "请输入成绩单上的数值，并选择对应分制。" };
  const grade = Number(input.grade);
  if (![100, 4, 5].includes(input.scale) || !Number.isFinite(grade) || grade <= 0 || grade > input.scale) return { title: "请检查成绩与分制", detail: "百分制、4 分制和 5 分制分别比较，不进行自动换算。" };
  const band = profile?.bands.find(b => b.group === input.group && b.scale === input.scale);
  if (!band) return { title: "需要结合完整背景判断", detail: "当前背景与分制的可用案例不足。请结合下方官网要求、专业经历和材料准备，由顾问进一步判断。" };
  const title = grade < band.low ? "可作为冲刺参考" : grade <= band.high ? "成绩处于参考区间" : "成绩较有余量";
  return { title, detail: `${band.basisLabel} · ${input.group}：${formatHkBand(band)}。这是成绩位置参考，录取还取决于专业匹配、材料与名额。`, band };
}
