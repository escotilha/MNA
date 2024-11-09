import React from 'react';
import { HistoricalData, ProjectionData, KPIs } from '../types/analysis';

interface Props {
  historicalData: HistoricalData[];
  projectionData: ProjectionData[];
  kpis: KPIs;
  onHistoricalChange: (data: HistoricalData[]) => void;
  onProjectionChange: (data: ProjectionData[]) => void;
  onKPIsChange: (data: KPIs) => void;
}

export function FinancialDataForm({
  historicalData,
  projectionData,
  kpis,
  onHistoricalChange,
  onProjectionChange,
  onKPIsChange,
}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Historical Data</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-medium">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Metric</th>
                {historicalData.map((data, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {currentYear - (3 - index)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gross Revenue</td>
                {historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={data.metrics.grossRevenue}
                      onChange={(e) => {
                        const newData = [...historicalData];
                        newData[index].metrics.grossRevenue = parseFloat(e.target.value);
                        onHistoricalChange(newData);
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EBITDA</td>
                {historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={data.metrics.ebitda}
                      onChange={(e) => {
                        const newData = [...historicalData];
                        newData[index].metrics.ebitda = parseFloat(e.target.value);
                        onHistoricalChange(newData);
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Projections</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-medium">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Metric</th>
                {projectionData.map((data, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {currentYear + index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gross Revenue</td>
                {projectionData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={data.metrics.grossRevenue}
                      onChange={(e) => {
                        const newData = [...projectionData];
                        newData[index].metrics.grossRevenue = parseFloat(e.target.value);
                        onProjectionChange(newData);
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EBITDA</td>
                {projectionData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={data.metrics.ebitda}
                      onChange={(e) => {
                        const newData = [...projectionData];
                        newData[index].metrics.ebitda = parseFloat(e.target.value);
                        onProjectionChange(newData);
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recurring Revenue (%)</label>
            <input
              type="number"
              value={kpis.recurringRevenue}
              onChange={(e) => onKPIsChange({ ...kpis, recurringRevenue: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Conversion Rate (%)</label>
            <input
              type="number"
              value={kpis.cashConversionRate}
              onChange={(e) => onKPIsChange({ ...kpis, cashConversionRate: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Count</label>
            <input
              type="number"
              value={kpis.employeeCount}
              onChange={(e) => onKPIsChange({ ...kpis, employeeCount: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Churn Rate (%)</label>
            <input
              type="number"
              value={kpis.churnRate}
              onChange={(e) => onKPIsChange({ ...kpis, churnRate: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}