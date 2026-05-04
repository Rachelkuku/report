import { WorkType, ApprovalResult, AuditResult, RetentionResult } from '../types';

export function calcApproval(
  workType: WorkType | '',
  amountVatExcluded: number
): ApprovalResult {
  // 임대차 특별 기준
  if (workType === 'lease_new' || workType === 'lease_renewal') {
    return {
      level: '본부장(실장) / 임원 / 대표이사 (면적 및 조건에 따라 상이)',
      basis: '임대차 결재권한은 면적, 보증금, 월임대료 합산 기준 적용. 최신 위임전결요령 확인 필요.',
    };
  }
  if (workType === 'deposit_return') {
    return {
      level: '팀장 (임대정책 범위 내) 또는 대표이사',
      basis: '반환 보증금 규모 및 위약금 여부에 따라 상이. 최신 위임전결요령 확인 필요.',
    };
  }
  if (workType === 'bid_contract') {
    return {
      level: '입찰 금액 기준 적용 (별도 규정 참조)',
      basis: '입찰·용역 계약 결재선은 금액 및 계약 방식에 따라 별도 기준 적용. 담당부서 확인 필요.',
    };
  }
  if (workType === 'business_trip') {
    return {
      level: '팀원→팀장 / 팀장→본부장 / 실장 이상→대표이사',
      basis: '출장자 직급 기준 결재선 적용. 최신 위임전결요령 확인 필요.',
    };
  }

  // 일반예산 금액 기준
  if (!amountVatExcluded || amountVatExcluded < 10_000_000) {
    return {
      level: '팀장',
      basis: '금액 1,000만원 미만 → 팀장 전결 (일반예산 기준)',
    };
  } else if (amountVatExcluded < 50_000_000) {
    return {
      level: '본부장(실장)',
      basis: '금액 1,000만원 이상 5,000만원 미만 → 본부장(실장) 결재 (일반예산 기준)',
    };
  } else if (amountVatExcluded < 100_000_000) {
    return {
      level: '임원',
      basis: '금액 5,000만원 이상 1억원 미만 → 임원 결재 (일반예산 기준)',
    };
  } else {
    return {
      level: '대표이사',
      basis: '금액 1억원 이상 → 대표이사 결재 (일반예산 기준)',
    };
  }
}

export function calcAudit(amountVatExcluded: number): AuditResult {
  return {
    dailyAudit: amountVatExcluded > 20_000_000,
    inspectorRequired: amountVatExcluded >= 30_000_000,
    multipleQuotes: amountVatExcluded >= 5_000_000 && amountVatExcluded < 30_000_000,
    contractTeam: amountVatExcluded >= 30_000_000,
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
  const tenYear: Array<WorkType | ''> = [
    'lease_new', 'free_use',
  ];

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
