import { useState } from 'react';
import { DocFormState } from '../types';
import { generateDocPrompt } from '../utils/promptGenerator';
import { generateTitle } from '../utils/titleGenerator';

interface ExampleScenario {
  id: string;
  title: string;
  description: string;
  workTypeName: string;
  state: DocFormState;
}

const EXAMPLES: ExampleScenario[] = [
  {
    id: 'payment_example',
    title: '아셈타워 33층 공용복도 카펫 변경 공사 대금지급',
    description: '완료조서·대금지급 — 공사 완료 후 대금 지급 기안문',
    workTypeName: '완료조서·대금지급',
    state: {
      documentType: 'draft',
      workType: 'payment',
      base: {
        buildingName: '아셈타워',
        location: '33층 공용복도',
        tenantName: '(주)인테리어월드',
        workName: '공용복도 노후화 카펫 변경 공사',
        amountVatExcluded: '8500000',
        amountVatIncluded: '9350000',
        period: '2025.04.21~2025.04.25',
        relatedDocs: '2025-시설-012 (공사 시행 기안문)',
        reason: '33층 공용복도 카펫 노후화로 인한 미관 저해 및 안전사고 예방',
        mainContent: '기존 노후 카펫 철거 및 신규 카펫 타일 시공 (150㎡), 공사 완료 및 검수 완료',
        specialNotes: '공사 중 입주사 사전 공지 완료, 야간 작업으로 업무 영향 최소화',
        ownedAttachments: '완료사진, 세금계산서, 준공계',
      },
      agencyBudget: {
        specialAccount: '', budgetYear: '', fundName: '', accountName: '',
        fundAmount: '', expenditureType: '', costBasis: '',
      },
      cooperation: {
        recipient: '', reference: '', followUpWork: '',
        requestDeadline: '', sealType: '', sealQuantity: '',
      },
      workTypeFields: {
        completionDate: '2025-04-25',
        inspector: '김철수 대리',
        paymentAmount: '9350000',
        originalDocRef: '2025-시설-012',
      },
    },
  },
  {
    id: 'lease_new_example',
    title: '트레이드타워 1234호 (주)ABC 신규 임대차계약',
    description: '임대차계약 — 신규 입주사 계약 체결 기안문',
    workTypeName: '임대차계약',
    state: {
      documentType: 'draft',
      workType: 'lease_new',
      base: {
        buildingName: '트레이드타워',
        location: '1234호',
        tenantName: '(주)ABC컨설팅',
        workName: '트레이드타워 1234호 신규 임대차계약',
        amountVatExcluded: '36000000',
        amountVatIncluded: '',
        period: '2025.06.01~2027.05.31 (2년)',
        relatedDocs: '임차 신청서 (2025.04.15)',
        reason: '신규 임차 수요 발생에 따른 계약 체결 승인 요청',
        mainContent: '트레이드타워 1234호 신규 임대차계약 체결. 업종: IT서비스업, 보증금 3.6억원, 월임대료 300만원(부가세별도)',
        specialNotes: '직접계약, 제소전화해 체결 예정',
        ownedAttachments: '임대차계약서(안), 호실 도면, 임차의향서',
      },
      agencyBudget: {
        specialAccount: '', budgetYear: '', fundName: '', accountName: '',
        fundAmount: '', expenditureType: '', costBasis: '',
      },
      cooperation: {
        recipient: '', reference: '', followUpWork: '',
        requestDeadline: '', sealType: '', sealQuantity: '',
      },
      workTypeFields: {
        roomNo: '1234호',
        exclusiveArea: '330.00㎡',
        contractArea: '396.00㎡',
        businessType: 'IT서비스업/소프트웨어 개발',
        deposit: '360000000',
        monthlyRent: '3000000',
        monthlyMgmt: '1200000',
        rentFree: '1개월',
        minUsePeriod: '2년',
        terminationNotice: '3개월 전',
        pretrialSettlement: '체결',
        consultingType: '직접계약',
      },
    },
  },
  {
    id: 'construction_example',
    title: '트레이드타워 로비 LED 조명 교체 공사',
    description: '시설공사·수선 — 에너지 효율 개선을 위한 LED 교체 공사 기안문',
    workTypeName: '시설공사·수선',
    state: {
      documentType: 'draft',
      workType: 'construction',
      base: {
        buildingName: '트레이드타워',
        location: '1층~3층 로비',
        tenantName: '(주)조명전문',
        workName: 'LED 조명 교체 공사',
        amountVatExcluded: '22000000',
        amountVatIncluded: '24200000',
        period: '2025.06.02~2025.06.13 (2주)',
        relatedDocs: '에너지 관리 계획 2025',
        reason: '기존 형광등 노후화(10년 이상 사용)에 따른 에너지 효율 개선 및 유지관리비 절감',
        mainContent: '1층~3층 공용 로비 형광등 → LED 교체 (총 200개), 야간 작업으로 진행, 예상 전력 절감 효과 약 30%',
        specialNotes: '일상감사 대상. 복수견적 3개사 진행 완료.',
        ownedAttachments: '견적서, 비교견적서 3부, 현장사진',
      },
      agencyBudget: {
        specialAccount: '', budgetYear: '', fundName: '', accountName: '',
        fundAmount: '', expenditureType: '', costBasis: '',
      },
      cooperation: {
        recipient: '', reference: '', followUpWork: '',
        requestDeadline: '', sealType: '', sealQuantity: '',
      },
      workTypeFields: {
        constructionCompany: '(주)조명전문',
        comparativeQuote: '(주)조명전문: 22,000,000원\n(주)빛나라: 25,000,000원\n(주)LED코리아: 24,500,000원',
        constructionScope: '1층~3층 공용 로비 형광등 200개 LED 교체, 전기 안전 점검 포함',
        tenantImpact: '야간 작업으로 업무시간 영향 없음, 입주사 사전 공지 완료',
      },
    },
  },
  {
    id: 'business_trip_example',
    title: '지방무역회관 시설점검 국내출장',
    description: '출장 시행 — 지방 시설 점검을 위한 출장 기안문(대행예산)',
    workTypeName: '출장 시행',
    state: {
      documentType: 'agency_budget',
      workType: 'business_trip',
      base: {
        buildingName: '지방무역회관',
        location: '부산 국제금융센터',
        tenantName: '',
        workName: '지방무역회관 시설 정기점검',
        amountVatExcluded: '450000',
        amountVatIncluded: '',
        period: '2025.05.19~2025.05.20 (1박2일)',
        relatedDocs: '2025년 지방 시설 점검 계획',
        reason: '2025년 상반기 지방무역회관 시설 정기 점검 및 현황 파악',
        mainContent: '기계실, 전기실, 소방설비, 옥상 등 주요 시설 점검 및 개선 사항 파악',
        specialNotes: '점검표 및 현장사진 현지 작성, 결과보고서 귀임 후 5일 이내 제출',
        ownedAttachments: '출장 일정표, 점검 체크리스트',
      },
      agencyBudget: {
        specialAccount: 'WTC운영비',
        budgetYear: '2025',
        fundName: '시설관리비',
        accountName: '출장비',
        fundAmount: '450000',
        expenditureType: '출장비',
        costBasis: '교통비 200,000원 + 숙박비 150,000원 + 식비 60,000원 + 일비 40,000원',
      },
      cooperation: {
        recipient: '', reference: '', followUpWork: '',
        requestDeadline: '', sealType: '', sealQuantity: '',
      },
      workTypeFields: {
        tripPurpose: '시설 정기점검',
        traveler: '박민준 과장',
        destination: '부산 국제금융센터',
        tripPeriod: '2025.05.19~2025.05.20 (1박2일)',
        tripMainContent: '기계실, 전기실, 소방설비, 옥상 등 주요 시설 점검 및 현장 담당자 협의',
        transportCost: '200000',
        accommodationCost: '150000',
        mealCost: '60000',
        dailyAllowance: '40000',
      },
    },
  },
];

interface AccordionItemProps {
  scenario: ExampleScenario;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ scenario, isOpen, onToggle }: AccordionItemProps) {
  const prompt = generateDocPrompt(scenario.state);
  const title = generateTitle(scenario.state);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        className="w-full flex items-start justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
              {scenario.workTypeName}
            </span>
            <span className="text-xs text-gray-400">
              {scenario.state.documentType === 'draft' ? '기안문' :
               scenario.state.documentType === 'cooperation' ? '협조전' : '기안문(대행예산)'}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900">{scenario.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{scenario.description}</p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180 text-primary-500' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-200 px-6 py-5 space-y-5">
          {/* 입력값 요약 */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">입력값 요약</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '건물명', value: scenario.state.base.buildingName },
                { label: '위치/호실', value: scenario.state.base.location },
                { label: '입주사/업체명', value: scenario.state.base.tenantName || '-' },
                { label: '업무명', value: scenario.state.base.workName },
                { label: '금액(별도)', value: scenario.state.base.amountVatExcluded ? `${parseInt(scenario.state.base.amountVatExcluded).toLocaleString()}원` : '-' },
                { label: '기간', value: scenario.state.base.period || '-' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xs font-medium text-gray-700 mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 추천 제목 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">자동 생성된 추천 제목</p>
            <p className="text-sm text-blue-900 font-medium">{title}</p>
          </div>

          {/* 생성된 프롬프트 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">생성된 프롬프트</p>
              <p className="text-xs text-gray-400">{prompt.length.toLocaleString()}자</p>
            </div>
            <textarea
              readOnly
              value={prompt}
              rows={18}
              className="w-full border border-gray-200 rounded-lg p-3 text-xs font-mono bg-gray-50 text-gray-700 focus:outline-none resize-y"
            />
            <button
              onClick={handleCopy}
              className={`w-full mt-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {copied ? '복사 완료!' : '이 프롬프트 복사'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamplesPage() {
  const [openId, setOpenId] = useState<string | null>(EXAMPLES[0].id);

  return (
    <div className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_10px_40px_rgb(14,165,233,0.06)] border border-white p-8 md:p-14 mb-20">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">예시 시나리오</h1>
          <p className="text-sm text-gray-500">실제 업무 사례를 기반으로 생성된 프롬프트 예시입니다. 참고하여 실제 업무에 활용하세요.</p>
        </div>

        <div className="space-y-3">
          {EXAMPLES.map(scenario => (
            <AccordionItem
              key={scenario.id}
              scenario={scenario}
              isOpen={openId === scenario.id}
              onToggle={() => setOpenId(openId === scenario.id ? null : scenario.id)}
            />
          ))}
        </div>

        <div className="mt-10 bg-primary-50/50 rounded-3xl border border-primary-100/50 p-6">
          <p className="text-sm font-semibold text-gray-800 mb-2">직접 입력하려면</p>
          <p className="text-sm text-gray-500">
            위 예시는 참고용입니다. 실제 업무에 맞는 프롬프트를 생성하려면{' '}
            <a href="/doc" className="text-primary-600 hover:underline font-medium">품의/협조전 생성 페이지</a>나{' '}
            <a href="/report" className="text-primary-600 hover:underline font-medium">보고서 생성 페이지</a>에서
            직접 입력값을 넣어 프롬프트를 생성하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
