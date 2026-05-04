import { DocFormState } from '../types';

function v(val: string, fallback = '직접 입력'): string {
  return val?.trim() || fallback;
}

export function generateTitle(state: DocFormState): string {
  const { workType, base, workTypeFields } = state;
  const b = base;

  switch (workType) {
    case 'payment':
      return `[완료조서 및 대금지급] ${v(b.buildingName)} ${v(b.location)} ${v(b.workName)} 대금 지급의 건`;
    case 'lease_new':
      return `${v(b.buildingName)} ${v(b.location)} 신규 임대차계약 체결의 건(${v(b.tenantName)})`;
    case 'lease_renewal':
      return `(재계약) ${v(b.buildingName)} ${v(b.tenantName)}(${v(b.location)}) 재계약 체결의 건`;
    case 'deposit_return':
      return `${v(b.buildingName)} 임대차계약 종료에 따른 임대보증금 반환의 건(${v(b.location)} ${v(b.tenantName)})`;
    case 'deposit_redeposit': {
      const newRoom = v(workTypeFields['newRoom'] || '', '직접 입력');
      return `${v(b.buildingName)} ${newRoom} 이전에 따른 기존 임대보증금 재예치 요청의 건(${v(b.tenantName)})`;
    }
    case 'construction':
      return `${v(b.buildingName)} ${v(b.location)} ${v(b.workName)} 시행의 건`;
    case 'purchase':
      return `${v(b.buildingName)} ${v(b.workName)} 구매의 건`;
    case 'bid_contract':
      return `${v(b.buildingName)} ${v(b.workName)} 입찰 추진(안)`;
    case 'legal_stamp': {
      const stampType = workTypeFields['stampType'] || '사용인감';
      return `[${stampType}] ${v(b.buildingName)} ${v(b.location)} ${v(b.workName)}의 건`;
    }
    case 'outgoing_letter':
      return `(발송공문)${v(b.workName)}`;
    case 'free_use':
      return `[직인] ${v(b.buildingName)} ${v(b.location)} ${v(b.tenantName)} 무상사용 승인의 건`;
    case 'business_trip': {
      const dest = v(workTypeFields['destination'] || '', '직접 입력');
      const purpose = v(workTypeFields['tripPurpose'] || '', '직접 입력');
      return `${dest} ${purpose} 국내출장 시행(안)`;
    }
    case 'trip_report': {
      const dest = v(workTypeFields['destination'] || workTypeFields['tripSchedule'] || '', '직접 입력');
      const purpose = v(workTypeFields['tripPurpose'] || b.workName || '', '직접 입력');
      return `${dest} ${purpose} 국내출장 결과 보고`;
    }
    case 'education': {
      const eduTitle = v(workTypeFields['educationTitle'] || '', '직접 입력');
      const certName = v(workTypeFields['educationTitle'] || '', '직접 입력');
      return `직무관련 ${eduTitle} 교육비 신청의 건(${certName})`;
    }
    case 'safety': {
      const inspType = v(workTypeFields['inspectionType'] || '', '직접 입력');
      return `${v(b.buildingName)} ${inspType} 시행의 건`;
    }
    case 'energy_utility': {
      const serviceType = v(workTypeFields['serviceType'] || '', '직접 입력');
      return `${v(b.buildingName)} ${serviceType} 추진의 건`;
    }
    case 'general_request':
      return `${v(b.workName)}의 건`;
    default:
      return v(b.workName) ? `${v(b.workName)}의 건` : '(제목을 생성하려면 업무유형과 기본정보를 입력하세요)';
  }
}
