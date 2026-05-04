export type DocumentType = 'draft' | 'cooperation' | 'agency_budget';

export type WorkType =
  | 'payment'
  | 'lease_new'
  | 'lease_renewal'
  | 'deposit_return'
  | 'deposit_redeposit'
  | 'construction'
  | 'purchase'
  | 'bid_contract'
  | 'legal_stamp'
  | 'outgoing_letter'
  | 'free_use'
  | 'business_trip'
  | 'trip_report'
  | 'education'
  | 'safety'
  | 'energy_utility'
  | 'general_request';

export type ReportType = 'proposal' | 'review' | 'result' | 'status';

export type AttachmentLevel = '필수' | '권장' | '조건부';

export interface AttachmentItem {
  name: string;
  level: AttachmentLevel;
  reason: string;
  originalRequired?: boolean;
}

export interface WorkTypeInfo {
  id: WorkType;
  label: string;
  docTypes: DocumentType[];
  extraFields: FieldDef[];
}

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
}

// 품의/협조전 기본 공통 필드
export interface DocBaseFields {
  buildingName: string;
  location: string;
  tenantName: string;
  workName: string;
  amountVatExcluded: string;
  amountVatIncluded: string;
  period: string;
  relatedDocs: string;
  reason: string;
  mainContent: string;
  specialNotes: string;
  ownedAttachments: string;
}

// 기안문(대행예산) 추가 필드
export interface AgencyBudgetFields {
  specialAccount: string;
  budgetYear: string;
  fundName: string;
  accountName: string;
  fundAmount: string;
  expenditureType: string;
  costBasis: string;
}

// 협조전 추가 필드
export interface CooperationFields {
  recipient: string;
  reference: string;
  followUpWork: string;
  requestDeadline: string;
  sealType: string;
  sealQuantity: string;
}

// 업무유형별 추가 필드 (동적)
export type WorkTypeFields = Record<string, string>;

// 전체 폼 상태
export interface DocFormState {
  documentType: DocumentType;
  workType: WorkType | '';
  base: DocBaseFields;
  agencyBudget: AgencyBudgetFields;
  cooperation: CooperationFields;
  workTypeFields: WorkTypeFields;
}

// 보고서 폼 상태
export interface ReportFormState {
  reportType: ReportType;
  title: string;
  team: string;
  purpose: string;
  reportTarget: string;
  background: string;
  currentStatus: string;
  keyData: string;
  issues: string;
  alternatives: string;
  expectedEffect: string;
  actionPlan: string;
  budget: string;
  attachmentList: string;
}

export interface ApprovalResult {
  level: string;
  basis: string;
}

export interface AuditResult {
  dailyAudit: boolean;
  inspectorRequired: boolean;
  multipleQuotes: boolean;
  contractTeam: boolean;
}

export interface RetentionResult {
  years: number;
  security: string;
}
