import React from 'react';
import { FinancingDetails } from '../types/analysis';

interface Props {
  data: FinancingDetails;
  onChange: (data: FinancingDetails) => void;
}

export function FinancingDetailsForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Financing Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cash Component (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={data.cashComponent}
            onChange={(e) => onChange({ ...data, cashComponent: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Debt Component (%)</label>
          <input
            type="number"
            value={100 - data.cashComponent}
            disabled
            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={data.interestRate}
            onChange={(e) => onChange({ ...data, interestRate: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Term (years)</label>
          <input
            type="number"
            value={data.termYears}
            onChange={(e) => onChange({ ...data, termYears: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}