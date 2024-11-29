import React from 'react';
import { AnalysisFormData } from '../types/analysis';

interface Props {
  formData: AnalysisFormData;
  setFormData: (data: AnalysisFormData) => void;
}

export function FinancialDataForm({ formData, setFormData }: Props) {
  const handleHistoricalChange = (index: number, field: string, value: number) => {
    const newHistoricalData = [...formData.historicalData];
    newHistoricalData[index] = {
      ...newHistoricalData[index],
      metrics: {
        ...newHistoricalData[index].metrics,
        [field]: value,
      },
    };
    setFormData({
      ...formData,
      historicalData: newHistoricalData,
    });
  };

  const handleProjectionChange = (index: number, field: string, value: number) => {
    const newProjectionData = [...formData.projectionData];
    newProjectionData[index] = {
      ...newProjectionData[index],
      metrics: {
        ...newProjectionData[index].metrics,
        [field]: value,
      },
    };
    setFormData({
      ...formData,
      projectionData: newProjectionData,
    });
  };

  const handleKPIChange = (field: keyof typeof formData.kpis, value: number) => {
    setFormData({
      ...formData,
      kpis: {
        ...formData.kpis,
        [field]: value,
      },
    });
  };

  const currentYear = new Date().getFullYear();

  // Initialize LTM values when historical data changes or component mounts
  React.useEffect(() => {
    if (formData.historicalData.length > 0) {
      const lastIndex = formData.historicalData.length - 1;
      const lastYear = formData.historicalData[lastIndex];
      
      // Only set initial LTM if it's not already set
      if (!lastYear.ltm) {
        const newHistoricalData = [...formData.historicalData];
        newHistoricalData[lastIndex] = {
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
        setFormData({
          ...formData,
          historicalData: newHistoricalData,
        });
      }
    }
  }, [formData.historicalData, currentYear, setFormData]);

  const handleLTMChange = (field: string, value: number) => {
    const newHistoricalData = [...formData.historicalData];
    const lastIndex = formData.historicalData.length - 1;
    
    // Ensure LTM object exists
    if (!newHistoricalData[lastIndex].ltm) {
      newHistoricalData[lastIndex].ltm = {
        metrics: {
          grossRevenue: newHistoricalData[lastIndex].metrics.grossRevenue,
          ebitda: newHistoricalData[lastIndex].metrics.ebitda
        },
        calculatedFrom: {
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-12-31`
        }
      };
    }
    
    // Update the specific field
    newHistoricalData[lastIndex].ltm.metrics[field as keyof typeof newHistoricalData[typeof lastIndex]['ltm']['metrics']] = value;
    setFormData({
      ...formData,
      historicalData: newHistoricalData,
    });
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
                {formData.historicalData.map((data, index) => (
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
                {formData.historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.grossRevenue}
                        onChange={(e) => handleHistoricalChange(index, 'grossRevenue', Number(e.target.value))}
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
                      value={formData.historicalData[formData.historicalData.length - 1]?.ltm?.metrics?.grossRevenue ?? ''}
                      onChange={(e) => handleLTMChange('grossRevenue', Number(e.target.value))}
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
                {formData.historicalData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.ebitda}
                        onChange={(e) => handleHistoricalChange(index, 'ebitda', Number(e.target.value))}
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
                      value={formData.historicalData[formData.historicalData.length - 1]?.ltm?.metrics?.ebitda ?? ''}
                      onChange={(e) => handleLTMChange('ebitda', Number(e.target.value))}
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
                {formData.projectionData.map((data, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {currentYear + index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Gross Revenue</td>
                {formData.projectionData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.grossRevenue}
                        onChange={(e) => handleProjectionChange(index, 'grossRevenue', Number(e.target.value))}
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
                {formData.projectionData.map((data, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={data.metrics.ebitda}
                        onChange={(e) => handleProjectionChange(index, 'ebitda', Number(e.target.value))}
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
              value={formData.kpis.recurringRevenue}
              onChange={(e) => handleKPIChange('recurringRevenue', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Conversion Rate (%)</label>
            <input
              type="number"
              value={formData.kpis.cashConversionRate}
              onChange={(e) => handleKPIChange('cashConversionRate', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Count</label>
            <input
              type="number"
              value={formData.kpis.employeeCount}
              onChange={(e) => handleKPIChange('employeeCount', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Churn Rate (%)</label>
            <input
              type="number"
              value={formData.kpis.churnRate}
              onChange={(e) => handleKPIChange('churnRate', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}