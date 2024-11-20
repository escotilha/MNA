/**
 * Core financial calculations for M&A analysis
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
 * @param ebitda - Earnings Before Interest, Taxes, Depreciation, and Amortization
 * @param multiple - Valuation multiple
 * @returns Enterprise value
 */
export function calculateValuation(ebitda: number, multiple: number): number {
  validators.isPositive(ebitda, 'EBITDA');
  validators.isPositive(multiple, 'Multiple');
  
  return Number((ebitda * multiple).toFixed(2));
}

interface DebtServiceResult {
  yearlyPayments: number[];
  totalInterest: number;
  totalPayment: number;
}

/**
 * Calculate debt service payments and related metrics
 * @param principal - Loan principal amount
 * @param interestRate - Annual interest rate (percentage)
 * @param termYears - Loan term in years
 * @returns Object containing yearly payments and summary metrics
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
  
  // Use Math.log for more stable calculation of monthly payment
  const monthlyPayment = principal * monthlyRate / (1 - Math.exp(-totalMonths * Math.log(1 + monthlyRate)));
  
  if (!Number.isFinite(monthlyPayment)) {
    throw new FinancialCalculationError('Monthly payment calculation overflow - check your inputs');
  }

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
 * @param cashFlows - Array of cash flows (first element is typically negative/investment)
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
 * @param totalReturn - Total return on investment
 * @param initialInvestment - Initial investment amount
 * @returns MOIC ratio
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
 * @param cashFlows - Array of cash flows (first element is typically negative/investment)
 * @returns Object containing payback period details
 */
export function calculatePaybackPeriod(cashFlows: number[]): PaybackPeriodResult {
  validators.isValidArray(cashFlows, 'Cash flows');
  
  let cumulativeCashFlow = cashFlows[0];
  let years = 0;
  
  for (let i = 1; i < cashFlows.length; i++) {
    if (cumulativeCashFlow >= 0) {
      return {
        years: Number(years.toFixed(2)),
        isAchieved: true
      };
    }
    cumulativeCashFlow += cashFlows[i];
    years = i;
  }
  
  // If investment hasn't been recovered
  if (cumulativeCashFlow < 0) {
    return {
      years: cashFlows.length - 1,
      isAchieved: false,
      remainingBalance: cumulativeCashFlow
    };
  }
  
  return {
    years: cashFlows.length - 1,
    isAchieved: true
  };
}