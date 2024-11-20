import React, { useEffect } from 'react';
import { HistoricalData, ProjectionData, KPIs, LTMMetrics } from '../types/analysis';

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

  // Initialize LTM values when historical data changes or component mounts
  useEffect(() => {
    if (historicalData.length > 0) {
      const lastIndex = historicalData.length - 1;
      const lastYear = historicalData[lastIndex];
      
      // Only set initial LTM if it's not already set
      if (!lastYear.ltm) {
        const newData = [...historicalData];
        newData[lastIndex] = {
          ...lastYear,
          ltm: {
            metrics: {
              grossRevenue: lastYear.metrics.grossRevenue,
              ebitda: lastYear.metrics.ebitda
            },
            calculatedFrom: {
              startDate: `${currentYear}-01-01`,
              endDate: `${currentYear}-12-31`
            }
          }
        };
        onHistoricalChange(newData);
      }
    }
  }, [historicalData, currentYear, onHistoricalChange]);

  const handleLTMChange = (field: keyof LTMMetrics['metrics'], value: number) => {
    console.log('Handling LTM change:', { field, value });
    const newData = [...historicalData];
    const lastIndex = historicalData.length - 1;
    
    // Ensure LTM object exists
    if (!newData[lastIndex].ltm) {
      newData[lastIndex].ltm = {
        metrics: {
          grossRevenue: newData[lastIndex].metrics.grossRevenue,
          ebitda: newData[lastIndex].metrics.ebitda
        },
        calculatedFrom: {
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`
        }
      };
    }
    
    // Update the specific field
    newData[lastIndex].ltm.metrics[field] = value;
    console.log('Updated LTM data:', newData[lastIndex].ltm);
    onHistoricalChange(newData);
  };

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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  LTM
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gross Revenue</td>
                {historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.grossRevenue}
                        onChange={(e) => {
                          const newData = [...historicalData];
                          newData[index].metrics.grossRevenue = parseFloat(e.target.value);
                          onHistoricalChange(newData);
                        }}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">thousands</span>
                      </div>
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={historicalData[historicalData.length - 1]?.ltm?.metrics?.grossRevenue ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        console.log('LTM Gross Revenue input change:', value);
                        handleLTMChange('grossRevenue', value);
                      }}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">thousands</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EBITDA</td>
                {historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.ebitda}
                        onChange={(e) => {
                          const newData = [...historicalData];
                          newData[index].metrics.ebitda = parseFloat(e.target.value);
                          onHistoricalChange(newData);
                        }}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">thousands</span>
                      </div>
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={historicalData[historicalData.length - 1]?.ltm?.metrics?.ebitda ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        console.log('LTM EBITDA input change:', value);
                        handleLTMChange('ebitda', value);
                      }}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">thousands</span>
                    </div>
                  </div>
                </td>
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
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.grossRevenue}
                        onChange={(e) => {
                          const newData = [...projectionData];
                          newData[index].metrics.grossRevenue = parseFloat(e.target.value);
                          onProjectionChange(newData);
                        }}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">thousands</span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">EBITDA</td>
                {projectionData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.ebitda}
                        onChange={(e) => {
                          const newData = [...projectionData];
                          newData[index].metrics.ebitda = parseFloat(e.target.value);
                          onProjectionChange(newData);
                        }}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">thousands</span>
                      </div>
                    </div>
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