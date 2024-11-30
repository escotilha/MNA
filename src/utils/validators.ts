export class FinancialValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FinancialValidationError';
  }
}

export function isPositive(value: number, fieldName: string): void {
  if (!Number.isFinite(value)) {
    throw new FinancialValidationError(`${fieldName} must be a valid number`);
  }
  if (value <= 0) {
    throw new FinancialValidationError(`${fieldName} must be positive`);
  }
}

export function isValidRate(value: number, fieldName: string): void {
  if (!Number.isFinite(value)) {
    throw new FinancialValidationError(`${fieldName} must be a valid number`);
  }
  if (value < 0 || value > 100) {
    throw new FinancialValidationError(`${fieldName} must be between 0 and 100`);
  }
}

export function isValidArray(arr: number[], fieldName: string): void {
  if (!Array.isArray(arr)) {
    throw new FinancialValidationError(`${fieldName} must be an array`);
  }
  if (arr.length === 0) {
    throw new FinancialValidationError(`${fieldName} cannot be empty`);
  }
  if (!arr.every(val => Number.isFinite(val))) {
    throw new FinancialValidationError(`All values in ${fieldName} must be valid numbers`);
  }
}

export function isValidPercentage(value: number, fieldName: string): void {
  if (!Number.isFinite(value)) {
    throw new FinancialValidationError(`${fieldName} must be a valid number`);
  }
  if (value < 0 || value > 100) {
    throw new FinancialValidationError(`${fieldName} must be between 0 and 100`);
  }
}

export function isValidYear(value: number, fieldName: string): void {
  if (!Number.isInteger(value)) {
    throw new FinancialValidationError(`${fieldName} must be a valid integer`);
  }
  const currentYear = new Date().getFullYear();
  if (value < currentYear || value > currentYear + 50) {
    throw new FinancialValidationError(`${fieldName} must be between ${currentYear} and ${currentYear + 50}`);
  }
}
