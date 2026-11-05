export const explorerDefaults = {
  q: '', region: '', school: '', level: 'postgraduate', year: '', status: 'published',
  duration: '', currency: '', basis: 'total', maxFee: '', rmbMax: '', fxRate: '', subject: '',
  rankMax: '', ieltsMax: '', background: '', sort: 'ready', page: '1',
};

export function explorerFilters(input: Record<string, unknown>, matching = false) {
  const filters = { ...explorerDefaults, status: matching ? 'current' : explorerDefaults.status };
  for (const key of Object.keys(filters) as (keyof typeof filters)[]) {
    const value = input[key];
    if (typeof value === 'string' && value.trim()) filters[key] = value;
  }
  return filters;
}

export function explorerQuery(filters: typeof explorerDefaults) {
  return new URLSearchParams(Object.entries(filters).filter(([,value]) => value !== ''));
}

