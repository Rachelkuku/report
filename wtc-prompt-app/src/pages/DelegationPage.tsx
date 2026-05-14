import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Level = '담당' | '팀장' | '본부장(실장)' | '임원' | '대표이사';

interface Item {
  id: string;
  matter: string;
  level: Level;
}

interface Category {
  label: string;
  color: string;
  items: Item[];
}

const LEVEL_COLOR: Record<Level, string> = {
  '담당':        'bg-gray-100 text-gray-600',
  '팀장':        'bg-blue-100 text-blue-700',
  '본부장(실장)': 'bg-teal-100 text-teal-700',
  '임원':        'bg-orange-100 text-orange-700',
  '대표이사':    'bg-red-100 text-red-700',
};

const CATEGORIES: Category[] = [
  {
    label: '공통사항',
    color: 'primary',
    items: [
      { id: '001', matter: '팀별 사업계획 수립 — 기본계획', level: '임원' },
      { id: '001', matter: '팀별 사업계획 수립 — 세부계획', level: '본부장(실장)' },
      { id: '001', matter: '팀별 세부사업계획 평가·변경', level: '본부장(실장)' },
      { id: '002', matter: '팀별 기본예산편성 / 수지전망', level: '본부장(실장)' },
      { id: '002', matter: '예산 항간전용', level: '임원' },
      { id: '002', matter: '예산 목간전용', level: '본부장(실장)' },
      { id: '003', matter: '대정부건의 및 인·허가 — 주요사항', level: '대표이사' },
      { id: '003', matter: '대정부건의 및 인·허가 — 일반사항', level: '임원' },
      { id: '004', matter: '대외회신·통지 — 특히 중요한 사항', level: '대표이사' },
      { id: '004', matter: '대외회신·통지 — 주요사항', level: '임원' },
      { id: '004', matter: '대외회신·통지 — 일반사항', level: '본부장(실장)' },
      { id: '004', matter: '대외회신·통지 — 경미한 사항(작업지시 등)', level: '팀장' },
      { id: '005', matter: '이사회 등 특히 중요한 회의 — 계획 및 결과보고', level: '대표이사' },
      { id: '005', matter: '이사회 등 특히 중요한 회의 — 주요계획 집행', level: '임원' },
      { id: '005', matter: '이사회 안건 의뢰 포함 기타사항', level: '임원' },
      { id: '005', matter: '주요회의 및 행사 — 계획·결과보고 / 집행', level: '본부장(실장)' },
      { id: '005', matter: '일반실무회의 — 계획·결과보고', level: '본부장(실장)' },
      { id: '005', matter: '일반실무회의 — 기타 / 팀간 업무협의', level: '팀장' },
      { id: '006', matter: '외부회의·행사 — 실장·임원 참가', level: '임원' },
      { id: '006', matter: '외부회의·행사 — 팀장 참가', level: '본부장(실장)' },
      { id: '006', matter: '외부회의·행사 — 팀장 미만 참가', level: '팀장' },
      { id: '007', matter: '문서관리', level: '담당' },
      { id: '008', matter: '팀업무처리 지침 제정·개폐 / 업무분장', level: '팀장' },
      { id: '009', matter: '국외출장 — 실장 이상', level: '대표이사' },
      { id: '009', matter: '국외출장 — 팀장 이하', level: '임원' },
      { id: '009', matter: '국내출장 — 실장 이상', level: '임원' },
      { id: '009', matter: '국내출장 — 팀장', level: '본부장(실장)' },
      { id: '009', matter: '국내출장 — 팀원', level: '팀장' },
      { id: '010', matter: '간행물 신규 발간계획', level: '임원' },
      { id: '010', matter: '간행물 계속 발간 / 주요집행', level: '본부장(실장)' },
      { id: '010', matter: '간행물 일반집행 / 배포', level: '팀장' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 1억원 이상', level: '대표이사' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 5천만~1억원', level: '임원' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 1천만~5천만원', level: '본부장(실장)' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 1천만원 미만', level: '팀장' },
      { id: '011', matter: '제부담금 기본품의 — 1천만원 이상', level: '대표이사' },
      { id: '011', matter: '제부담금 기본품의 — 500만~1천만원', level: '임원' },
      { id: '011', matter: '제부담금 기본품의 — 100만~500만원', level: '본부장(실장)' },
      { id: '011', matter: '제부담금 기본품의 — 100만원 미만', level: '팀장' },
      { id: '011', matter: '지출결의(전표) — 1억원 이상', level: '대표이사' },
      { id: '011', matter: '지출결의(전표) — 5천만~1억원', level: '임원' },
      { id: '011', matter: '지출결의(전표) — 1천만~5천만원', level: '본부장(실장)' },
      { id: '011', matter: '지출결의(전표) — 1천만원 미만', level: '팀장' },
      { id: '011', matter: '공공요금 계산납부', level: '팀장' },
      { id: '012', matter: '가지급 — 1천만원 이상', level: '임원' },
      { id: '012', matter: '가지급 — 500만~1천만원', level: '본부장(실장)' },
      { id: '012', matter: '가지급 — 500만원 미만', level: '팀장' },
      { id: '013', matter: '입찰 기본방침 결정', level: '대표이사' },
      { id: '013', matter: '입찰품의 (기본품의 첨부 시)', level: '임원' },
      { id: '013', matter: '예가결정·입찰결과보고 — 1억원 이상', level: '임원' },
      { id: '013', matter: '예가결정·입찰결과보고 — 1억원 미만', level: '본부장(실장)' },
      { id: '014', matter: '소송 방침결정·결과보고 — 주요사항', level: '대표이사' },
      { id: '014', matter: '소송 방침결정·결과보고 — 일반사항', level: '임원' },
      { id: '014', matter: '소송 실무집행 — 주요사항', level: '임원' },
      { id: '014', matter: '소송 실무집행 — 일반사항', level: '본부장(실장)' },
      { id: '014', matter: '명도소송', level: '대표이사' },
      { id: '015', matter: '제반사고 처리방침·결과보고', level: '임원' },
      { id: '015', matter: '제반사고 실무집행 — 주요사항', level: '본부장(실장)' },
      { id: '015', matter: '제반사고 실무집행 — 일반사항', level: '팀장' },
      { id: '016', matter: '대외교육 참가 및 결과보고', level: '팀장' },
      { id: '016', matter: '대내교육 — 전직원 / 실단위', level: '본부장(실장)' },
      { id: '016', matter: '대내교육 — 팀단위', level: '팀장' },
      { id: '017', matter: '휴가·결근·조퇴 청원계 — 실장', level: '임원' },
      { id: '017', matter: '휴가·결근·조퇴 청원계 — 팀장', level: '본부장(실장)' },
      { id: '017', matter: '휴가·결근·조퇴 청원계 — 팀원 / 특근신청', level: '팀장' },
      { id: '018', matter: '제증명 발급', level: '팀장' },
      { id: '018', matter: '소모품·업무연락·통신·집기 관리', level: '담당' },
      { id: '019', matter: '자문·용역 계약체결', level: '임원' },
      { id: '019', matter: '자문·용역 운용관리', level: '본부장(실장)' },
      { id: '019', matter: '일시소요인원 계약·운용', level: '팀장' },
    ],
  },
  {
    label: '오피스 임대관리',
    color: 'blue',
    items: [
      { id: '020', matter: '오피스 임대정책 수립 (인상률·할인율·렌트프리 등)', level: '임원' },
      { id: '021', matter: '임차인 선정·계약 체결 — 임대정책 범위 내, 600평 이상', level: '임원' },
      { id: '021', matter: '임차인 선정·계약 체결 — 임대정책 범위 내, 600평 미만', level: '본부장(실장)' },
      { id: '021', matter: '임차인 선정·계약 체결 — 임대정책 범위 외', level: '대표이사' },
      { id: '021', matter: '계약 해지·보증금 정산 — 임대정책 범위 내', level: '본부장(실장)' },
      { id: '021', matter: '계약 해지·보증금 정산 — 임대정책 범위 외', level: '대표이사' },
      { id: '022', matter: '미수 명도소송', level: '대표이사' },
      { id: '022', matter: '미수금 독촉 공문 발송', level: '팀장' },
      { id: '022', matter: '임관리비 고지 및 수입 정산', level: '팀장' },
    ],
  },
  {
    label: '대행임대자산 관리',
    color: 'purple',
    items: [
      { id: '030', matter: '계약 체결 및 변경', level: '임원' },
      { id: '030', matter: '임대료 인상율 결정', level: '임원' },
      { id: '030', matter: '임차인 유치조건 조정', level: '임원' },
      { id: '030', matter: '일상 계약관리', level: '팀장' },
      { id: '031', matter: '소송 등 주요사항', level: '대표이사' },
      { id: '031', matter: '마케팅 주요사항', level: '임원' },
      { id: '031', matter: '일반 사항', level: '본부장(실장)' },
      { id: '032', matter: '대행창고 계약 체결·변경', level: '임원' },
      { id: '032', matter: '대행창고 임대료 인상율 결정', level: '임원' },
      { id: '032', matter: '대행창고 일상 계약관리', level: '팀장' },
      { id: '033', matter: '직영창고 계약 체결·변경', level: '임원' },
      { id: '033', matter: '직영창고 계약·고지·채권관리', level: '본부장(실장)' },
      { id: '033', matter: '직영창고 일반 운영 / 자가사용창고', level: '팀장' },
      { id: '034', matter: '부대시설 계약 체결·변경', level: '임원' },
      { id: '034', matter: '부대시설 계약·고지·채권관리', level: '본부장(실장)' },
      { id: '034', matter: '부대시설 일반 운영', level: '팀장' },
    ],
  },
  {
    label: '마스터리스·직영자산',
    color: 'indigo',
    items: [
      { id: '041', matter: '임차인 선정 및 계약', level: '임원' },
      { id: '041', matter: '재계약 체결 및 임대료 조정', level: '임원' },
      { id: '041', matter: '임관리비 부과', level: '팀장' },
      { id: '041', matter: '임관리비·보증금 조정', level: '본부장(실장)' },
      { id: '041', matter: '보증금 환불', level: '임원' },
      { id: '041', matter: '계약 이행관리 — 주요사항', level: '임원' },
      { id: '041', matter: '계약 이행관리 — 일반사항', level: '팀장' },
      { id: '041', matter: '계약해지 및 정산', level: '임원' },
      { id: '041', matter: '공용공간·시설관리 — 주요사항', level: '본부장(실장)' },
      { id: '041', matter: '공용공간·시설관리 — 일반사항', level: '팀장' },
      { id: '042', matter: '대내외 교신·유관기관 협조 — 주요사항', level: '임원' },
      { id: '042', matter: '대내외 교신·유관기관 협조 — 일반사항', level: '팀장' },
    ],
  },
  {
    label: '시설운영',
    color: 'emerald',
    items: [
      { id: '051', matter: '설비운영관리 계획 수립 / 운영관리 / 이상조치', level: '팀장' },
      { id: '052', matter: '협력업체 — 주요계약', level: '본부장(실장)' },
      { id: '052', matter: '협력업체 — 일반계약 / 운영관리', level: '팀장' },
      { id: '053', matter: '민원접수 / 처리 / 사후관리', level: '팀장' },
      { id: '054', matter: '행사접수 / 기술지원 / 운영관리 / 정산', level: '팀장' },
      { id: '055', matter: '재해관리 계획·교육·점검·분석', level: '팀장' },
      { id: '056', matter: 'BeMS 시설관리·에너지·관리비·공사용역', level: '팀장' },
      { id: '057', matter: '통신 — 주요사항', level: '본부장(실장)' },
      { id: '057', matter: '통신 — 일반사항 / 행사지원 / 시설변경', level: '팀장' },
      { id: '058', matter: '그린경영(친환경) — 주요사항', level: '본부장(실장)' },
      { id: '058', matter: '그린경영(친환경) — 일반사항', level: '팀장' },
    ],
  },
  {
    label: '기술지원',
    color: 'cyan',
    items: [
      { id: '061', matter: '공사 관리·준공·사후관리', level: '팀장' },
      { id: '062', matter: '자재 구매검토·검수·입출고·창고·재고·불용품', level: '팀장' },
      { id: '063', matter: '운영예산 — 관리비 예산 수립·정산', level: '본부장(실장)' },
      { id: '063', matter: '운영예산 — 에너지 관리·탄소배출권', level: '팀장' },
      { id: '064', matter: '조경 관리계획·작업·점검·평가', level: '팀장' },
      { id: '065', matter: '설비운영관리 계획 수립 / 운영관리', level: '팀장' },
      { id: '066', matter: '협력업체 — 주요계약', level: '본부장(실장)' },
      { id: '066', matter: '협력업체 — 일반계약 / 운영', level: '팀장' },
      { id: '067', matter: '행사접수·기술지원·운영관리·정산', level: '팀장' },
      { id: '068', matter: '재해관리 계획·교육·점검·분석', level: '팀장' },
      { id: '069', matter: 'Signage/안내물 설치승인·사용점검·운영평가', level: '팀장' },
    ],
  },
  {
    label: '센터관리',
    color: 'sky',
    items: [
      { id: '070', matter: '미화관리 계획·작업·점검·평가', level: '팀장' },
      { id: '071', matter: '주차장 운영점검 — 주요사항', level: '본부장(실장)' },
      { id: '071', matter: '주차장 매출확인·임대료 정산·용역비 지급', level: '팀장' },
    ],
  },
  {
    label: '안전관리',
    color: 'red',
    items: [
      { id: '081', matter: '안전관리 계획 수립 / 협력업체 선정', level: '본부장(실장)' },
      { id: '081', matter: '안전관리 운영관리 / 용역비 지급', level: '팀장' },
      { id: '082', matter: '비상사태 접수·확인 / 비상대책반 구성 / 결과확인', level: '팀장' },
      { id: '083', matter: '키관리 (마스터키·일반키·입주사 설치키)', level: '팀장' },
      { id: '084', matter: '만국기 관리 계획·제작·운영', level: '팀장' },
      { id: '085', matter: '민방위 훈련지침·실시·결과보고', level: '팀장' },
      { id: '086', matter: '안내운영 협력업체 선정 / 운영 / 용역비', level: '팀장' },
    ],
  },
  {
    label: '경영기획·회계',
    color: 'violet',
    items: [
      { id: '091', matter: '주주총회·이사회 의안결정·소집', level: '대표이사' },
      { id: '091', matter: '주주총회·이사회 의사록·결의공증·등기', level: '임원' },
      { id: '092', matter: '성과평가 계획·시행 / 결과확정', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 편성지침', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 확정', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 변경 — 주요사항', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 변경 — 기타사항 / 추경·예비비', level: '임원' },
      { id: '094', matter: '제규정 관리 — 정관·규정·요령 제·개정 승인', level: '대표이사' },
      { id: '094', matter: '제규정 관리 — 세칙 / 매뉴얼', level: '임원' },
      { id: '095', matter: '품질 평가계획·실시·결과보고', level: '본부장(실장)' },
      { id: '096', matter: '상표권·도메인 출원·등록·갱신', level: '임원' },
      { id: '096', matter: '상표권 분쟁 — 주요사항', level: '대표이사' },
      { id: '096', matter: '상표권 분쟁 — 일반사항', level: '임원' },
      { id: '097', matter: '주간업무보고 / 회의운영', level: '본부장(실장)' },
      { id: '097', matter: '유관기관 — 주요사항', level: '임원' },
      { id: '097', matter: '유관기관 — 일반사항', level: '본부장(실장)' },
      { id: '098', matter: '조직개편·부서별 업무분장 / 정원조정', level: '대표이사' },
      { id: '099', matter: '업무개선 — 주요사항', level: '임원' },
      { id: '099', matter: '업무개선 — 일반사항', level: '본부장(실장)' },
      { id: '100', matter: '사업실적보고 — 연간실적 / 기별분석', level: '대표이사' },
      { id: '100', matter: '기타 업무보고', level: '임원' },
      { id: '101', matter: '재무회계 — 법인결산', level: '대표이사' },
      { id: '101', matter: '재무회계 — 월말보고 / 전표', level: '본부장(실장)' },
      { id: '102', matter: '세무회계 — 법인세 신고납부', level: '대표이사' },
      { id: '102', matter: '세무회계 — 원천세·부가세·지방세·연말정산', level: '본부장(실장)' },
      { id: '103', matter: '자금운용계획 기본계획 수립', level: '대표이사' },
      { id: '103', matter: '자금 기본계획에 따른 운용 / 입출금 관리', level: '본부장(실장)' },
      { id: '103', matter: '주식의 발행', level: '대표이사' },
    ],
  },
  {
    label: '인사총무',
    color: 'pink',
    items: [
      { id: '110', matter: '직원 채용·승진·퇴직 — 정규직', level: '대표이사' },
      { id: '110', matter: '직원 채용·승진·퇴직 — 계약직', level: '임원' },
      { id: '110', matter: '직원 특별승급 / 이동·휴직·복직·파견', level: '대표이사' },
      { id: '110', matter: '포상·표창 / 징계', level: '대표이사' },
      { id: '110', matter: '연간교육계획 수립', level: '임원' },
      { id: '110', matter: '개별교육계획 / 교육실시·결과평가', level: '본부장(실장)' },
      { id: '110', matter: '직원연수 — 해외', level: '대표이사' },
      { id: '110', matter: '직원연수 — 국내', level: '임원' },
      { id: '110', matter: '인사위원회 운영', level: '대표이사' },
      { id: '110', matter: '복무·근태 — 인원일보 / 특근명령', level: '팀장' },
      { id: '110', matter: '직원역량평가 계획·실시·등급확정·반영', level: '대표이사' },
      { id: '111', matter: '월급여·정기상여금·퇴직금 지급', level: '대표이사' },
      { id: '111', matter: '특별상여금 지급', level: '대표이사' },
      { id: '112', matter: '4대 보험 / 연월차보상비', level: '본부장(실장)' },
      { id: '112', matter: '출퇴근대책비·학자보조금·하계휴양', level: '본부장(실장)' },
      { id: '112', matter: '주택자금융자 / 직원 건강관리', level: '임원' },
      { id: '112', matter: '기타 복리후생 — 주요사항', level: '임원' },
      { id: '112', matter: '기타 복리후생 — 일반사항', level: '본부장(실장)' },
      { id: '113', matter: '내외공문 발신·수신·분류 / 문서보존 분류', level: '팀장' },
      { id: '113', matter: '문서철 관리·보관 / 이관 / 폐기 / 창고관리', level: '팀장' },
      { id: '114', matter: '인감증명·등기부등본 관리', level: '팀장' },
      { id: '114', matter: '법인인감 등록·개폐 / 보관·날인', level: '임원' },
      { id: '115', matter: '일반서무 — 사무실·통신·차량·자가운전', level: '팀장' },
      { id: '116', matter: '자산관리 기본방침 결정', level: '대표이사' },
      { id: '116', matter: '자산관리 세부집행 — 주요사항', level: '임원' },
      { id: '116', matter: '자산관리 세부집행 — 일반사항', level: '본부장(실장)' },
      { id: '117', matter: '보험부보 — 2억원 이상', level: '대표이사' },
      { id: '117', matter: '보험부보 — 5천만~2억원', level: '임원' },
      { id: '117', matter: '보험부보 — 1천만~5천만원', level: '본부장(실장)' },
      { id: '117', matter: '보험부보 — 1천만원 미만', level: '팀장' },
    ],
  },
];

const LEVEL_ORDER: Level[] = ['담당', '팀장', '본부장(실장)', '임원', '대표이사'];

export default function DelegationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState<Level | '전체'>('전체');

  const category = CATEGORIES[activeTab];

  const filtered = category.items.filter(item => {
    const matchSearch = search === '' || item.matter.includes(search) || item.id.includes(search);
    const matchLevel = filterLevel === '전체' || item.level === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center bg-gray-50/30">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_10px_40px_rgb(14,165,233,0.06)] border border-white p-8 md:p-14 mb-20 relative">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 pb-6 border-b border-gray-100/60 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">위임전결 가이드</h2>
            <p className="text-sm font-medium text-gray-400 mt-1.5">위임전결요령 별표 기준 — 2023.09.06 개정. 모든 금액은 부가세 별도 기준.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="self-start md:self-auto text-sm font-bold text-primary-500 hover:text-white px-5 py-2.5 rounded-full border border-primary-200 hover:border-primary-500 bg-primary-50 hover:bg-primary-500 transition-all shadow-sm"
          >
            홈으로 돌아가기
          </button>
        </div>

        {/* Key rules summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { title: '전결권 제한', desc: '직상위자가 필요 시 언제든 본인 결재 요구 가능' },
            { title: '전결권 대행', desc: '출장 등 부재 시 차하위자가 대행, 주요건은 후열 필요' },
            { title: '금액 분할 금지', desc: '전결범위 조정 목적의 동일건 금액 분할 결재 불가' },
            { title: '부가세', desc: '별표의 모든 금액 기준은 부가세 별도 금액' },
          ].map(r => (
            <div key={r.title} className="flex items-start gap-3 bg-primary-50/40 rounded-2xl px-5 py-4 border border-primary-100/40">
              <span className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-gray-800">{r.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Level legend */}
        <div className="flex flex-wrap gap-2 mb-8">
          {LEVEL_ORDER.map(lv => (
            <span key={lv} className={`text-xs font-bold px-3 py-1.5 rounded-full ${LEVEL_COLOR[lv]}`}>{lv}</span>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => { setActiveTab(i); setSearch(''); setFilterLevel('전체'); }}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all border ${
                activeTab === i
                  ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-primary-200 hover:text-primary-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="전결사항 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm px-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary-300 bg-gray-50/50 font-medium"
          />
          <div className="flex gap-2 flex-wrap">
            {(['전체', ...LEVEL_ORDER] as const).map(lv => (
              <button
                key={lv}
                onClick={() => setFilterLevel(lv)}
                className={`text-xs font-bold px-3 py-2 rounded-full transition-all border ${
                  filterLevel === lv
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-400 px-5 py-3 w-16">호</th>
                <th className="text-left text-xs font-bold text-gray-400 px-5 py-3">전결 사항</th>
                <th className="text-left text-xs font-bold text-gray-400 px-5 py-3 w-36">전결자</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-sm text-gray-400 py-10 font-medium">
                    해당하는 전결사항이 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-bold text-gray-400">{item.id}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700">{item.matter}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${LEVEL_COLOR[item.level]}`}>
                        {item.level}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 font-medium mt-5 text-center">
          ※ 최신 위임전결요령 원본 및 감사관계규정을 반드시 병행 확인하세요.
        </p>
      </div>
    </div>
  );
}
