/**
 * Core financial calculations for M&A analysis
 * All financial numbers are in thousands
 */

/** 
 * Custom error class for financial calculations
 */
export class FinancialCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinancialCalculationError';
  }
}

/**
 * Input validation utilities
 */
const validators = {
  isPositive: (value: number, fieldName: string): void => {
    if (!Number.isFinite(value) || value <= 0) {
      throw new FinancialCalculationError(`${fieldName} must be a positive finite number`);
    }
  },
  isValidRate: (value: number, fieldName: string): void => {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new FinancialCalculationError(`${fieldName} must be a finite number between 0 and 100`);
    }
  },
  isValidArray: (arr: number[], fieldName: string): void => {
    if (!Array.isArray(arr) || arr.length === 0) {
      throw new FinancialCalculationError(`${fieldName} must be a non-empty array`);
    }
    arr.forEach((value, index) => {
      if (!Number.isFinite(value)) {
        throw new FinancialCalculationError(`${fieldName}[${index}] must be a finite number`);
      }
    });
  }
};

/**
 * Calculate enterprise value based on EBITDA and multiple
 * @param ebitda - EBITDA in thousands
 * @param multiple - Valuation multiple
 * @returns Enterprise value in thousands
 */
export function calculateValuation(ebitda: number, multiple: number): number {
  validators.isPositive(ebitda, 'EBITDA');
  validators.isPositive(multiple, 'Multiple');
  
  // Both EBITDA and result are in thousands
  return Number((ebitda * multiple).toFixed(2));
}

interface DebtServiceResult {
  yearlyPayments: number[];  // in thousands
  totalInterest: number;     // in thousands
  totalPayment: number;      // in thousands
}

/**
 * Calculate debt service payments and related metrics
 * @param principal - Loan principal amount in thousands
 * @param interestRate - Annual interest rate (percentage)
 * @param termYears - Loan term in years
 * @returns Object containing yearly payments and summary metrics (all in thousands)
 */
export function calculateDebtService(
  principal: number,
  interestRate: number,
  termYears: number
): DebtServiceResult {
  validators.isPositive(principal, 'Principal');
  validators.isValidRate(interestRate, 'Interest rate');
  validators.isPositive(termYears, 'Term years');

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = termYears * 12;
  
  // Calculate monthly payment (in thousands)
  const monthlyPayment = principal * monthlyRate / (1 - Math.exp(-totalMonths * Math.log(1 + monthlyRate)));
  
  if (!Number.isFinite(monthlyPayment)) {
    throw new FinancialCalculationError('Monthly payment calculation overflow - check your inputs');
  }

  // Convert monthly to yearly (still in thousands)
  const yearlyPayments = Array(termYears).fill(monthlyPayment * 12);
  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = totalPayment - principal;

  // Round only the final results
  return {
    yearlyPayments: yearlyPayments.map(payment => Number(payment.toFixed(2))),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2))
  };
}

/**
 * Calculate Internal Rate of Return using Newton's method
 * @param cashFlows - Array of cash flows in thousands (first element is typically negative/investment)
 * @returns IRR as a percentage
 * @throws {FinancialCalculationError} If IRR calculation doesn't converge
 */
export function calculateIRR(cashFlows: number[]): number {
  validators.isValidArray(cashFlows, 'Cash flows');
  
  const guess = 0.1;
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let irr = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivativeNpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const denominator = Math.pow(1 + irr, j);
      if (!Number.isFinite(denominator) || denominator === 0) {
        throw new FinancialCalculationError('IRR calculation overflow - try a different initial guess');
      }
      npv += cashFlows[j] / denominator;
      if (j > 0) {
        derivativeNpv -= (j * cashFlows[j]) / (denominator * (1 + irr));
      }
    }

    // Handle near-zero derivative more gracefully
    if (Math.abs(derivativeNpv) < tolerance) {
      if (Math.abs(npv) < tolerance) {
        return Number((irr * 100).toFixed(2)); // Convert to percentage
      }
      // Try a different guess if we're stuck
      irr = guess * 2;
      continue;
    }

    const newIrr = irr - npv / derivativeNpv;
    
    if (Math.abs(newIrr - irr) < tolerance) {
      return Number((newIrr * 100).toFixed(2)); // Convert to percentage
    }
    
    irr = newIrr;
  }

  throw new FinancialCalculationError('IRR calculation exceeded maximum iterations');
}

/**
 * Calculate Multiple On Invested Capital
 * @param totalReturn - Total return on investment in thousands
 * @param initialInvestment - Initial investment amount in thousands
 * @returns MOIC ratio (unitless)
 */
export function calculateMOIC(totalReturn: number, initialInvestment: number): number {
  validators.isPositive(initialInvestment, 'Initial investment');
  return Number((totalReturn / initialInvestment).toFixed(2));
}

interface PaybackPeriodResult {
  years: number;
  isAchieved: boolean;
  remainingBalance?: number;
}

/**
 * Calculate payback period with detailed results
 * @param cashFlows - Array of cash flows in thousands (first element is typically negative/investment)
 * @returns Object containing payback period details
 */
export function calculatePaybackPeriod(cashFlows: number[]): PaybackPeriodResult {
  validators.isValidArray(cashFlows, 'Cash flows');
  
  let remainingBalance = -cashFlows[0];  // Initial investment (in thousands)
  let years = 0;
  
  for (let i = 1; i < cashFlows.length; i++) {
    remainingBalance += cashFlows[i];
    if (remainingBalance >= 0) {
      return {
        years: i,
        isAchieved: true
      };
    }
    years = i;
  }
  
  return {
    years,
    isAchieved: false,
    remainingBalance: Math.abs(remainingBalance)
  };
}

interface HistoricalData {
  year: number;
  metrics: {
    grossRevenue: number;
    ebitda: number;
  };
}

interface LTMMetrics {
  grossRevenue: number;
  ebitda: number;
  calculatedFrom: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Calculate Last Twelve Months (LTM) metrics based on historical data
 * @param historicalData - Array of historical financial data
 * @returns LTM metrics or null if insufficient data
 */
export function calculateLTM(historicalData: HistoricalData[]): LTMMetrics | null {
  if (!historicalData || historicalData.length < 4) {
    return null;
  }

  // Sort data by year to ensure correct order
  const sortedData = [...historicalData].sort((a, b) => a.year - b.year);
  const lastYear = sortedData[sortedData.length - 1];
  
  // Calculate LTM metrics
  const ltmMetrics: LTMMetrics = {
    grossRevenue: lastYear.metrics.grossRevenue,
    ebitda: lastYear.metrics.ebitda,
    calculatedFrom: {
      startDate: `${lastYear.year}-01-01`,
      endDate: `${lastYear.year}-12-31`
    }
  };

  return ltmMetrics;
}