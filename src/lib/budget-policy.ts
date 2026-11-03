const CURRENCIES=new Set(['HKD','MOP','GBP','AUD','SGD','NZD','USD','CNY','RMB']);
export function budgetIssue(params:URLSearchParams):string{
 const max=params.get('maxFee')||'',rmb=params.get('rmbMax')||'',rate=params.get('fxRate')||'',currency=params.get('currency')||'';
 if([max,rmb,rate].some(v=>v!==''&&(!Number.isFinite(Number(v))||Number(v)<0)))return '预算和汇率请填写有效的正数。';
 if((Number(max)>0||Number(rmb)>0)&&!CURRENCIES.has(currency))return '请先选择学费币种，预算筛选才会生效。';
 if(Number(rmb)>0&&(!rate||Number(rate)<=0||Number(rate)>1000))return '请填写有效换算汇率（1原币对应的人民币金额），人民币预算才会生效。';
 if((Number(max)>0||Number(rmb)>0)&&!['total','annual'].includes(params.get('basis')||'total'))return '请选择全课程或每年收费口径。';
 return '';
}
