import { useState } from 'react';
import { attachmentData } from '../data/attachments';
import { WORK_TYPE_LABELS } from '../data/workTypes';
import AttachmentTable from '../components/AttachmentTable';
import { WorkType } from '../types';

const WORK_TYPE_ORDER: WorkType[] = [
  'payment', 'lease_new', 'lease_renewal', 'deposit_return', 'deposit_redeposit',
  'construction', 'purchase', 'bid_contract', 'legal_stamp', 'outgoing_letter',
  'free_use', 'business_trip', 'trip_report', 'education', 'safety',
  'energy_utility', 'general_request',
];

export default function AttachmentsPage() {
  const [activeType, setActiveType] = useState<WorkType | 'report'>('payment');
  const [searchQuery, setSearchQuery] = useState('');

  const currentItems = attachmentData[activeType] || [];

  const filteredItems = searchQuery.trim()
    ? currentItems.filter(item =>
        item.name.includes(searchQuery) || item.reason.includes(searchQuery)
      )
    : currentItems;

  const getTypeLabel = (key: WorkType | 'report') => {
    if (key === 'report') return '보고서';
    return WORK_TYPE_LABELS[key] || key;
  };

  const countByLevel = (type: WorkType | 'report') => {
    const items = attachmentData[type] || [];
    return {
      mandatory: items.filter(i => i.level === '필수').length,
      recommended: items.filter(i => i.level === '권장').length,
      conditional: items.filter(i => i.level === '조건부').length,
    };
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">업무유형별 첨부파일 추천표</h1>
          <p className="text-sm text-gray-500">업무유형을 선택하면 해당 업무의 필수/권장/조건부 첨부파일을 확인할 수 있습니다.</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5">
            <span className="badge-red">필수</span>
            <span className="text-xs text-gray-500">결재 전 반드시 첨부</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="badge-blue">권장</span>
            <span className="text-xs text-gray-500">첨부 강력 권장</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="badge-yellow">조건부</span>
            <span className="text-xs text-gray-500">해당 조건 시 필요</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="badge-orange">별도보관</span>
            <span className="text-xs text-gray-500">원본 별도 보관 필요</span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left: Tab list */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {WORK_TYPE_ORDER.map(wt => {
                const counts = countByLevel(wt);
                return (
                  <button
                    key={wt}
                    onClick={() => { setActiveType(wt); setSearchQuery(''); }}
                    className={`w-full flex items-start gap-2 px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                      activeType === wt
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight truncate">{getTypeLabel(wt)}</p>
                      <div className="flex gap-1 mt-0.5">
                        {counts.mandatory > 0 && (
                          <span className="text-xs text-red-600">필수 {counts.mandatory}</span>
                        )}
                        {counts.recommended > 0 && (
                          <span className="text-xs text-blue-600">권장 {counts.recommended}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              <button
                onClick={() => { setActiveType('report'); setSearchQuery(''); }}
                className={`w-full flex items-start gap-2 px-4 py-3 text-left transition-colors ${
                  activeType === 'report'
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div>
                  <p className="text-xs font-medium">보고서</p>
                  <p className="text-xs text-gray-400 mt-0.5">공통 첨부파일</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Table */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {getTypeLabel(activeType)}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    총 {currentItems.length}건
                    (필수 {currentItems.filter(i => i.level === '필수').length},
                    권장 {currentItems.filter(i => i.level === '권장').length},
                    조건부 {currentItems.filter(i => i.level === '조건부').length})
                  </p>
                </div>
                <input
                  type="text"
                  className="form-input w-48"
                  placeholder="첨부파일 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {filteredItems.length > 0 ? (
                <AttachmentTable items={filteredItems} />
              ) : (
                <p className="text-sm text-gray-400 italic py-4 text-center">
                  {searchQuery ? `"${searchQuery}"에 해당하는 첨부파일이 없습니다.` : '첨부파일 정보가 없습니다.'}
                </p>
              )}

              {/* 원본 보관 안내 */}
              {currentItems.some(i => i.originalRequired) && (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-orange-800 mb-1">원본 별도 보관 필요 항목</p>
                  <ul className="text-xs text-orange-700 space-y-0.5">
                    {currentItems.filter(i => i.originalRequired).map((item, i) => (
                      <li key={i}>- {item.name}: {item.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
