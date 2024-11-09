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