import { ReportFormState, ReportType } from '../types';

function v(val: string, label = '직접 입력'): string {
  return val?.trim() || label;
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  proposal: '추진안',
  review: '검토보고서',
  result: '결과보고',
  status: '현황보고',
};

const REPORT_TOC: Record<ReportType, string> = {
  proposal: `1. 추진 배경 및 목적
2. 현황 분석
3. 추진 방향(안)
4. 세부 실행계획
5. 기대효과 및 위험요인
6. 향후 일정`,
  review: `1. 검토 배경
2. 현황 및 문제점
3. 대안 검토
4. 비용·효과 분석
5. 검토 의견
6. 향후 조치 방향`,
  result: `1. 출장/행사 개요
2. 주요 활동 내용
3. 결과 및 시사점
4. 후속 조치 계획`,
  status: `1. 현황 요약
2. 주요 지표
3. 이슈 사항
4. 향후 계획`,
};

export function generateReportPrompt(state: ReportFormState): string {
  const typeLabel = REPORT_TYPE_LABELS[state.reportType];
  const toc = REPORT_TOC[state.reportType];

  const prompt = `너는 15년 차 부동산 자산관리 및 오피스 운영 보고서 작성 전문가야.
아래 입력값을 기준으로 WTC Seoul 내부 보고서 초안을 작성해줘.

[보고서 정보]
- 보고서 유형: ${typeLabel}
- 제목: ${v(state.title)}
- 주관팀: ${v(state.team)}
- 작성 목적: ${v(state.purpose)}
- 보고 대상: ${v(state.reportTarget)}

[입력값]
- 배경: ${v(state.background)}
- 현황: ${v(state.currentStatus)}
- 주요 수치: ${v(state.keyData)}
- 이슈/문제점: ${v(state.issues)}
- 검토안/대안: ${v(state.alternatives)}
- 기대효과: ${v(state.expectedEffect)}
- 실행계획: ${v(state.actionPlan)}
- 비용/예산: ${v(state.budget)}
- 첨부자료: ${v(state.attachmentList)}

[작성 기준]
1. 보고서는 결재용 기안문이 아니라 검토·공유용 문서로 작성한다.
2. 결재선, 문서번호, 보존년한, 문서보안 항목은 넣지 않는다.
3. 도입문 "아래와 같이 ~하고자 합니다."는 사용하지 않는다.
4. 목차는 사안에 맞게 구성하되, 기본 흐름은 핵심 과제 → 현황 분석 → 검토 의견 → 실행 제안 → 기대효과 순서로 한다.
5. 항목 마커는 ㅇ → - → ㆍ 순서를 기본으로 한다.
6. 수치성 내용은 표로 정리한다.
7. 문장은 짧고 보고용 문체로 작성한다.
8. 마지막 단어에 한글자 띄고 끝. 으로 마무리한다.
9. 입력되지 않은 사실은 임의로 만들지 말고 "직접 입력"으로 표시한다.
10. 마지막에 보고서에 붙이면 좋은 첨부자료를 추천한다.
11. 원본 자료의 사실관계는 임의로 변경하지 말 것.
12. 보고서 작성 시 PDCA(Plan-Do-Check-Act) 사이클과 5W3H(Who·What·When·Where·Why·How·How much·How many) 원칙을 적용하여 논리적 흐름과 구체성을 갖춰 작성한다.

[추천 목차]
${toc}

[결과물]
1. 보고서 제목
2. 보고서 목차
3. 본문 초안
4. 표 정리
5. 첨부자료 추천
6. 후속 품의 전환 시 필요한 확인사항`;

  return prompt;
}
