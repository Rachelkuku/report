import { DocFormState, WorkType } from '../types';
import { DOCUMENT_TYPE_LABELS, WORK_TYPE_LABELS } from '../data/workTypes';
import { calcApproval, calcAudit, formatAmount } from './calculations';
import { generateTitle } from './titleGenerator';

function v(val: string, label = '직접 입력'): string {
  return val?.trim() || label;
}


function getWorkTypeDetails(workType: WorkType | '', fields: Record<string, string>): string {
  if (!workType) return '';

  const lines: string[] = [];

  const add = (label: string, key: string, isNum = false) => {
    const val = fields[key];
    if (val?.trim()) {
      lines.push(`- ${label}: ${isNum ? formatAmount(val) + '원' : val}`);
    }
  };

  switch (workType) {
    case 'payment':
      add('완료일', 'completionDate');
      add('검수자', 'inspector');
      add('지급금액', 'paymentAmount', true);
      add('기존기안문서', 'originalDocRef');
      break;
    case 'lease_new':
      add('호실', 'roomNo');
      add('전용면적', 'exclusiveArea');
      add('계약면적', 'contractArea');
      add('업종/업태', 'businessType');
      add('보증금', 'deposit', true);
      add('월임대료', 'monthlyRent', true);
      add('월관리비', 'monthlyMgmt', true);
      add('렌트프리', 'rentFree');
      add('의무사용기간', 'minUsePeriod');
      add('중도해지통보기한', 'terminationNotice');
      add('제소전화해여부', 'pretrialSettlement');
      add('컨설팅사여부', 'consultingType');
      break;
    case 'lease_renewal':
      add('기존계약기간', 'prevContractPeriod');
      add('재계약기간', 'newContractPeriod');
      add('변경전 보증금', 'prevDeposit', true);
      add('변경전 임대료', 'prevRent', true);
      add('변경전 관리비', 'prevMgmt', true);
      add('변경후 보증금', 'newDeposit', true);
      add('변경후 임대료', 'newRent', true);
      add('변경후 관리비', 'newMgmt', true);
      add('인상률', 'increaseRate');
      add('렌트프리변경', 'rentFreeChange');
      break;
    case 'deposit_return':
      add('퇴거일', 'vacateDate');
      add('반환보증금', 'returnDeposit', true);
      add('미수금여부', 'unpaidExists');
      add('위약금여부', 'penaltyExists');
      add('원상복구여부', 'restorationDone');
      add('후속임차여부', 'nextTenant');
      break;
    case 'deposit_redeposit':
      add('기존호실', 'existingRoom');
      add('신규호실', 'newRoom');
      add('기존보증금', 'existingDeposit', true);
      add('신규보증금', 'newDepositAmount', true);
      add('차액납부여부', 'diffPaymentDone');
      add('재예치요청부서', 'requestDept');
      break;
    case 'construction':
      add('공사업체', 'constructionCompany');
      add('비교견적', 'comparativeQuote');
      add('공사범위', 'constructionScope');
      add('입주사영향', 'tenantImpact');
      break;
    case 'purchase':
      add('제품명', 'productName');
      add('수량', 'quantity');
      add('구입처', 'purchaseFrom');
      add('비교견적', 'comparativeQuote');
      add('구매사유', 'purchaseReason');
      break;
    case 'bid_contract':
      add('입찰방식', 'bidMethod');
      add('참가자격', 'bidQualification');
      add('계약기간', 'contractPeriod');
      add('과업범위', 'workScope');
      add('평가방법', 'evaluationMethod');
      add('추진일정', 'schedule');
      break;
    case 'legal_stamp':
      add('문서명', 'documentTitle');
      add('사용목적', 'usePurpose');
      add('사용처', 'useDestination');
      add('날인종류', 'stampType');
      add('수량', 'stampQuantity');
      add('법무검토여부', 'legalReview');
      break;
    case 'outgoing_letter':
      add('공문명', 'letterTitle');
      add('수신처', 'letterRecipient');
      add('발송사유', 'sendingReason');
      add('주요내용', 'letterContent');
      break;
    case 'free_use':
      add('임차인', 'lessee');
      add('전차인', 'sublessee');
      add('요청사유', 'requestReason');
      add('사용기간', 'usePeriod');
      add('사용면적', 'useArea');
      add('날인수량', 'stampCount');
      break;
    case 'business_trip':
      add('출장목적', 'tripPurpose');
      add('출장자', 'traveler');
      add('출장지', 'destination');
      add('출장기간', 'tripPeriod');
      add('주요내용', 'tripMainContent');
      add('교통비', 'transportCost', true);
      add('숙박비', 'accommodationCost', true);
      add('식비', 'mealCost', true);
      add('일비', 'dailyAllowance', true);
      break;
    case 'trip_report':
      add('출장일정', 'tripSchedule');
      add('출장자', 'traveler');
      add('주요활동', 'mainActivities');
      add('결과', 'result');
      add('향후계획', 'futureplan');
      break;
    case 'education':
      add('자격증명/교육명', 'educationTitle');
      add('교육기간', 'educationPeriod');
      add('교육기관', 'educationInstitution');
      add('교육세부내역', 'educationDetail');
      add('시험일정', 'examSchedule');
      add('총결제비용', 'totalCost', true);
      add('청구금액', 'claimAmount', true);
      break;
    case 'safety':
      add('점검종류', 'inspectionType');
      add('점검기관', 'inspectionAgency');
      add('점검범위', 'inspectionScope');
      add('법정주기', 'legalCycle');
      break;
    case 'energy_utility':
      add('서비스종류', 'serviceType');
      add('추가사유', 'addReason');
      add('예상비용', 'expectedCost', true);
      break;
    case 'general_request':
      add('요청대상부서', 'targetDept');
      add('요청사항', 'requestContent');
      break;
  }

  return lines.length > 0 ? lines.join('\n') : '(입력된 항목 없음)';
}

function getDocPurpose(workType: WorkType | ''): string {
  const purposeMap: Record<string, string> = {
    payment: '시행 완료 후 대금 지급',
    lease_new: '신규 임대차계약 체결 승인',
    lease_renewal: '임대차 재계약 체결 승인',
    deposit_return: '임대차계약 종료에 따른 보증금 반환·정산',
    deposit_redeposit: '기존 임대보증금 재예치 협조 요청',
    construction: '시설공사 또는 수선 시행 승인',
    purchase: '물품 구매 승인',
    bid_contract: '입찰·계약·용역 추진 승인',
    legal_stamp: '직인 또는 사용인감 날인 협조 요청',
    outgoing_letter: '발송공문 시행 승인',
    free_use: '무상사용대차 허가 협조 요청',
    business_trip: '국내출장 시행 승인',
    trip_report: '출장 결과 보고',
    education: '직무 교육비 지원 협조 요청',
    safety: '안전·소방·법정점검 시행 승인',
    energy_utility: '에너지·공과금·추가공조 관련 협조 또는 승인',
    general_request: '기타 업무 협조 요청',
  };
  return workType ? (purposeMap[workType] || '직접 입력') : '직접 입력';
}

export function generateDocPrompt(state: DocFormState): string {
  const { documentType, workType, base, agencyBudget, cooperation, workTypeFields } = state;

  const docLabel = DOCUMENT_TYPE_LABELS[documentType] || '기안문';
  const workLabel = workType ? (WORK_TYPE_LABELS[workType] || workType) : '직접 입력';
  const title = generateTitle(state);
  const approval = calcApproval(workType, base.amountVatExcluded);
  const audit = calcAudit(base.amountVatExcluded);

  const dailyAuditText = audit.dailyAudit ? '필요 (2,000만원 초과)' : '해당없음';
  const inspectorText = audit.inspectorRequired ? '필요 (3,000만원 이상)' : '해당없음';
  const contractTeamText = audit.contractTeam ? '의뢰 필요 (3,000만원 이상)' : '해당없음';
  const multipleQuoteText = audit.multipleQuotes ? '필요 (500만원 이상 3,000만원 미만)' : '해당없음';

  const amountVatExText = base.amountVatExcluded ? `${formatAmount(base.amountVatExcluded)}원 (부가세 별도)` : '직접 입력';
  const amountVatInText = base.amountVatIncluded ? `${formatAmount(base.amountVatIncluded)}원 (부가세 포함)` : '';
  const amountText = amountVatInText ? `${amountVatExText} / ${amountVatInText}` : amountVatExText;

  let agencyBudgetSection = '';
  if (documentType === 'agency_budget') {
    agencyBudgetSection = `
[대행예산 정보]
- 특별회계 등: ${v(agencyBudget.specialAccount)}
- 예산년도: ${v(agencyBudget.budgetYear)}
- 재원명: ${v(agencyBudget.fundName)}
- 계정명: ${v(agencyBudget.accountName)}
- 재원금액: ${agencyBudget.fundAmount ? formatAmount(agencyBudget.fundAmount) + '원' : '직접 입력'}
- 지출유형: ${v(agencyBudget.expenditureType)}
- 비용 산출근거: ${v(agencyBudget.costBasis)}`;
  }

  let cooperationSection = '';
  if (documentType === 'cooperation') {
    cooperationSection = `
[협조전 정보]
- 수신처: ${v(cooperation.recipient)}
- 참조: ${v(cooperation.reference)}
- 요청 후속 업무: ${v(cooperation.followUpWork)}
- 요청기한: ${v(cooperation.requestDeadline)}
- 날인종류: ${v(cooperation.sealType)}
- 날인/불출 수량: ${v(cooperation.sealQuantity)}`;
  }

  const workTypeDetails = getWorkTypeDetails(workType, workTypeFields);

  const prompt = `너는 WTC Seoul 오피스운영팀의 문서작성에 능숙한 실무자야.
아래 입력값을 기준으로 회사 전자결재용 ${docLabel} 초안을 작성해줘.

[문서 작성 목적]
- 문서종류: ${docLabel}
- 업무유형: ${workLabel}
- 작성 목적: ${getDocPurpose(workType)}
${agencyBudgetSection}${cooperationSection}

[입력값]
- 건물명: ${v(base.buildingName)}
- 위치/호실: ${v(base.location)}
- 입주사/업체명: ${v(base.tenantName)}
- 업무명: ${v(base.workName)}
- 금액: ${amountText}
- 기간: ${v(base.period)}
- 관련문서: ${v(base.relatedDocs)}
- 시행/요청 사유: ${v(base.reason)}
- 주요내용: ${v(base.mainContent)}
- 특이사항: ${v(base.specialNotes, '없음')}

[업무유형별 상세]
${workTypeDetails}

[작성 기준]
1. 제목은 아래 추천 제목 패턴을 참고해 회사 기안문 스타일로 작성한다.
2. 첫 문장은 "○○을 다음과 같이 ○○하고자 합니다." 형식으로 작성한다.
3. 본문은 "- 다 음 -" 또는 "- 아 래 -" 아래에 정리한다.
4. 항목 번호는 1. → 가. → (1) → (가) → ① 순서를 지킨다.
5. 금액은 천단위 콤마와 단위를 붙이고, 부가세 별도/포함 여부를 명확히 표시한다.
6. 표가 필요한 경우 표로 정리한다.
7. 입력되지 않은 사실은 임의로 만들지 말고 "직접 입력"으로 표시한다.
8. 마지막에는 추천 첨부파일 목록을 포함한다.
9. 첨부가 있는 경우 "(첨부) 1. ○○ - 1부. 끝." 형식으로 마무리한다.
10. 결재선, 문서보안, 보존년한은 추천값으로만 표시하고 최종 확인 필요 문구를 넣는다.
11. 원본 자료의 사실관계는 임의로 변경하지 말 것.
12. 일자 표시는 "서기" 및 "년, 월, 일" 문자를 생략하고 "."으로 구분한다. (예: 2026.05.14)
13. 숫자는 아라비아 숫자를 원칙으로 하되, 금액 등 중요한 경우 한글을 병기할 수 있다. (예: 금 1,500,000원(일백오십만원))
14. 협조전 작성 시 수신·경유·참조를 명확히 기재하고, 팀간 의견교환 또는 업무협조 목적임을 제목에 반영한다.

[추가 검토사항]
- 일상감사 필요 여부: ${dailyAuditText}
- 검사역 입회 필요 여부: ${inspectorText}
- 복수견적(3개 이상) 필요 여부: ${multipleQuoteText}
- 계약담당팀 시행 의뢰 필요 여부: ${contractTeamText}

[추천 제목]
${title}

[추천 결재선]
${approval.level}
※ ${approval.basis}
※ 최종 결재선은 최신 위임전결요령 및 담당부서 확인 필요

[결과물]
1. 추천 제목
2. 본문 초안
3. 표 정리
4. 추천 첨부파일
5. 결재 전 확인사항

[결재 전 확인사항]
1. 금액이 부가세 별도/포함 중 무엇인지 확인.
2. 결재선이 업무유형과 금액 기준에 맞는지 확인.
3. 관련문서가 누락되지 않았는지 확인.
4. 첨부파일이 업무유형에 맞게 들어갔는지 확인.
5. 본문 끝/첨부 끝 표시가 맞는지 확인.
6. 임의로 만든 사실이나 금액이 없는지 확인.

[첨부파일 추천]
아래 입력값과 문서종류, 업무유형을 기준으로 이 문서에 붙이면 좋은 첨부파일을 추천해줘.
추천 첨부파일은 표로 정리하고, 필수/권장/조건부를 구분해줘.
각 첨부파일마다 추천 사유와 누락 시 검토 리스크를 함께 적어줘.
사용자가 이미 보유한 첨부파일: ${v(base.ownedAttachments, '없음')}
추가로 확인해야 할 첨부파일을 나눠줘.
규정상 원본 별도 보관이 필요한 계약서, 소송문서, 인허가 문서, 확정일자/내용증명 문서는 별도 보관 필요 항목으로 표시해줘.`;

  return prompt;
}
