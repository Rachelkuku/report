import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center pt-20 px-4">
      {/* Hero */}
      <div className="max-w-3xl w-full text-center mb-14">
        <div className="inline-block px-6 py-2.5 rounded-full bg-white text-primary-500 font-bold text-xs tracking-[0.2em] uppercase mb-8 shadow-sm border border-primary-50">
          WTC AI PROMPT TOOL
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-primary-600">
          WTCSEOUL 프롬프트 마스터
        </h1>
        <p className="text-primary-500/80 text-lg md:text-xl leading-relaxed font-medium">
          회사 양식에 최적화된 AI 작성 프롬프트를 자동으로 생성합니다
        </p>
        <p className="text-primary-400 text-sm mt-4 font-medium tracking-wide">
          품의 · 협조전 · 보고서 · 예산 · 계약
        </p>
      </div>

      {/* Floating White Container */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_10px_40px_rgb(14,165,233,0.06)] border border-white/80 p-8 md:p-12 mb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: 품의/협조전 */}
          <button
            onClick={() => navigate('/doc')}
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-left hover:shadow-lg hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white">
              <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              품의/협조전 프롬프트 생성
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              기안문, 협조전, 기안문(대행예산) 작성을 위한 최적화된 프롬프트를 생성합니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['완료조서', '임대차계약', '시설공사', '구매'].map(tag => (
                <span key={tag} className="text-[11px] px-3 py-1 bg-gray-50 text-gray-500 font-bold rounded-full border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center text-primary-500 text-sm font-bold group-hover:gap-2 transition-all">
              <span>프롬프트 생성하기</span>
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Card 2: 보고서 */}
          <button
            onClick={() => navigate('/report')}
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-left hover:shadow-lg hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white">
              <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              보고서 프롬프트 생성
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              추진안, 검토보고서, 결과보고, 현황보고 작성을 위한 분석형 프롬프트를 생성합니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['추진안', '검토보고서', '결과보고', '현황보고'].map(tag => (
                <span key={tag} className="text-[11px] px-3 py-1 bg-gray-50 text-gray-500 font-bold rounded-full border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center text-indigo-500 text-sm font-bold group-hover:gap-2 transition-all">
              <span>프롬프트 생성하기</span>
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Extra Links */}
        <div className="grid grid-cols-1 gap-4 mb-10">
          <button
            onClick={() => navigate('/examples')}
            className="group bg-gradient-to-r from-primary-50/50 to-transparent rounded-2xl border border-primary-50 p-5 text-left hover:border-primary-100 hover:from-primary-50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">예시 시나리오 보기</h3>
                <p className="text-[13px] text-gray-500 mt-1 font-medium">실제 업무 사례별 입력값과 생성 프롬프트 예시</p>
              </div>
            </div>
            <div className="text-primary-300 group-hover:text-primary-500 transition-colors mr-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/retention')}
            className="group bg-gradient-to-r from-orange-50/50 to-transparent rounded-2xl border border-orange-50 p-5 text-left hover:border-orange-100 hover:from-orange-50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">문서 보존기간 가이드</h3>
                <p className="text-[13px] text-gray-500 mt-1 font-medium">규정집 제43조에 따른 문서 보존연한 안내</p>
              </div>
            </div>
            <div className="text-orange-300 group-hover:text-orange-500 transition-colors mr-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Usage guide */}
        <div className="border-t border-gray-100 pt-8 mt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-6 text-center tracking-wide">간편한 사용 방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '유형 선택', desc: '작성할 문서의 종류와 업무유형을 선택하세요.' },
              { step: '02', title: '정보 입력', desc: '건물명, 금액 등 필요한 핵심 정보를 입력합니다.' },
              { step: '03', title: 'AI 활용', desc: '생성된 프롬프트를 복사하여 AI 도구에 붙여넣습니다.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <span className="text-3xl font-black text-primary-100 mb-3 tracking-tighter">{step}</span>
                <p className="text-[15px] font-bold text-gray-800 mb-1.5">{title}</p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

