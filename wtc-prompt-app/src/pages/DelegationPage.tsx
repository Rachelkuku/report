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
      // 001
      { id: '001', matter: '팀별 사업계획 수립 — 가. 기본계획', level: '대표이사' },
      { id: '001', matter: '팀별 사업계획 수립 — 나. 세부계획', level: '본부장(실장)' },
      { id: '001', matter: '팀별 세부사업계획 평가·변경', level: '본부장(실장)' },
      // 002
      { id: '002', matter: '팀별 기본예산편성', level: '임원' },
      { id: '002', matter: '수지전망', level: '팀장' },
      { id: '002', matter: '예산 전용 — 가. 항간전용', level: '대표이사' },
      { id: '002', matter: '예산 전용 — 나. 목간전용', level: '본부장(실장)' },
      // 003
      { id: '003', matter: '대정부건의 및 인·허가 신청 — 1. 주요사항', level: '대표이사' },
      { id: '003', matter: '대정부건의 및 인·허가 신청 — 2. 일반사항', level: '본부장(실장)' },
      // 004
      { id: '004', matter: '대외회신·통지·자료제출 — 1. 특히 중요한 사항', level: '대표이사' },
      { id: '004', matter: '대외회신·통지·자료제출 — 2. 주요사항', level: '임원' },
      { id: '004', matter: '대외회신·통지·자료제출 — 3. 일반사항', level: '팀장' },
      { id: '004', matter: '대외회신·통지·자료제출 — 4. 작업지시 등 경미한 사항', level: '담당' },
      // 005
      { id: '005', matter: '총회·이사회 등 특히 중요한 회의 — 가. 계획 및 결과보고', level: '대표이사' },
      { id: '005', matter: '총회·이사회 등 특히 중요한 회의 — 나. 주요 계획의 집행', level: '본부장(실장)' },
      { id: '005', matter: '총회·이사회 등 특히 중요한 회의 — 다. 기타사항(이사회 안건 의뢰 포함)', level: '팀장' },
      { id: '005', matter: '주요회의 및 행사 — 가. 계획 및 결과보고', level: '임원' },
      { id: '005', matter: '주요회의 및 행사 — 나. 주요 계획의 집행', level: '본부장(실장)' },
      { id: '005', matter: '주요회의 및 행사 — 다. 기타사항', level: '팀장' },
      { id: '005', matter: '일반실무회의 및 행사 — 가. 계획 및 결과보고', level: '팀장' },
      { id: '005', matter: '일반실무회의 및 행사 — 나. 기타사항', level: '담당' },
      { id: '005', matter: '팀간 업무협의', level: '팀장' },
      // 006
      { id: '006', matter: '외부회의·행사 참가 — 1. 주요회의 및 행사 (실장·임원 참가)', level: '대표이사' },
      { id: '006', matter: '외부회의·행사 참가 — 2. 일반회의 및 행사 (팀장 참가)', level: '본부장(실장)' },
      { id: '006', matter: '외부회의·행사 참가 — 3. 기타 (팀장 미만 참가)', level: '팀장' },
      // 007
      { id: '007', matter: '문서관리', level: '팀장' },
      // 008
      { id: '008', matter: '팀업무처리 지침의 제정 및 개폐', level: '본부장(실장)' },
      { id: '008', matter: '팀내 개인별 업무분장', level: '팀장' },
      // 009
      { id: '009', matter: '국외출장 — 가. 실장 이상', level: '대표이사' },
      { id: '009', matter: '국외출장 — 나. 팀장 이하', level: '임원' },
      { id: '009', matter: '국내출장 — 가. 실장 이상', level: '대표이사' },
      { id: '009', matter: '국내출장 — 나. 팀장', level: '본부장(실장)' },
      { id: '009', matter: '국내출장 — 다. 팀원', level: '팀장' },
      // 010
      { id: '010', matter: '간행물 — 1. 신규 발간계획', level: '대표이사' },
      { id: '010', matter: '간행물 — 2. 계속 발간계획', level: '본부장(실장)' },
      { id: '010', matter: '발간집행 — 가. 주요사항', level: '팀장' },
      { id: '010', matter: '발간집행 — 나. 일반사항', level: '담당' },
      { id: '010', matter: '발간집행 — 다. 배포 및 기타사항', level: '담당' },
      // 011
      { id: '011', matter: '예산지출 기본품의 (일반) — 1억원 이상', level: '대표이사' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 5천만원 이상 1억원 미만', level: '임원' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 1천만원 이상 5천만원 미만', level: '본부장(실장)' },
      { id: '011', matter: '예산지출 기본품의 (일반) — 1천만원 미만', level: '팀장' },
      { id: '011', matter: '예산지출 기본품의 (제부담금) — 1천만원 이상', level: '대표이사' },
      { id: '011', matter: '예산지출 기본품의 (제부담금) — 500만원 이상 1천만원 미만', level: '임원' },
      { id: '011', matter: '예산지출 기본품의 (제부담금) — 100만원 이상 500만원 미만', level: '본부장(실장)' },
      { id: '011', matter: '예산지출 기본품의 (제부담금) — 100만원 미만', level: '팀장' },
      { id: '011', matter: '지출결의 (전표) — 1억원 이상', level: '대표이사' },
      { id: '011', matter: '지출결의 (전표) — 5천만원 이상 1억원 미만', level: '임원' },
      { id: '011', matter: '지출결의 (전표) — 1천만원 이상 5천만원 미만', level: '본부장(실장)' },
      { id: '011', matter: '지출결의 (전표) — 1천만원 미만', level: '팀장' },
      { id: '011', matter: '공공요금 계산내역 작성보고 / 지출결의 및 납부', level: '팀장' },
      // 012
      { id: '012', matter: '가지급 — 1천만원 이상', level: '대표이사' },
      { id: '012', matter: '가지급 — 500만원 이상 1천만원 미만', level: '임원' },
      { id: '012', matter: '가지급 — 500만원 미만', level: '본부장(실장)' },
      // 013
      { id: '013', matter: '입찰 — 1. 기본방침의 결정 (기본품의)', level: '대표이사' },
      { id: '013', matter: '입찰 — 2. 입찰품의 (기본품의 첨부 시)', level: '본부장(실장)' },
      { id: '013', matter: '예가결정·입찰결과보고 — 1억원 이상', level: '대표이사' },
      { id: '013', matter: '예가결정·입찰결과보고 — 1억원 미만', level: '임원' },
      // 014
      { id: '014', matter: '소송 처리방침결정·결과보고 — 가. 주요사항', level: '대표이사' },
      { id: '014', matter: '소송 처리방침결정·결과보고 — 나. 일반사항 (소액심판관련 등)', level: '본부장(실장)' },
      { id: '014', matter: '소송 실무집행 — 가. 주요사항', level: '본부장(실장)' },
      { id: '014', matter: '소송 실무집행 — 나. 일반사항 (소액심판관련 등)', level: '팀장' },
      { id: '014', matter: '명도소송', level: '대표이사' },
      // 015
      { id: '015', matter: '제반사고 — 1. 처리방침의 결정 및 결과보고', level: '대표이사' },
      { id: '015', matter: '제반사고 실무집행 — 가. 주요사항', level: '본부장(실장)' },
      { id: '015', matter: '제반사고 실무집행 — 나. 일반사항', level: '팀장' },
      // 016
      { id: '016', matter: '1. 대외교육 참가 및 결과보고', level: '임원' },
      { id: '016', matter: '대내교육 — 가. 전직원 교육', level: '임원' },
      { id: '016', matter: '대내교육 — 나. 실단위의 교육', level: '본부장(실장)' },
      { id: '016', matter: '대내교육 — 다. 팀단위의 교육', level: '팀장' },
      // 017
      { id: '017', matter: '청원계 — 가. 실 장', level: '대표이사' },
      { id: '017', matter: '청원계 — 나. 팀 장', level: '본부장(실장)' },
      { id: '017', matter: '청원계 — 다. 팀 원', level: '팀장' },
      { id: '017', matter: '특근신청 및 확인', level: '본부장(실장)' },
      // 018
      { id: '018', matter: '1. 제증명의 발급', level: '담당' },
      { id: '018', matter: '2. 사무용 소모품', level: '담당' },
      { id: '018', matter: '3. 팀간 업무연락 및 통보', level: '팀장' },
      { id: '018', matter: '4. 통신수단과 교통편 (시외 및 국제전화 등)', level: '담당' },
      { id: '018', matter: '5. 소관 팀내 집기·비품·용품·도서관리', level: '팀장' },
      { id: '018', matter: '6. 소관 팀내 임원실·탕비실·창고 등 관리', level: '팀장' },
      // 019
      { id: '019', matter: '자문·용역 — 가. 소요판단 및 계약체결', level: '임원' },
      { id: '019', matter: '자문·용역 — 나. 운용관리', level: '팀장' },
      { id: '019', matter: '일시소요인원 — 가. 소요판단 및 계약체결', level: '본부장(실장)' },
      { id: '019', matter: '일시소요인원 — 나. 운용관리', level: '담당' },
    ],
  },
  {
    label: '오피스 임대관리',
    color: 'blue',
    items: [
      { id: '020', matter: '오피스 임대정책 수립 (인상률·할인율·렌트프리 등)', level: '대표이사' },
      { id: '021', matter: '임차인 계약 — 정책범위 내, A/T 600평↑ T/T 100평↑', level: '본부장(실장)' },
      { id: '021', matter: '임차인 계약 — 정책범위 내, A/T 600평↓ T/T 100평↓', level: '팀장' },
      { id: '021', matter: '임차인 계약 — 정책범위 외', level: '대표이사' },
      { id: '021', matter: '계약 해지·정산 — 정책범위 내', level: '팀장' },
      { id: '021', matter: '계약 해지·정산 — 정책범위 외', level: '대표이사' },
      { id: '022', matter: '미수로 인한 명도 소송', level: '대표이사' },
      { id: '022', matter: '미수금 독촉 공문 발송', level: '팀장' },
      { id: '022', matter: '임관리비 고지 및 수입 정산', level: '팀장' },
    ],
  },
  {
    label: '대행임대자산 관리',
    color: 'purple',
    items: [
      { id: '030', matter: '대행오피스 — 1. 계약 체결 및 변경', level: '대표이사' },
      { id: '030', matter: '대행오피스 — 2. 임대료 인상율 결정', level: '대표이사' },
      { id: '030', matter: '대행오피스 — 3. 임차인 유치조건 조정', level: '본부장(실장)' },
      { id: '030', matter: '대행오피스 — 4. 일상 계약관리', level: '본부장(실장)' },
      { id: '031', matter: '대행오피스 마케팅·소송 — 1. 소송 등 주요사항', level: '대표이사' },
      { id: '031', matter: '대행오피스 마케팅·소송 — 2. 마케팅 주요사항', level: '본부장(실장)' },
      { id: '031', matter: '대행오피스 마케팅·소송 — 3. 일반 사항', level: '본부장(실장)' },
      { id: '032', matter: '대행창고 — 1. 계약 체결 및 변경', level: '대표이사' },
      { id: '032', matter: '대행창고 — 2. 임대료 인상율 결정', level: '대표이사' },
      { id: '032', matter: '대행창고 — 3. 일상 계약관리', level: '본부장(실장)' },
      { id: '033', matter: '직영창고 — 1. 계약 체결 및 변경', level: '본부장(실장)' },
      { id: '033', matter: '직영창고 — 2. 계약관리·고지관리·채권관리', level: '본부장(실장)' },
      { id: '033', matter: '직영창고 — 3. 일반 운영', level: '본부장(실장)' },
      { id: '033', matter: '직영창고 — 4. 자가사용창고', level: '본부장(실장)' },
      { id: '034', matter: '부대시설 — 1. 계약 체결 및 변경', level: '본부장(실장)' },
      { id: '034', matter: '부대시설 — 2. 계약관리·고지관리·채권관리', level: '본부장(실장)' },
      { id: '034', matter: '부대시설 — 3. 일반 운영', level: '본부장(실장)' },
    ],
  },
  {
    label: '마스터리스·직영자산',
    color: 'indigo',
    items: [
      { id: '041', matter: '1. 임차인 선정 및 계약', level: '대표이사' },
      { id: '041', matter: '2. 재계약 체결 및 임대료 조정', level: '대표이사' },
      { id: '041', matter: '임관리비·보증금 — 가. 임관리비 부과', level: '팀장' },
      { id: '041', matter: '임관리비·보증금 — 나. 임관리비 및 보증금 조정', level: '대표이사' },
      { id: '041', matter: '임관리비·보증금 — 다. 보증금 환불', level: '본부장(실장)' },
      { id: '041', matter: '계약이행관리 (1) 주요사항', level: '임원' },
      { id: '041', matter: '계약이행관리 (1) 일반사항', level: '팀장' },
      { id: '041', matter: '계약이행관리 (2) 주요사항', level: '임원' },
      { id: '041', matter: '계약이행관리 (2) 일반사항', level: '팀장' },
      { id: '041', matter: '계약이행관리 (3) 주요사항', level: '임원' },
      { id: '041', matter: '계약이행관리 (3) 일반사항', level: '팀장' },
      { id: '041', matter: '6. 계약해지 및 정산', level: '대표이사' },
      { id: '041', matter: '공용공간·시설관리 — 주요사항', level: '임원' },
      { id: '041', matter: '공용공간·시설관리 — 일반사항', level: '본부장(실장)' },
      { id: '042', matter: '대내외 교신·유관기관 협조 — 1. 주요사항', level: '임원' },
      { id: '042', matter: '대내외 교신·유관기관 협조 — 2. 일반사항', level: '팀장' },
    ],
  },
  {
    label: '시설운영',
    color: 'emerald',
    items: [
      { id: '051', matter: '설비운영관리 — 1. 계획 수립', level: '대표이사' },
      { id: '051', matter: '설비운영관리 — 2. 운영관리', level: '팀장' },
      { id: '051', matter: '설비운영관리 — 3. 이상조치', level: '팀장' },
      { id: '051', matter: '설비운영관리 — 4. 결과관리', level: '본부장(실장)' },
      { id: '052', matter: '협력업체 — 1. 업체관리계획 수립', level: '팀장' },
      { id: '052', matter: '협력업체 계약 — 가. 주요계약', level: '대표이사' },
      { id: '052', matter: '협력업체 계약 — 나. 일반계약', level: '임원' },
      { id: '052', matter: '협력업체 — 3. 운영관리', level: '팀장' },
      { id: '052', matter: '협력업체 — 4. 이상조치대책 수립', level: '본부장(실장)' },
      { id: '052', matter: '협력업체 — 5. 사후관리', level: '팀장' },
      { id: '053', matter: '민원 — 1. 민원접수', level: '담당' },
      { id: '053', matter: '민원 — 2. 민원처리', level: '담당' },
      { id: '053', matter: '민원 — 3. 보고 및 사후관리', level: '본부장(실장)' },
      { id: '054', matter: '행사지원 — 1. 행사접수', level: '담당' },
      { id: '054', matter: '행사지원 — 2. 기술지원', level: '담당' },
      { id: '054', matter: '행사지원 — 3. 행사운영관리', level: '담당' },
      { id: '054', matter: '행사지원 — 4. 정산 및 사후관리', level: '팀장' },
      { id: '055', matter: '재해관리 — 1. 재해관리계획 수립', level: '대표이사' },
      { id: '055', matter: '재해관리 — 2. 교육시행', level: '담당' },
      { id: '055', matter: '재해관리 — 3. 설비 합동점검', level: '본부장(실장)' },
      { id: '055', matter: '재해관리 — 4. 특별점검', level: '본부장(실장)' },
      { id: '055', matter: '재해관리 — 5. 분석 및 결과관리', level: '대표이사' },
      { id: '056', matter: 'BeMS — 1. 시설관리운영', level: '팀장' },
      { id: '056', matter: 'BeMS — 2. 에너지 관리 처리', level: '팀장' },
      { id: '056', matter: 'BeMS — 3. 관리비 예산관리 처리', level: '팀장' },
      { id: '056', matter: 'BeMS — 4. 공사용역관리 처리', level: '팀장' },
      { id: '056', matter: 'BeMS — 5. 민원처리', level: '팀장' },
      { id: '056', matter: 'BeMS — 6. 결과보고 및 업그레이드', level: '본부장(실장)' },
      { id: '057', matter: '통신 — 가. 주요사항', level: '본부장(실장)' },
      { id: '057', matter: '통신 — 나. 일반사항', level: '팀장' },
      { id: '057', matter: '통신 — 2. 행사지원', level: '팀장' },
      { id: '057', matter: '통신 — 3. 통신시설 변경', level: '대표이사' },
      { id: '057', matter: '통신 — 4. 수수료 및 보상금 정산', level: '본부장(실장)' },
      { id: '058', matter: '그린경영(친환경) — 1. 주요사항', level: '대표이사' },
      { id: '058', matter: '그린경영(친환경) — 2. 일반사항', level: '본부장(실장)' },
    ],
  },
  {
    label: '기술지원',
    color: 'cyan',
    items: [
      { id: '061', matter: '공사관리 — 1. 공사관리', level: '담당' },
      { id: '061', matter: '공사관리 — 2. 준공관리', level: '본부장(실장)' },
      { id: '061', matter: '공사관리 — 3. 사후관리', level: '팀장' },
      { id: '062', matter: '자재 — 1. 구매검토', level: '팀장' },
      { id: '062', matter: '자재 — 2. 검수 및 입출고', level: '팀장' },
      { id: '062', matter: '자재 — 3. 창고관리', level: '팀장' },
      { id: '062', matter: '자재 — 4. 재고조사', level: '팀장' },
      { id: '062', matter: '자재 — 5. 불용품관리', level: '팀장' },
      { id: '063', matter: '운영예산 — 1. 관리계획 수립', level: '대표이사' },
      { id: '063', matter: '운영예산 — 2. 에너지 관리', level: '본부장(실장)' },
      { id: '063', matter: '운영예산 — 3. 관리비예산 수립 및 정산', level: '팀장' },
      { id: '063', matter: '운영예산 — 4. 에너지목표관리제 운영', level: '대표이사' },
      { id: '063', matter: '운영예산 — 5. 탄소배출권거래제 운영', level: '본부장(실장)' },
      { id: '064', matter: '조경 — 1. 조경관리계획 승인', level: '본부장(실장)' },
      { id: '064', matter: '조경 — 2. 작업시행', level: '담당' },
      { id: '064', matter: '조경 — 3. 점검 및 평가', level: '본부장(실장)' },
      { id: '065', matter: '설비운영관리 — 1. 계획 수립', level: '대표이사' },
      { id: '065', matter: '설비운영관리 — 2. 운영관리', level: '팀장' },
      { id: '065', matter: '설비운영관리 — 3. 이상조치', level: '팀장' },
      { id: '065', matter: '설비운영관리 — 4. 결과관리', level: '본부장(실장)' },
      { id: '066', matter: '협력업체 — 1. 업체관리계획 수립', level: '팀장' },
      { id: '066', matter: '협력업체 계약 — 가. 주요계약', level: '대표이사' },
      { id: '066', matter: '협력업체 계약 — 나. 일반계약', level: '임원' },
      { id: '066', matter: '협력업체 — 3. 운영관리', level: '팀장' },
      { id: '066', matter: '협력업체 — 4. 이상조치대책 수립', level: '본부장(실장)' },
      { id: '066', matter: '협력업체 — 5. 사후관리', level: '팀장' },
      { id: '067', matter: '행사지원 — 1. 행사접수', level: '담당' },
      { id: '067', matter: '행사지원 — 2. 기술지원', level: '담당' },
      { id: '067', matter: '행사지원 — 3. 행사운영관리', level: '담당' },
      { id: '067', matter: '행사지원 — 4. 정산 및 사후관리', level: '팀장' },
      { id: '068', matter: '재해관리 — 1. 재해관리계획 수립', level: '대표이사' },
      { id: '068', matter: '재해관리 — 2. 교육시행', level: '담당' },
      { id: '068', matter: '재해관리 — 3. 설비 합동점검', level: '본부장(실장)' },
      { id: '068', matter: '재해관리 — 4. 특별점검', level: '본부장(실장)' },
      { id: '068', matter: '재해관리 — 5. 분석 및 결과관리', level: '임원' },
      { id: '069', matter: 'Signage/안내물 — 1. 설치승인', level: '임원' },
      { id: '069', matter: 'Signage/안내물 — 2. 사용점검', level: '팀장' },
      { id: '069', matter: 'Signage/안내물 — 3. 운영 평가', level: '본부장(실장)' },
    ],
  },
  {
    label: '센터관리',
    color: 'sky',
    items: [
      { id: '070', matter: '미화 — 1. 미화관리계획 승인', level: '본부장(실장)' },
      { id: '070', matter: '미화 — 2. 작업시행', level: '담당' },
      { id: '070', matter: '미화 — 3. 점검', level: '팀장' },
      { id: '070', matter: '미화 — 4. 평가', level: '본부장(실장)' },
      { id: '071', matter: '주차장 운영점검 — 가. 주요사항', level: '대표이사' },
      { id: '071', matter: '주차장 운영점검 — 나. 일반사항', level: '팀장' },
      { id: '071', matter: '주차장 — 2. 매출확인 및 관리', level: '본부장(실장)' },
      { id: '071', matter: '주차장 — 3. 임대료 정산', level: '본부장(실장)' },
      { id: '071', matter: '주차장 — 4. 용역비 지급', level: '팀장' },
    ],
  },
  {
    label: '안전관리',
    color: 'red',
    items: [
      { id: '081', matter: '안전관리 — 1. 안전관리계획 수립', level: '대표이사' },
      { id: '081', matter: '안전관리 — 2. 협력업체 선정', level: '대표이사' },
      { id: '081', matter: '안전관리 — 3. 운영관리', level: '본부장(실장)' },
      { id: '081', matter: '안전관리 — 4. 용역비 지급', level: '팀장' },
      { id: '082', matter: '비상사태 — 1. 접수 및 확인', level: '대표이사' },
      { id: '082', matter: '비상사태 — 2. 비상대책반 구성', level: '임원' },
      { id: '082', matter: '비상사태 — 3. 처리결과 확인', level: '대표이사' },
      { id: '083', matter: '키관리 — 1. 마스터키 관리', level: '팀장' },
      { id: '083', matter: '키관리 — 2. 일반키 관리', level: '담당' },
      { id: '083', matter: '키관리 — 3. 입주사 설치키 관리', level: '담당' },
      { id: '084', matter: '만국기 — 1. 관리계획 수립', level: '팀장' },
      { id: '084', matter: '만국기 — 2. 만국기 제작', level: '팀장' },
      { id: '084', matter: '만국기 — 3. 운영관리', level: '담당' },
      { id: '085', matter: '민방위 — 1. 훈련지침 수령', level: '팀장' },
      { id: '085', matter: '민방위 — 2. 훈련실시', level: '팀장' },
      { id: '085', matter: '민방위 — 3. 결과보고', level: '본부장(실장)' },
      { id: '086', matter: '안내운영 — 1. 협력업체 선정', level: '대표이사' },
      { id: '086', matter: '안내운영 — 2. 운영관리', level: '팀장' },
      { id: '086', matter: '안내운영 — 3. 용역비 지급', level: '팀장' },
    ],
  },
  {
    label: '경영기획·회계',
    color: 'violet',
    items: [
      { id: '091', matter: '주주총회·이사회 — 1. 의안의 결정 및 소집', level: '대표이사' },
      { id: '091', matter: '주주총회·이사회 — 2. 의사록의 작성', level: '임원' },
      { id: '091', matter: '주주총회·이사회 — 3. 결의사항의 공증 및 등기', level: '본부장(실장)' },
      { id: '092', matter: '성과평가 — 1. 계획 수립', level: '대표이사' },
      { id: '092', matter: '성과평가 — 2. 평가시행', level: '본부장(실장)' },
      { id: '092', matter: '성과평가 — 3. 평가결과 확정', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 — 1. 편성지침', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 — 2. 확정', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 변경 — 가. 주요사항', level: '대표이사' },
      { id: '093', matter: '사업계획·예산 변경 — 나. 기타사항', level: '본부장(실장)' },
      { id: '093', matter: '추가경정예산 및 예비비 사용', level: '대표이사' },
      { id: '094', matter: '제규정 관리 — 가. 정관·규정·요령', level: '대표이사' },
      { id: '094', matter: '제규정 관리 — 나. 세칙', level: '임원' },
      { id: '094', matter: '제규정 관리 — 다. 매뉴얼', level: '본부장(실장)' },
      { id: '094', matter: '구본폐기 및 식별', level: '본부장(실장)' },
      { id: '095', matter: '품질 평가 — 1. 평가계획 수립', level: '대표이사' },
      { id: '095', matter: '품질 평가 — 2. 평가실시 및 결과보고', level: '대표이사' },
      { id: '096', matter: '상표권·도메인 — 1. 출원/등록/등록갱신', level: '임원' },
      { id: '096', matter: '상표권·도메인 — 2. 사용권 설정계약 체결', level: '대표이사' },
      { id: '096', matter: '상표권 분쟁 — 가. 주요사항', level: '대표이사' },
      { id: '096', matter: '상표권 분쟁 — 나. 일반사항', level: '본부장(실장)' },
      { id: '097', matter: '업무보고·회의 — 1. 주간업무보고', level: '팀장' },
      { id: '097', matter: '업무보고·회의 — 2. 제회의 운영', level: '본부장(실장)' },
      { id: '097', matter: '유관기관 협력 — 가. 주요사항', level: '대표이사' },
      { id: '097', matter: '유관기관 협력 — 나. 일반사항', level: '본부장(실장)' },
      { id: '098', matter: '1. 조직개편 및 부서별 업무분장', level: '대표이사' },
      { id: '098', matter: '2. 직무분석 및 정원조정', level: '대표이사' },
      { id: '099', matter: '업무개선 — 1. 주요사항', level: '대표이사' },
      { id: '099', matter: '업무개선 — 2. 일반사항', level: '본부장(실장)' },
      { id: '100', matter: '사업실적보고 — 1. 연간사업실적', level: '대표이사' },
      { id: '100', matter: '사업실적보고 — 2. 기별 분석', level: '대표이사' },
      { id: '100', matter: '사업실적보고 — 3. 기타 업무보고', level: '팀장' },
      { id: '101', matter: '재무회계 — 1. 법인결산', level: '대표이사' },
      { id: '101', matter: '재무회계 — 2. 월말회계보고', level: '대표이사' },
      { id: '101', matter: '재무회계 — 3. 전표에 관한 사항', level: '팀장' },
      { id: '102', matter: '세무 — 1. 법인세 세무조정계산 및 신고납부', level: '대표이사' },
      { id: '102', matter: '세무 — 2. 원천세·부가세 등 계산 및 신고납부', level: '팀장' },
      { id: '102', matter: '세무 — 3. 수입인지의 구입 및 불출', level: '팀장' },
      { id: '102', matter: '세무 — 4. 교통유발부담금 등 제부담금 계산납부', level: '팀장' },
      { id: '102', matter: '세무 — 5. 세금계산서의 발행', level: '담당' },
      { id: '102', matter: '세무 — 6. 주요세무자료의 보고', level: '본부장(실장)' },
      { id: '102', matter: '세무 — 7. 근로소득연말정산 및 신고', level: '팀장' },
      { id: '102', matter: '세무 — 8. 지방세 납부', level: '본부장(실장)' },
      { id: '103', matter: '자금운용 — 가. 기본계획의 수립', level: '대표이사' },
      { id: '103', matter: '자금운용 — 나. 기본계획에 따른 운용', level: '본부장(실장)' },
      { id: '103', matter: '자금운용 — 2. 입출금 관리', level: '팀장' },
      { id: '103', matter: '자금운용 — 3. 주식의 발행', level: '대표이사' },
      { id: '104', matter: '감사관련 전결처리 — 1. 주요사항', level: '본부장(실장)' },
      { id: '104', matter: '감사관련 전결처리 — 2. 일반사항', level: '팀장' },
    ],
  },
  {
    label: '인사총무',
    color: 'pink',
    items: [
      { id: '110', matter: '직원 채용·승진·퇴직 — 가. 정규직원', level: '대표이사' },
      { id: '110', matter: '직원 채용·승진·퇴직 — 나. 계약직 직원', level: '임원' },
      { id: '110', matter: '2. 직원의 특별승급', level: '대표이사' },
      { id: '110', matter: '3. 직원의 이동·휴직·복직·파견', level: '대표이사' },
      { id: '110', matter: '4. 포상 및 표창', level: '대표이사' },
      { id: '110', matter: '5. 징 계', level: '대표이사' },
      { id: '110', matter: '교육 — 가. 연간교육계획 수립', level: '대표이사' },
      { id: '110', matter: '교육 — 나. 개별교육계획 수립', level: '본부장(실장)' },
      { id: '110', matter: '교육 — 다. 교육실시', level: '팀장' },
      { id: '110', matter: '교육 — 라. 결과평가 및 보고', level: '본부장(실장)' },
      { id: '110', matter: '직원연수 — (1) 해외연수', level: '대표이사' },
      { id: '110', matter: '직원연수 — (2) 국내연수', level: '임원' },
      { id: '110', matter: '7. 인사위원회의 운영에 관한 사항', level: '본부장(실장)' },
      { id: '110', matter: '복무 — 가. 인원일보', level: '팀장' },
      { id: '110', matter: '복무 — 나. 휴가·결근·조퇴', level: '팀장' },
      { id: '110', matter: '복무 — 다. 특근명령 및 확인', level: '팀장' },
      { id: '110', matter: '역량평가 — 가. 평가계획 수립', level: '대표이사' },
      { id: '110', matter: '역량평가 — 나. 평가실시', level: '본부장(실장)' },
      { id: '110', matter: '역량평가 — 다. 평가등급 조정 및 확정', level: '대표이사' },
      { id: '110', matter: '역량평가 — 라. 평가결과 반영', level: '팀장' },
      { id: '110', matter: '채용정원관리 — 가. 주요사항', level: '대표이사' },
      { id: '110', matter: '채용정원관리 — 나. 일반사항', level: '팀장' },
      { id: '111', matter: '1. 월급여·정기상여금·퇴직금 지급', level: '본부장(실장)' },
      { id: '111', matter: '2. 특별상여금 지급', level: '대표이사' },
      { id: '112', matter: '복리후생 — 1. 4대 보험에 관한 사항', level: '팀장' },
      { id: '112', matter: '복리후생 — 2. 연월차보상비 계산', level: '본부장(실장)' },
      { id: '112', matter: '복리후생 — 3. 출퇴근대책비 계산 지급', level: '팀장' },
      { id: '112', matter: '복리후생 — 4. 학자보조금 계산 지급', level: '팀장' },
      { id: '112', matter: '복리후생 — 5. 하계휴양대책 수립 시행', level: '팀장' },
      { id: '112', matter: '복리후생 — 6. 주택자금융자', level: '본부장(실장)' },
      { id: '112', matter: '복리후생 — 7. 직원 건강관리에 관한 사항', level: '본부장(실장)' },
      { id: '112', matter: '기타 복리후생 — 가. 주요사항', level: '대표이사' },
      { id: '112', matter: '기타 복리후생 — 나. 일반사항', level: '본부장(실장)' },
      { id: '113', matter: '문서관리 — 1. 내외공문 발신·수신·분류', level: '팀장' },
      { id: '113', matter: '문서관리 — 2. 문서의 보존기간 분류', level: '팀장' },
      { id: '113', matter: '문서관리 — 3. 문서철의 관리보관', level: '팀장' },
      { id: '113', matter: '문서관리 — 4. 문서의 이관', level: '팀장' },
      { id: '113', matter: '문서관리 — 5. 문서의 폐기', level: '본부장(실장)' },
      { id: '113', matter: '문서관리 — 6. 문서창고 관리', level: '팀장' },
      { id: '114', matter: '1. 인감증명·등기부등본의 관리 및 수불', level: '팀장' },
      { id: '114', matter: '법인인감 — 가. 등록 및 개폐', level: '본부장(실장)' },
      { id: '114', matter: '법인인감 — 나. 보관 및 날인', level: '팀장' },
      { id: '115', matter: '일반서무 — 1. 사무실 관리', level: '팀장' },
      { id: '115', matter: '일반서무 — 2. 통신관리', level: '팀장' },
      { id: '115', matter: '일반서무 — 3. 차량운행관리', level: '담당' },
      { id: '115', matter: '일반서무 — 4. 자가운전승인', level: '팀장' },
      { id: '115', matter: '일반서무 기타 — 가. 주요사항', level: '본부장(실장)' },
      { id: '115', matter: '일반서무 기타 — 나. 일반사항', level: '팀장' },
      { id: '116', matter: '자산관리 — 1. 기본방침의 결정', level: '대표이사' },
      { id: '116', matter: '자산세부집행 — 가. 주요사항', level: '본부장(실장)' },
      { id: '116', matter: '자산세부집행 — 나. 일반사항', level: '팀장' },
      { id: '116', matter: '자산 취득·처분 — 2억원 이상', level: '대표이사' },
      { id: '116', matter: '자산 취득·처분 — 5천만원 이상 2억원 미만', level: '임원' },
      { id: '116', matter: '자산 취득·처분 — 1천만원 이상 5천만원 미만', level: '본부장(실장)' },
      { id: '116', matter: '자산 취득·처분 — 1천만원 미만', level: '팀장' },
      { id: '116', matter: '4. 자산대장의 기록관리', level: '팀장' },
      { id: '116', matter: '5. 부외자산의 관리', level: '팀장' },
      { id: '116', matter: '6. 자산의 외부대여', level: '본부장(실장)' },
      { id: '116', matter: '7. 자산의 수선·유지보수', level: '본부장(실장)' },
      { id: '116', matter: '8. 재물조사의 실시 및 보고', level: '본부장(실장)' },
      { id: '117', matter: '보험부보 — 2억원 이상', level: '대표이사' },
      { id: '117', matter: '보험부보 — 5천만원 이상 2억원 미만', level: '임원' },
      { id: '117', matter: '보험부보 — 1천만원 이상 5천만원 미만', level: '본부장(실장)' },
      { id: '117', matter: '보험부보 — 1천만원 미만', level: '팀장' },
      { id: '118', matter: '의무실 운영에 관한 사항', level: '팀장' },
      { id: '119', matter: '1. 전도자금의 운용', level: '팀장' },
      { id: '119', matter: '2. 사무용품의 구입 및 불출', level: '팀장' },
      { id: '119', matter: '3. 제계약의 일반관리', level: '팀장' },
    ],
  },
  {
    label: '감사',
    color: 'amber',
    items: [
      { id: '120', matter: '감사 — 1. 감사계획 및 감사결과 보고', level: '대표이사' },
      { id: '120', matter: '감사 — 2. 감사업무수행에 관련된 사항', level: '임원' },
      { id: '120', matter: '감사 — 3. 기타사항', level: '본부장(실장)' },
      { id: '121', matter: '전결사항 처리 — 1. 실장·임원결재 및 전결사항', level: '임원' },
      { id: '121', matter: '전결사항 처리 — 2. 팀장 전결사항', level: '본부장(실장)' },
      { id: '122', matter: '기타 감사사항 — 1. 주요사항', level: '임원' },
      { id: '122', matter: '기타 감사사항 — 2. 기타사항', level: '본부장(실장)' },
    ],
  },
  {
    label: '신규사업',
    color: 'lime',
    items: [
      { id: '130', matter: '신규사업 운영 — 1. 주요 계획 수립', level: '대표이사' },
      { id: '130', matter: '신규사업 운영 — 가. 주요사항', level: '임원' },
      { id: '130', matter: '신규사업 운영 — 나. 일반사항', level: '팀장' },
      { id: '130', matter: '신규사업 협력업체 — 가. 주요계약', level: '대표이사' },
      { id: '130', matter: '신규사업 협력업체 — 나. 일반계약', level: '본부장(실장)' },
      { id: '130', matter: '신규사업 보고 — 가. 주요사항', level: '본부장(실장)' },
      { id: '130', matter: '신규사업 보고 — 나. 일반사항', level: '팀장' },
      { id: '131', matter: '신규사업 개발 — 1. 사업 모델 도출', level: '팀장' },
      { id: '131', matter: '신규사업 개발 — 2. 사업 타당성 검토', level: '본부장(실장)' },
      { id: '131', matter: '신규사업 개발 — 3. 사업계획 수립', level: '임원' },
      { id: '131', matter: '신규사업 개발 — 4. 사업자 선정', level: '대표이사' },
      { id: '132', matter: '신규사업 기타 — 1. 주요사항', level: '대표이사' },
      { id: '132', matter: '신규사업 기타 — 2. 일반사항', level: '팀장' },
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
