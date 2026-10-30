// Presentation only: preserve amounts, qualifications, currencies and years.
export function localizedUnits(value: unknown) {
  const text = typeof value === 'string' || typeof value === 'number' ? String(value) : '官网未明确';
  return text.replace(/\b(\d+(?:\.\d+)?)\s*years?\b/gi, '$1年')
    .replace(/\b(\d+(?:\.\d+)?)\s*months?\b/gi, '$1个月')
    .replace(/\s*\/\s*year\b|\s+per annum\b|\s+per year\b/gi, ' / 年');
}

export function languageFromRecords(ielts?:string,toefl?:string) {
  return [ielts ? (/IELTS|雅思/i.test(ielts) ? ielts : `雅思 ${ielts}`) : '', toefl ? (/TOEFL|托福/i.test(toefl) ? toefl : `托福 ${toefl}`) : ''].filter(Boolean).join('；');
}
