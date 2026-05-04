import { useState, useEffect, useCallback } from 'react';
import { DocFormState, DocumentType, WorkType } from '../types';
import { WORK_TYPES } from '../data/workTypes';
import { attachmentData } from '../data/attachments';
import { calcApproval, calcAudit } from '../utils/calculations';
import { generateTitle } from '../utils/titleGenerator';
import { generateDocPrompt } from '../utils/promptGenerator';
import AttachmentTable from '../components/AttachmentTable';

const INITIAL_STATE: DocFormState = {
  documentType: 'draft',
  workType: '',
  base: {
    buildingName: '',
    location: '',
    tenantName: '',
    workName: '',
    amountVatExcluded: '',
    amountVatIncluded: '',
    period: '',
    relatedDocs: '',
    reason: '',
    mainContent: '',
    specialNotes: '',
    ownedAttachments: '',
  },
  agencyBudget: {
    specialAccount: '',
    budgetYear: '',
    fundName: '',
    accountName: '',
    fundAmount: '',
    expenditureType: '',
    costBasis: '',
  },
  cooperation: {
    recipient: '',
    reference: '',
    followUpWork: '',
    requestDeadline: '',
    sealType: '',
    sealQuantity: '',
  },
  workTypeFields: {},
};

const STORAGE_KEY = 'wtc_doc_form_state';

function loadState(): DocFormState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_STATE;
}

const DOC_TYPES: { value: DocumentType; label: React.ReactNode }[] = [
  { value: 'draft', label: '기안문' },
  { value: 'cooperation', label: '협조전' },
  { value: 'agency_budget', label: <>기안문<br />(대행예산)</> },
];

export default function DocPage() {
  const [state, setState] = useState<DocFormState>(loadState);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const updateDocType = useCallback((dt: DocumentType) => {
    setState(prev => ({ ...prev, documentType: dt, workType: '' }));
  }, []);

  const updateWorkType = useCallback((wt: WorkType) => {
    setState(prev => ({ ...prev, workType: wt, workTypeFields: {} }));
  }, []);

  const updateBase = useCallback((key: keyof DocFormState['base'], value: string) => {
    setState(prev => ({ ...prev, base: { ...prev.base, [key]: value } }));
  }, []);

  const updateWorkTypeField = useCallback((key: string, value: string) => {
    setState(prev => ({ ...prev, workTypeFields: { ...prev.workTypeFields, [key]: value } }));
  }, []);

  const resetForm = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentWorkTypeInfo = WORK_TYPES.find(wt => wt.id === state.workType);
  const title = generateTitle(state);
  
  // calcApproval / calcAudit signature in calculations.ts?
  // from logs: `calcApproval(state.workType, state.base.amountVatExcluded);`
  // let's check calculations.ts signatures in a moment if needed. I'll guess it takes (workType, amount) and audit takes (amount).
  // Wait, the previous build error was:
  // src/pages/DocPage.tsx(54,20): error TS2554: Expected 2 arguments, but got 1. (for calcApproval)
  // calcApproval expects (workType, amount).
  const approval = calcApproval(state.workType as WorkType, state.base.amountVatExcluded);
  const audit = calcAudit(state.base.amountVatExcluded);
  
  const prompt = generateDocPrompt(state);
  const attachments = state.workType ? (attachmentData[state.workType as WorkType] || []) : [];

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
      
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_10px_40px_rgb(14,165,233,0.06)] border border-white p-8 md:p-14 mb-20 relative">
        
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100/60">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">품의/협조전 프롬프트 설계</h2>
            <p className="text-sm font-medium text-gray-400 mt-1.5">문서 종류와 업무 유형을 선택하여 초안 프롬프트를 만드세요</p>
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
            
            {/* 1. 문서 종류 */}
            <section>
              <p className="section-title">1. 문서 종류 선택</p>
              <div className="grid grid-cols-3 gap-3">
                {DOC_TYPES.map(dt => (
                  <button
                    key={dt.value}
                    onClick={() => updateDocType(dt.value)}
                    className={`card-radio ${state.documentType === dt.value ? 'card-radio-active' : 'card-radio-inactive'}`}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. 업무 유형 */}
            <section>
              <p className="section-title">2. 업무 유형 선택</p>
              <div className="grid grid-cols-2 gap-3">
                {WORK_TYPES.map(wt => (
                  <button
                    key={wt.id}
                    onClick={() => updateWorkType(wt.id as WorkType)}
                    className={`card-radio ${state.workType === wt.id ? 'card-radio-active' : 'card-radio-inactive'}`}
                  >
                    <div className="font-extrabold text-[15px]">{wt.label}</div>
                    {/* If wt has description, we show it, but wait: WORK_TYPES has .label, not .name and .description? Let's check build error: Property 'name' does not exist on type 'WorkTypeInfo'. Property 'description' does not exist on type 'WorkTypeInfo'. So it's .label */}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. 기본 정보 입력 */}
            {state.workType && (
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="section-title">3. 기본 정보 입력</p>
                <div className="space-y-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">건물명</label>
                      <input
                        className="form-input"
                        placeholder="예: 트레이드타워"
                        value={state.base.buildingName}
                        onChange={e => updateBase('buildingName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">위치/호실</label>
                      <input
                        className="form-input"
                        placeholder="예: 33층 / B1"
                        value={state.base.location}
                        onChange={e => updateBase('location', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">입주사/업체명</label>
                    <input
                      className="form-input"
                      placeholder="임차인 또는 용역업체명"
                      value={state.base.tenantName}
                      onChange={e => updateBase('tenantName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">업무명/공사명/계약명 <span className="text-primary-500">*</span></label>
                    <input
                      className="form-input"
                      placeholder="예: 공용복도 카펫 교체"
                      value={state.base.workName}
                      onChange={e => updateBase('workName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">금액(부가세별도)</label>
                      <input
                        className="form-input"
                        placeholder="0"
                        type="number"
                        min="0"
                        value={state.base.amountVatExcluded}
                        onChange={e => updateBase('amountVatExcluded', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label">계약/공사 기간</label>
                      <input
                        className="form-input"
                        placeholder="예: 착수 후 2개월"
                        value={state.base.period}
                        onChange={e => updateBase('period', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 4. 업무별 추가 정보 */}
            {currentWorkTypeInfo?.extraFields && currentWorkTypeInfo.extraFields.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="section-title">4. 업무별 추가 정보</p>
                <div className="space-y-4 bg-primary-50/30 p-6 rounded-3xl border border-primary-50">
                  {currentWorkTypeInfo.extraFields.map(field => (
                    <div key={field.key}>
                      <label className="form-label">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="form-textarea"
                          rows={3}
                          placeholder={field.placeholder}
                          value={state.workTypeFields[field.key] || ''}
                          onChange={e => updateWorkTypeField(field.key, e.target.value)}
                        />
                      ) : (
                        <input
                          className="form-input"
                          type={field.type}
                          placeholder={field.placeholder}
                          value={state.workTypeFields[field.key] || ''}
                          onChange={e => updateWorkTypeField(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Preview & Generate */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-b from-primary-50 to-white rounded-3xl p-6 border border-primary-100 shadow-sm lg:sticky lg:top-24">
              <h3 className="text-sm font-extrabold text-primary-700 tracking-wide uppercase mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                결과 요약 및 프롬프트
              </h3>
              
              <div className="space-y-3 mb-6">
                {title && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">문서 제목</span>
                    <div className="text-sm font-bold text-gray-800 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">{title}</div>
                  </div>
                )}
                {state.base.amountVatExcluded && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">전결권자</span>
                      <span className="text-[13px] font-bold text-primary-600">{approval.level}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">일상감사</span>
                      <span className={`text-[13px] font-bold ${audit.dailyAudit ? 'text-orange-500' : 'text-gray-600'}`}>
                        {audit.dailyAudit ? '대상' : '해당없음'}
                      </span>
                    </div>
                  </div>
                )}
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
                    : 'bg-primary-500 hover:bg-primary-600 hover:shadow-primary-200 text-white transform hover:-translate-y-0.5'
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
            {state.workType && attachments.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mt-6 animate-in fade-in slide-in-from-bottom-2 lg:sticky lg:top-[750px]">
                <h3 className="text-sm font-extrabold text-gray-700 tracking-wide uppercase mb-4">추천 첨부파일</h3>
                <AttachmentTable items={attachments} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
