import React, { useState } from 'react';
import { AnalysisResults } from '../types/analysis';
import { ReportView } from './ReportView';
import { LayoutDashboard, FileText } from 'lucide-react';

interface Props {
  results: AnalysisResults;
}

export function AnalysisResultsView({ results }: Props) {
  const [view, setView] = useState<'detailed' | 'report'>('detailed');
  
  const calculateTotalPayment = (index: number): number => {
    return results.debtService.slice(0, index + 1).reduce((sum, payment) => sum + payment, 0);
  };

  const calculateCumulative = (index: number): number => {
    return results.acquisitionSchedule
      .slice(0, index + 1)
      .reduce((sum, item) => sum + item.percentage, 0);
  };

  const calculateCashPaid = (ebitda: number, percentage: number): number => {
    return ebitda * results.valuation * (percentage / 100);
  };

  const loanAmount = (results.firstYearEbitda || 0) * 6 * (results.debtComponent || 0) / 100;

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setView('detailed')}
          className={`inline-flex items-center px-6 py-3 rounded-xl shadow-glass transition-all duration-200 ${
            view === 'detailed'
              ? 'bg-primary text-white'
              : 'bg-white/50 text-primary hover:bg-white/80'
          }`}
        >
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Detailed View
        </button>
        <button
          onClick={() => setView('report')}
          className={`inline-flex items-center px-6 py-3 rounded-xl shadow-glass transition-all duration-200 ${
            view === 'report'
              ? 'bg-primary text-white'
              : 'bg-white/50 text-primary hover:bg-white/80'
          }`}
        >
          <FileText className="mr-2 h-5 w-5" />
          Report View
        </button>
      </div>

      {view === 'detailed' ? (
        <>
          <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-primary to-primary-medium p-6 rounded-xl shadow-glass">
                <h3 className="text-lg font-semibold text-white/90">Valuation</h3>
                <p className="text-3xl font-bold text-white mt-2">${results.valuation.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary-medium to-primary-light p-6 rounded-xl shadow-glass">
                <h3 className="text-lg font-semibold text-white/90">Loan Amount</h3>
                <p className="text-3xl font-bold text-white mt-2">${loanAmount.toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-primary-medium p-6 rounded-xl shadow-glass">
                <h3 className="text-lg font-semibold text-white/90">IRR</h3>
                <p className="text-3xl font-bold text-white mt-2">{(results.returnMetrics.irr * 100).toFixed(1)}%</p>
              </div>
              
              <div className="bg-gradient-to-br from-primary-medium to-primary-light p-6 rounded-xl shadow-glass">
                <h3 className="text-lg font-semibold text-white/90">MOIC</h3>
                <p className="text-3xl font-bold text-white mt-2">{results.returnMetrics.moic.toFixed(2)}x</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary mb-6">Cash Flow and Acquisition Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-primary to-primary-medium">
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Year</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Acquisition %</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Cumulative %</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">EBITDA</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Cash Flow ({results.cashConversionRate}% of EBITDA)</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Debt Service</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Cash Paid</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Payment Made</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {results.cashFlowGeneration.map((cashFlow, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year {index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {results.acquisitionSchedule[index].percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateCumulative(index)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${results.projectedEbitda[index].toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(results.projectedEbitda[index] * results.cashConversionRate / 100).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${results.debtService[index].toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${calculateCashPaid(results.projectedEbitda[index], results.acquisitionSchedule[index].percentage).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${calculateTotalPayment(index).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary mb-4">Net Cash Position</h3>
            <div className="bg-gradient-to-r from-primary to-primary-medium p-6 rounded-xl">
              <p className="text-2xl font-bold text-white">${results.netCashPosition.toLocaleString()}</p>
            </div>
          </div>
        </>
      ) : (
        <ReportView results={results} />
      )}
    </div>
  );
}