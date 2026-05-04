import { useNavigate } from 'react-router-dom';

export default function RetentionPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto py-12 px-4 flex flex-col items-center bg-gray-50/30">
      
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_10px_40px_rgb(14,165,233,0.06)] border border-white p-8 md:p-14 mb-20 relative">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100/60 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">제43조 (보존기간) 안내</h2>
            <p className="text-sm font-medium text-gray-400 mt-1.5">문서의 보존기간은 다음의 기준에 의하여 정하되, 특별한 사유가 없는 한 3년간 보존을 원칙으로 합니다.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="self-start md:self-auto text-sm font-bold text-primary-500 hover:text-white px-5 py-2.5 rounded-full border border-primary-200 hover:border-primary-500 bg-primary-50 hover:bg-primary-500 transition-all shadow-sm"
          >
            홈으로 돌아가기
          </button>
        </div>

        <div className="space-y-8">
          {/* 1. 영구 보존문서 */}
          <section className="bg-gradient-to-r from-red-50/50 to-transparent border border-red-100/50 rounded-3xl p-8">
            <h3 className="text-lg font-black text-red-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm">1</span>
              영구 보존문서
            </h3>
            <ul className="space-y-3 pl-2">
              {[
                '제규정',
                '주주총회, 이사회의 회의록',
                '인사기록카드 등 중요 인사관계 서류',
                '회사 사료로서 중요한 가치가 있는 문서',
                '효력이 영속하는 문서',
                '관청의 주요 인·허가서 및 중요 계약서',
                '소송관련 문서',
                '기타 영구히 보존할 필요가 있다고 인정되는 문서'
              ].map((item, i) => (
                <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-3">
                  <span className="text-red-300 mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 2. 10년 보존문서 */}
          <section className="bg-gradient-to-r from-orange-50/50 to-transparent border border-orange-100/50 rounded-3xl p-8">
            <h3 className="text-lg font-black text-orange-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-sm">2</span>
              10년 보존문서
            </h3>
            <ul className="space-y-3 pl-2">
              {[
                '만기 또는 해약한 계약서 (전결자가 대표이사 이상인 경우)',
                '회계서류 및 장부',
                '정부지원금 관련 경비지출 원인행위 및 경비지출 증빙서류',
                '업무수행상 장기간 참고 또는 이용해야 할 문서',
                '법률상 10년간 보존해야 하는 문서'
              ].map((item, i) => (
                <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-3">
                  <span className="text-orange-300 mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. 5년 보존문서 */}
          <section className="bg-gradient-to-r from-primary-50/50 to-transparent border border-primary-100/50 rounded-3xl p-8">
            <h3 className="text-lg font-black text-primary-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-sm">3</span>
              5년 보존문서
            </h3>
            <ul className="space-y-3 pl-2">
              {[
                '만기 또는 해약한 계약서 (대표이사 전결 외)',
                '경비지출 원인행위 및 경비지출 증빙서류 (정부지원금 제외)',
                '대외문서로서 약간의 중요성이 인정되는 문서',
                '법률상 5년간 보존해야 하는 문서'
              ].map((item, i) => (
                <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-3">
                  <span className="text-primary-300 mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. 1년 보존문서 */}
          <section className="bg-gradient-to-r from-gray-50/80 to-transparent border border-gray-200/50 rounded-3xl p-8">
            <h3 className="text-lg font-black text-gray-600 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm">4</span>
              1년 보존문서
            </h3>
            <ul className="space-y-3 pl-2">
              {[
                '다년간 보존할 필요가 없는 잡문서'
              ].map((item, i) => (
                <li key={i} className="text-sm font-medium text-gray-700 flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

      </div>
    </div>
  );
}
