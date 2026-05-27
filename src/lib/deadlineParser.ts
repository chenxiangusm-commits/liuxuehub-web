export interface TimelineItem {
  label: string;
  date: string;
  status: 'done' | 'upcoming' | 'pending';
}

export function parseDeadlineTimeline(deadline: string): TimelineItem[] {
  const result: TimelineItem[] = [];
  
  if (!deadline || typeof deadline !== 'string') {
    return getDefaultTimeline();
  }

  const trimmed = deadline.trim();
  
  // 检查是否为滚动录取或待确认
  if (trimmed.includes('滚动') || trimmed.includes('待确认') || trimmed.includes('官网') || trimmed.includes('另行通知')) {
    return getDefaultTimeline();
  }

  // 提取 Round 信息
  const roundPattern = /(Round\s*\d+|R\d+|轮次\s*\d+|第\s*\d+\s*轮)/gi;
  const rounds = trimmed.match(roundPattern) || [];
  
  // 提取日期
  const datePattern = /(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}\s+(?:月|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi;
  const dates = trimmed.match(datePattern) || [];

  // 添加开放申请
  result.push({
    label: '开放申请',
    date: '',
    status: 'done' as const
  });

  if (rounds.length > 0) {
    // 有明确轮次
    rounds.forEach((round, index) => {
      const cleanRound = round.replace(/\s+/g, '').replace('轮次', 'Round ').replace('第', '').replace('轮', '');
      const date = dates[index] || '';
      result.push({
        label: cleanRound,
        date: date,
        status: isPastDate(date) ? 'done' : 'upcoming' as const
      });
    });

    // 添加最终轮次
    if (!trimmed.includes('Final') && !trimmed.includes('final')) {
      const finalDate = dates[dates.length - 1] || '';
      result.push({
        label: 'Final',
        date: finalDate,
        status: isPastDate(finalDate) ? 'done' : 'pending' as const
      });
    }
  } else {
    // 没有明确轮次，尝试提取单个截止日期
    if (dates.length > 0 && dates[0]) {
      result.push({
        label: '截止日期',
        date: dates[0],
        status: isPastDate(dates[0]) ? 'done' : 'upcoming' as const
      });
    } else {
      return getDefaultTimeline();
    }
  }

  return result;
}

function getDefaultTimeline(): TimelineItem[] {
  return [
    { label: '开放申请', date: '', status: 'done' },
    { label: '递交材料', date: '', status: 'upcoming' },
    { label: '等待审核', date: '', status: 'pending' },
    { label: '官网确认截止日期', date: '', status: 'pending' }
  ];
}

function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  
  try {
    // 尝试解析日期
    let date: Date;
    
    if (dateStr.includes('/')) {
      // MM/DD/YYYY 或 DD/MM/YYYY
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // 假设格式为 YYYY/MM/DD 或 MM/DD/YYYY
        if (parseInt(parts[0]) > 2000) {
          date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
      } else {
        return false;
      }
    } else if (dateStr.includes('-')) {
      // YYYY-MM-DD
      date = new Date(dateStr);
    } else if (dateStr.includes('月')) {
      // 中文格式
      const monthMatch = dateStr.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[,日号]?\s*(\d{4})?/);
      if (monthMatch) {
        const year = monthMatch[3] ? parseInt(monthMatch[3]) : new Date().getFullYear();
        date = new Date(year, parseInt(monthMatch[1]) - 1, parseInt(monthMatch[2]));
      } else {
        return false;
      }
    } else {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    return date < today;
  } catch {
    return false;
  }
}

export function getProgramStatus(deadline: string, lastUpdated?: string): string {
  // 检查是否是新增项目（优先级最高）
  // 条件：last_updated 距离当前 < 120天
  if (lastUpdated) {
    const updateDate = new Date(lastUpdated);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 120) {
      return '新增项目';
    }
  }

  if (!deadline || typeof deadline !== 'string') {
    return '开放申请';
  }

  const trimmed = deadline.trim();

  // 检查特殊状态
  if (trimmed.includes('待确认') || trimmed.includes('官网') || trimmed.includes('滚动') || trimmed.includes('另行通知')) {
    return '开放申请';
  }

  // 尝试解析日期
  const datePattern = /(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}|\d{1,2}\s+(?:月|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/gi;
  const dates = trimmed.match(datePattern) || [];

  if (dates.length === 0 || !dates[0]) {
    return '开放申请';
  }

  const deadlineDate = parseDateString(dates[0]);
  if (!deadlineDate) {
    return '开放申请';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return '已截止';
  } else if (diffDays <= 14) {
    return '即将截止';
  } else {
    return '开放申请';
  }
}

function parseDateString(dateStr: string): Date | null {
  try {
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        if (parseInt(parts[0]) > 2000) {
          return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } else {
          return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
      }
    } else if (dateStr.includes('-')) {
      return new Date(dateStr);
    } else if (dateStr.includes('月')) {
      const monthMatch = dateStr.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[,日号]?\s*(\d{4})?/);
      if (monthMatch) {
        const year = monthMatch[3] ? parseInt(monthMatch[3]) : new Date().getFullYear();
        return new Date(year, parseInt(monthMatch[1]) - 1, parseInt(monthMatch[2]));
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case '开放申请':
      return 'bg-green-100 text-green-700';
    case '即将截止':
      return 'bg-orange-100 text-orange-700';
    case '已截止':
      return 'bg-gray-100 text-gray-500';
    case '新增项目':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}
