export interface CompanyOverview {
  projectName: string;
  yearFounded: number;
  location: string;
}

export interface FinancialMetrics {
  grossRevenue: number;
  ebitda: number;
}

export interface LTMMetrics extends FinancialMetrics {
  calculatedFrom: {
    startDate: string;
    endDate: string;
  };
}

export interface HistoricalData {
  year: number;
  metrics: FinancialMetrics;
  ltm?: LTMMetrics;
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
  discountRate: number;
}

export interface AnalysisFormData {
  companyOverview: CompanyOverview;
  historicalData: HistoricalData[];
  projectionData: ProjectionData[];
  kpis: KPIs;
  dealStructure: DealStructure;
  financingDetails: FinancingDetails;
}

export interface PaybackPeriodResult {
  years: number;
  isAchieved: boolean;
  remainingBalance?: number;
}

export interface ReturnMetrics {
  irr: number;
  moic: number;
  paybackPeriod: PaybackPeriodResult;
}

export interface DebtServiceResult {
  // Assuming this interface is defined elsewhere, if not, define it here
}

export interface AnalysisResults {
  valuation: number;
  enterpriseValue: number;
  ltmEbitda: number;
  firstYearEbitda: number;
  projectedEbitda: number[];
  cashFlowGeneration: number[];
  debtService: DebtServiceResult;
  netCashPosition: number;
  debtComponent: number;
  cashConversionRate: number;
  acquisitionSchedule: AcquisitionSchedule[];
  returnMetrics: ReturnMetrics;
  dealStructure: {
    exitMultiple: number;
    equityComponent: number;
    debtComponent: number;
    multiplePaid: number;
    discountRate: number;
  };
  riskMetrics: {
    debtServiceCoverage: number;
    interestCoverage: number;
    debtToEbitda: number;
  };
  npv: number;
}