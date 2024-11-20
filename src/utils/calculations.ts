export function calculateValuation(ebitda: number, multiple: number): number {
  return ebitda * multiple;
}

export function calculateDebtService(
  principal: number,
  interestRate: number,
  termYears: number
): number[] {
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = termYears * 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const yearlyPayments: number[] = [];
  for (let year = 1; year <= termYears; year++) {
    yearlyPayments.push(monthlyPayment * 12);
  }

  return yearlyPayments;
}

export function calculateIRR(cashFlows: number[]): number {
  const guess = 0.1;
  const maxIterations = 1000;
  const tolerance = 0.00001;

  let irr = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivativeNpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + irr, j);
      if (j > 0) {
        derivativeNpv -= (j * cashFlows[j]) / Math.pow(1 + irr, j + 1);
      }
    }

    const newIrr = irr - npv / derivativeNpv;
    
    if (Math.abs(newIrr - irr) < tolerance) {
      return newIrr;
    }
    
    irr = newIrr;
  }

  return irr;
}

export function calculateMOIC(totalReturn: number, initialInvestment: number): number {
  return totalReturn / initialInvestment;
}

export function calculatePaybackPeriod(cashFlows: number[]): number {
  let cumulativeCashFlow = cashFlows[0]; // Initial investment (negative)
  let years = 0;
  
  for (let i = 1; i < cashFlows.length; i++) {
    if (cumulativeCashFlow >= 0) {
      break;
    }
    cumulativeCashFlow += cashFlows[i];
    years = i;
  }
  
  // If we haven't reached positive cash flow by the last period
  if (cumulativeCashFlow < 0) {
    return cashFlows.length;
  }
  
  // Add fraction of the year if we crossed zero during a year
  if (years > 0 && cumulativeCashFlow > 0) {
    const previousYearFlow = cumulativeCashFlow - cashFlows[years];
    const fraction = Math.abs(previousYearFlow) / cashFlows[years];
    years = years - 1 + fraction;
  }
  
  return years;
}