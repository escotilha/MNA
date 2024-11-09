export interface CompanyOverview {
  projectName: string;
  yearFounded: number;
  location: string;
}

export interface FinancialMetrics {
  grossRevenue: number;
  ebitda: number;
}

export interface HistoricalData {
  year: number;
  metrics: FinancialMetrics;
}

export interface ProjectionData {
  year: number;
  metrics: FinancialMetrics;
}

export interface KPIs {
  recurringRevenue: number;
  cashConversionRate: number;
  employeeCount: number;
  churnRate: number;
}

export interface AcquisitionSchedule {
  year: number;
  percentage: number;
}

export interface DealStructure {
  multiplePaid: number;
  exitMultiple: number;
  acquisitionSchedule: AcquisitionSchedule[];
}

export interface FinancingDetails {
  cashComponent: number;
  stockComponent: number;
  interestRate: number;
  termYears: number;
}

export interface AnalysisFormData {
  companyOverview: CompanyOverview;
  historicalData: HistoricalData[];
  projectionData: ProjectionData[];
  kpis: KPIs;
  dealStructure: DealStructure;
  financingDetails: FinancingDetails;
}

export interface ReturnMetrics {
  irr: number;
  moic: number;
}

export interface AnalysisResults {
  valuation: number;
  debtService: number[];
  cashFlowGeneration: number[];
  netCashPosition: number;
  returnMetrics: ReturnMetrics;
  firstYearEbitda?: number;
  debtComponent?: number;
  projectedEbitda: number[];
  cashConversionRate: number;
  acquisitionSchedule: AcquisitionSchedule[];
}