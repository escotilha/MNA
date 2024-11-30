export interface CompanyOverview {
  projectName: string;
  yearFounded: number;
  location: string;
  industry: string;
  cashConversionRate: number;
}

export interface FinancialMetrics {
  grossRevenue: number;
  ebitda: number;
}

export interface LTMMetrics {
  metrics: FinancialMetrics;
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
  percentage: number;
}

export interface DealStructure {
  multiplePaid: number;
  exitMultiple: number;
  acquisitionSchedule: AcquisitionSchedule[];
}

export interface FinancingDetails {
  cashComponent: number;
  debtComponent: number;
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
  monthlyPayment: number;
  annualPayment: number;
  totalInterest: number;
  totalPayment: number;
  yearlyPayments: number[];
  schedule: Array<{
    year: number;
    payment: number;
    interest: number;
    principal: number;
    remainingBalance: number;
  }>;
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
  dealStructure: {
    exitMultiple: number;
    equityComponent: number;
    debtComponent: number;
    multiplePaid: number;
    discountRate: number;
  };
  acquisitionSchedule: AcquisitionSchedule[];
  returnMetrics: ReturnMetrics;
  riskMetrics: {
    debtServiceCoverage: number;
    interestCoverage: number;
    debtToEbitda: number;
  };
  npv: number;
  cashConversionRate: number;
}