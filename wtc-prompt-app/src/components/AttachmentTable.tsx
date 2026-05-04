import { AttachmentItem } from '../types';

interface AttachmentTableProps {
  items: AttachmentItem[];
  compact?: boolean;
}

const levelStyle: Record<string, string> = {
  '필수': 'badge-red',
  '권장': 'badge-blue',
  '조건부': 'badge-yellow',
};

export default function AttachmentTable({ items, compact = false }: AttachmentTableProps) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-400 italic">첨부파일 추천 정보 없음</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-3 py-2 font-medium text-gray-700 w-2/5">첨부파일</th>
            <th className="text-center px-2 py-2 font-medium text-gray-700 w-1/6">필수 여부</th>
            {!compact && <th className="text-left px-3 py-2 font-medium text-gray-700">추천 사유</th>}
            {!compact && <th className="text-center px-2 py-2 font-medium text-gray-700 w-1/6">원본보관</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-800">{item.name}</td>
              <td className="px-2 py-2 text-center">
                <span className={levelStyle[item.level] || 'badge-gray'}>{item.level}</span>
              </td>
              {!compact && <td className="px-3 py-2 text-gray-600">{item.reason}</td>}
              {!compact && (
                <td className="px-2 py-2 text-center">
                  {item.originalRequired ? (
                    <span className="badge-orange text-xs">별도보관</span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
