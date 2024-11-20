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
  date: string;
  milestone: string;
  amount: number;
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

export interface AnalysisResults {
  valuation: number;
  firstYearEbitda: number;
  projectedEbitda: number[];
  cashFlowGeneration: number[];
  debtService: number[];
  netCashPosition: number;
  debtComponent: number;
  cashConversionRate: number;
  acquisitionSchedule: AcquisitionSchedule[];
  returnMetrics: {
    irr: number;
    moic: number;
    paybackPeriod: number;
  };
  dealStructure: {
    exitMultiple: number;
    equityComponent: number;
    debtComponent: number;
  };
  riskMetrics: {
    debtServiceCoverage: number;
    interestCoverage: number;
    leverageRatio: number;
  };
}