export interface LanguageScore {
  overall: string | null;
  listening: string | null;
  speaking: string | null;
  reading: string | null;
  writing: string | null;
  raw: string;
}

export function parseIELTS(text: string): LanguageScore {
  const result: LanguageScore = {
    overall: null,
    listening: null,
    speaking: null,
    reading: null,
    writing: null,
    raw: text || ''
  };

  if (!text || typeof text !== 'string') {
    return result;
  }

  const trimmed = text.trim();
  
  // 提取总分
  const overallMatch = trimmed.match(/(?:总分)?\s*(\d+(?:\.\d+)?)\s*(?:分)?\s*(?:overall|总分)?/i);
  if (overallMatch) {
    result.overall = overallMatch[1];
  }

  // 尝试从格式如 "IELTS 7.0 (6.5)" 提取
  const bracketMatch = trimmed.match(/IELTS\s*(\d+\.?\d*)\s*\((\d+\.?\d*)\)/i);
  if (bracketMatch) {
    result.overall = bracketMatch[1];
    // 单项最低分
    const minScore = bracketMatch[2];
    result.listening = minScore;
    result.speaking = minScore;
    result.reading = minScore;
    result.writing = minScore;
  }

  // 提取单项分数
  const listeningMatch = trimmed.match(/(?:听|听力|listening)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
  if (listeningMatch) {
    result.listening = listeningMatch[1];
  }

  const speakingMatch = trimmed.match(/(?:说|口语|speaking)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
  if (speakingMatch) {
    result.speaking = speakingMatch[1];
  }

  const readingMatch = trimmed.match(/(?:读|阅读|reading)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
  if (readingMatch) {
    result.reading = readingMatch[1];
  }

  const writingMatch = trimmed.match(/(?:写|写作|writing)\s*[:：]?\s*(\d+(?:\.\d+)?)/i);
  if (writingMatch) {
    result.writing = writingMatch[1];
  }

  // 尝试提取单项不低于分数
  const singleMinMatch = trimmed.match(/单项\s*不低于\s*(\d+(?:\.\d+)?)/i);
  if (singleMinMatch && !result.listening) {
    result.listening = singleMinMatch[1];
    result.speaking = singleMinMatch[1];
    result.reading = singleMinMatch[1];
    result.writing = singleMinMatch[1];
  }

  // 尝试提取写作单项要求
  const writingMinMatch = trimmed.match(/写作\s*不低于\s*(\d+(?:\.\d+)?)/i);
  if (writingMinMatch) {
    result.writing = writingMinMatch[1];
  }

  return result;
}

export function parseTOEFL(text: string): LanguageScore {
  const result: LanguageScore = {
    overall: null,
    listening: null,
    speaking: null,
    reading: null,
    writing: null,
    raw: text || ''
  };

  if (!text || typeof text !== 'string') {
    return result;
  }

  const trimmed = text.trim();
  
  // 提取总分
  const overallMatch = trimmed.match(/TOEFL\s*(\d+)\s*(?:分)?/i);
  if (overallMatch) {
    result.overall = overallMatch[1];
  }

  // 中文格式总分
  const chineseOverallMatch = trimmed.match(/(?:总分)?\s*(\d+)\s*(?:分)?/i);
  if (chineseOverallMatch && !result.overall) {
    result.overall = chineseOverallMatch[1];
  }

  // 提取单项分数
  const listeningMatch = trimmed.match(/(?:听|听力|listening)\s*[:：]?\s*(\d+)/i);
  if (listeningMatch) {
    result.listening = listeningMatch[1];
  }

  const speakingMatch = trimmed.match(/(?:说|口语|speaking)\s*[:：]?\s*(\d+)/i);
  if (speakingMatch) {
    result.speaking = speakingMatch[1];
  }

  const readingMatch = trimmed.match(/(?:读|阅读|reading)\s*[:：]?\s*(\d+)/i);
  if (readingMatch) {
    result.reading = readingMatch[1];
  }

  const writingMatch = trimmed.match(/(?:写|写作|writing)\s*[:：]?\s*(\d+)/i);
  if (writingMatch) {
    result.writing = writingMatch[1];
  }

  return result;
}
