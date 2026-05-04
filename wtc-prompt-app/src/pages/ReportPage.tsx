import { useState, useEffect } from 'react';
import { ReportFormState, ReportType } from '../types';
import { generateReportPrompt } from '../utils/reportPromptGenerator';
import { attachmentData } from '../data/attachments';
import AttachmentTable from '../components/AttachmentTable';

const INITIAL_STATE: ReportFormState = {
  reportType: 'proposal',
  title: '',
  team: '',
  purpose: '',
  reportTarget: '',
  background: '',
  currentStatus: '',
  keyData: '',
  issues: '',
  alternatives: '',
  expectedEffect: '',
  actionPlan: '',
  budget: '',
  attachmentList: '',
};

const STORAGE_KEY = 'wtc_report_form_state';

function loadState(): ReportFormState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_STATE;
}

const REPORT_TYPES: { value: ReportType; label: string; desc: string }[] = [
  { value: 'proposal', label: '추진안', desc: '사업/프로젝트 추진 기획안' },
  { value: 'review', label: '검토보고서', desc: '현황 분석 및 대안 검토' },
  { value: 'result', label: '결과보고', desc: '출장/행사 결과 보고' },
  { value: 'status', label: '현황보고', desc: '진행 현황 및 지표 보고' },
];

const TOC_MAP: Record<ReportType, string[]> = {
  proposal: ['1. 추진 배경 및 목적', '2. 현황 분석', '3. 추진 방향(안)', '4. 세부 실행계획', '5. 기대효과 및 위험요인', '6. 향후 일정'],
  review: ['1. 검토 배경', '2. 현황 및 문제점', '3. 대안 검토', '4. 비용·효과 분석', '5. 검토 의견', '6. 향후 조치 방향'],
  result: ['1. 출장/행사 개요', '2. 주요 활동 내용', '3. 결과 및 시사점', '4. 후속 조치 계획'],
  status: ['1. 현황 요약', '2. 주요 지표', '3. 이슈 사항', '4. 향후 계획'],
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 hover:border-primary-100">
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-primary-50/30 text-[13px] font-bold text-gray-700 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-primary-500' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-5 pb-4 bg-white">{children}</div>}
    </div>
  );
}

export default function ReportPage() {
  const [state, setState] = useState<ReportFormState>(loadState);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const update = (key: keyof ReportFormState, value: string) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const prompt = generateReportPrompt(state);
  const toc = TOC_MAP[state.reportType];
  const attachments = attachmentData.report || [];

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
    <div className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center">
      
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_10px_40px_rgb(99,102,241,0.06)] border border-white p-8 md:p-14 mb-20 relative">
        
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100/60">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">보고서 프롬프트 설계</h2>
            <p className="text-sm font-medium text-gray-400 mt-1.5">보고서 유형을 선택하고 핵심 내용을 입력하여 프롬프트를 만드세요</p>
          </div>
          <button
            onClick={resetForm}
            className="text-xs font-bold text-gray-400 hover:text-red-500 px-4 py-2 rounded-full border border-gray-100 hover:border-red-200 bg-white hover:bg-red-50 transition-all shadow-sm"
          >
            전체 초기화
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form Inputs */}
          <div className="space-y-10">
            
            {/* 1. 보고서 유형 */}
            <section>
              <p className="section-title !text-indigo-500 before:!bg-indigo-300">1. 보고서 유형 선택</p>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_TYPES.map(rt => (
                  <button
                    key={rt.value}
                    onClick={() => update('reportType', rt.value)}
                    className={`card-radio ${state.reportType === rt.value ? '!border-indigo-300 !bg-indigo-400 !text-white' : ''}`}
                  >
                    <div className="font-extrabold text-[15px]">{rt.label}</div>
                    <div className="text-[12px] mt-1.5 font-medium opacity-70 leading-relaxed max-w-[90%]">{rt.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. 기본 정보 */}
            <section>
              <p className="section-title !text-indigo-500 before:!bg-indigo-300">2. 기본 정보 입력</p>
              <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                <div>
                  <label className="form-label">보고서 제목 <span className="text-indigo-500">*</span></label>
                  <input
                    className="form-input focus:!ring-indigo-300"
                    placeholder="예: 2025년 WTC 에너지 절감 추진방안"
                    value={state.title}
                    onChange={e => update('title', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">주관팀</label>
                    <input
                      className="form-input focus:!ring-indigo-300"
                      placeholder="예: 오피스운영팀"
                      value={state.team}
                      onChange={e => update('team', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">보고대상</label>
                    <input
                      className="form-input focus:!ring-indigo-300"
                      placeholder="예: 본부장 / 임원"
                      value={state.reportTarget}
                      onChange={e => update('reportTarget', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">작성목적</label>
                  <textarea
                    className="form-textarea focus:!ring-indigo-300"
                    rows={2}
                    placeholder="보고서 작성 목적 및 배경"
                    value={state.purpose}
                    onChange={e => update('purpose', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* 3. 내용 입력 */}
            <section>
              <p className="section-title !text-indigo-500 before:!bg-indigo-300">3. 상세 내용 입력</p>
              <div className="space-y-3 bg-indigo-50/30 p-5 rounded-3xl border border-indigo-50">
                <CollapsibleSection title="배경 및 현황">
                  <div className="space-y-3 pt-2">
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="추진 배경 및 필요성" value={state.background} onChange={e => update('background', e.target.value)} />
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="현재 상황 및 문제점" value={state.currentStatus} onChange={e => update('currentStatus', e.target.value)} />
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="수치/데이터 및 이슈" defaultOpen={false}>
                  <div className="space-y-3 pt-2">
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="핵심 지표, 수치, 통계" value={state.keyData} onChange={e => update('keyData', e.target.value)} />
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="이슈 및 리스크" value={state.issues} onChange={e => update('issues', e.target.value)} />
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="검토안 및 대안" defaultOpen={false}>
                  <textarea className="form-textarea focus:!ring-indigo-300 mt-2" rows={3} placeholder="검토한 방안 또는 대안 분석" value={state.alternatives} onChange={e => update('alternatives', e.target.value)} />
                </CollapsibleSection>
                <CollapsibleSection title="기대효과 및 실행계획" defaultOpen={false}>
                  <div className="space-y-3 pt-2">
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="기대효과" value={state.expectedEffect} onChange={e => update('expectedEffect', e.target.value)} />
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="세부 실행 계획" value={state.actionPlan} onChange={e => update('actionPlan', e.target.value)} />
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="비용/예산 및 첨부자료" defaultOpen={false}>
                  <div className="space-y-3 pt-2">
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="예상 비용" value={state.budget} onChange={e => update('budget', e.target.value)} />
                    <textarea className="form-textarea focus:!ring-indigo-300" rows={2} placeholder="첨부자료 목록 (현장사진, 도면 등)" value={state.attachmentList} onChange={e => update('attachmentList', e.target.value)} />
                  </div>
                </CollapsibleSection>
              </div>
            </section>
          </div>

          {/* Right Column: Preview & Generate */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-3xl p-6 border border-indigo-100 shadow-sm lg:sticky lg:top-24">
              <h3 className="text-sm font-extrabold text-indigo-600 tracking-wide uppercase mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                결과 요약 및 프롬프트
              </h3>
              
              <div className="space-y-3 mb-6">
                {state.title && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">보고서 제목</span>
                    <div className="text-sm font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">{state.title}</div>
                  </div>
                )}
                
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">추천 목차 (AI 생성 시 반영)</span>
                  <ul className="space-y-1.5">
                    {toc.map((item, i) => (
                      <li key={i} className="text-[13px] text-gray-700 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 프롬프트 */}
              <div className="mb-4 relative">
                <span className="absolute top-3 right-3 text-[10px] font-bold text-gray-300 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-50">{prompt.length.toLocaleString()}자</span>
                <textarea
                  readOnly
                  value={prompt}
                  rows={14}
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-[13px] font-mono text-gray-600 focus:outline-none resize-y shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)] leading-relaxed"
                />
              </div>

              {/* 복사 버튼 */}
              <button
                onClick={handleCopy}
                className={`w-full py-3.5 rounded-full font-extrabold text-[15px] transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-200 text-white transform hover:-translate-y-0.5'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    복사 완료!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    프롬프트 복사하기
                  </>
                )}
              </button>

            </div>

            {/* 추천 첨부파일 */}
            {attachments.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mt-6 animate-in fade-in slide-in-from-bottom-2 lg:sticky lg:top-[750px]">
                <h3 className="text-sm font-extrabold text-gray-700 tracking-wide uppercase mb-4">보고서 추천 첨부자료</h3>
                <AttachmentTable items={attachments} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
