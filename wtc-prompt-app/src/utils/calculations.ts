import { WorkType, ApprovalResult, AuditResult, RetentionResult } from '../types';

export function parseAmount(val: string): number {
  if (!val) return 0;
  return parseFloat(val.replace(/,/g, '')) || 0;
}

export function formatAmount(val: string | number): string {
  const num = typeof val === 'string' ? parseAmount(val) : val;
  if (!num) return '0';
  return num.toLocaleString('ko-KR');
}

export function calcApproval(
  workType: WorkType | '',
  amountStr: string
): ApprovalResult {
  const amount = parseAmount(amountStr);

  if (workType === 'lease_new' || workType === 'lease_renewal') {
    return {
      level: '본부장(실장) / 팀장 (정책 범위 내) 또는 대표이사 (정책 외)',
      basis: '정해진 임대정책 범위 내 (면적에 따라 실장/팀장 전결), 임대정책 범위 외 대표이사 결재',
    };
  }
  
  if (workType === 'deposit_return') {
    return {
      level: '팀장 (정책 범위 내) 또는 대표이사 (정책 외)',
      basis: '정해진 임대정책 범위 내 보증금 정산은 팀장 전결, 범위 외는 대표이사 결재',
    };
  }
  
  if (workType === 'bid_contract') {
    return {
      level: '대표이사 (기본방침/1억이상 예가) / 임원 (1억미만 예가)',
      basis: '기본방침 결정 및 1억원 이상 예가결정은 대표이사, 1억원 미만 예가결정은 임원 전결',
    };
  }
  
  if (workType === 'business_trip') {
    return {
      level: '팀장(팀원) / 본부장(팀장) / 대표이사(실장 이상)',
      basis: '국내출장 기준. 국외출장의 경우 팀장 이하는 임원 결재',
    };
  }

  if (workType === 'education') {
    return {
      level: '임원 (대외교육/전사교육) / 본부장 (실단위) / 팀장 (팀단위)',
      basis: '대외교육 참가 및 대내 전직원 교육은 임원 전결, 실/팀 단위 교육은 해당 장 전결',
    };
  }

  if (workType === 'outgoing_letter') {
    return {
      level: '대표이사 (특히 중요) / 임원 (주요사항) / 팀장 (일반사항)',
      basis: '대외 발송 공문의 중요도에 따라 전결선 적용',
    };
  }

  if (workType === 'legal_stamp') {
    return {
      level: '팀장',
      basis: '법인인감 보관 및 날인 사항은 팀장 전결',
    };
  }

  // 기본 예산 지출 (payment, construction, purchase, general_request 등)
  if (amount < 10_000_000) {
    return {
      level: '팀장',
      basis: '일반예산 지출 1,000만원 미만 → 팀장 전결',
    };
  } else if (amount < 50_000_000) {
    return {
      level: '본부장(실장)',
      basis: '일반예산 지출 1,000만원 이상 5,000만원 미만 → 본부장(실장) 결재',
    };
  } else if (amount < 100_000_000) {
    return {
      level: '임원',
      basis: '일반예산 지출 5,000만원 이상 1억원 미만 → 임원 결재',
    };
  } else {
    return {
      level: '대표이사',
      basis: '일반예산 지출 1억원 이상 → 대표이사 결재',
    };
  }
}

export function calcAudit(amountStr: string): AuditResult {
  const amount = parseAmount(amountStr);
  return {
    dailyAudit: amount > 20_000_000,
    inspectorRequired: amount >= 30_000_000,
    multipleQuotes: amount >= 5_000_000 && amount < 30_000_000,
    contractTeam: amount >= 30_000_000,
  };
}

export function calcRetention(workType: WorkType | ''): RetentionResult {
  const oneYear: Array<WorkType | ''> = [
    'legal_stamp', 'education', 'deposit_redeposit', 'general_request', 'energy_utility',
  ];
  const threeYear: Array<WorkType | ''> = [
    'payment', 'construction', 'deposit_return', 'outgoing_letter', 'safety', 'trip_report',
  ];
  const fiveYear: Array<WorkType | ''> = [
    'purchase', 'bid_contract', 'business_trip', 'lease_renewal',
  ];
  const tenYear: Array<WorkType | ''> = ['lease_new', 'free_use'];

  const sensitiveTypes: Array<WorkType | ''> = [
    'lease_new', 'lease_renewal', 'deposit_return', 'deposit_redeposit', 'free_use', 'legal_stamp',
  ];

  let years = 3;
  if (oneYear.includes(workType)) years = 1;
  else if (threeYear.includes(workType)) years = 3;
  else if (fiveYear.includes(workType)) years = 5;
  else if (tenYear.includes(workType)) years = 10;

  const security = sensitiveTypes.includes(workType)
    ? '결재선 또는 해당팀 (대외비 검토 필요)'
    : '해당팀';

  return { years, security };
}
