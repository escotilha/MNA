import { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResults, AnalysisFormData } from '../types/analysis';
import { SensitivityAnalysis } from './SensitivityAnalysis';
import { ConsultingRecommendation } from './ConsultingRecommendation';
import { FileDown } from 'lucide-react';
import { generatePDFReport } from './PDFReport';

interface Props {
  results: AnalysisResults;
  formData: AnalysisFormData;
}

export function AnalysisResultsView({ results, formData }: Props) {
  // Debug logging
  useEffect(() => {
    console.log('Analysis Results Debug:', {
      results: results,
      valuation: results?.valuation,
      ltmEbitda: results?.firstYearEbitda,
      historicalData: formData?.historicalData,
      lastHistoricalYear: formData?.historicalData?.[formData?.historicalData?.length - 1],
      multiplePaid: formData?.dealStructure?.multiplePaid,
      rawResults: JSON.stringify(results, null, 2)
    });
  }, [results, formData]);

  if (!results) {
    return (
      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <p className="text-red-600">Error: No results available to display.</p>
      </div>
    );
  }

  // Format currency in millions, handling numbers in thousands
  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return '$0.00M';
    // Convert from thousands to millions
    const inMillions = value / 1000;
    return `$${inMillions.toFixed(2)}M`;
  };

  const handlePrintReport = async () => {
    const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span>Generating PDF...';
    }

    try {
      await generatePDFReport(formData, results);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      // Show error to user
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Download PDF Report';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl shadow-glass text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            New Calculation
          </button>
          <button
            data-pdf-button
            onClick={handlePrintReport}
            className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl shadow-glass text-white bg-primary-medium hover:bg-primary-medium/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown className="mr-2 h-5 w-5" />
            Download PDF Report
          </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Deal KPIs</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Enterprise Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(results.enterpriseValue)}
            </p>
            <p className="text-xs text-gray-500">
              {`${results.dealStructure.multiplePaid.toFixed(1)}x LTM EBITDA`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">LTM EBITDA</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(results.ltmEbitda)}
            </p>
            <p className="text-xs text-gray-500">
              {`Last Twelve Months as of ${new Date().toLocaleDateString()}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">IRR</p>
            <p className="text-2xl font-bold text-gray-900">
              {(results.returnMetrics?.irr || 0).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">MOIC</p>
            <p className="text-2xl font-bold text-gray-900">
              {(results.returnMetrics?.moic || 0).toFixed(2)}x
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Deal Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Investment Thesis</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {results.returnMetrics.irr >= 25 ? (
                    <>
                      <span className="font-semibold">Strong Investment Opportunity:</span> With an IRR of {results.returnMetrics.irr.toFixed(1)}% 
                      and MOIC of {results.returnMetrics.moic.toFixed(2)}x, this investment presents compelling returns above typical market expectations.
                    </>
                  ) : results.returnMetrics.irr >= 15 ? (
                    <>
                      <span className="font-semibold">Moderate Investment Opportunity:</span> Returns are in line with market expectations, 
                      with an IRR of {results.returnMetrics.irr.toFixed(1)}% and MOIC of {results.returnMetrics.moic.toFixed(2)}x.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Cautious Outlook:</span> Returns are below typical market expectations. 
                      Consider renegotiating terms or identifying additional value creation opportunities.
                    </>
                  )}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Risk Assessment</h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {results.riskMetrics.debtServiceCoverage >= 2 ? (
                    <>
                      <span className="font-semibold">Strong Financial Position:</span> Debt service coverage ratio of {results.riskMetrics.debtServiceCoverage.toFixed(2)}x 
                      indicates healthy cash flow coverage for debt obligations.
                    </>
                  ) : results.riskMetrics.debtServiceCoverage >= 1.5 ? (
                    <>
                      <span className="font-semibold">Adequate Financial Position:</span> Debt service coverage of {results.riskMetrics.debtServiceCoverage.toFixed(2)}x 
                      provides reasonable cushion for debt obligations.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Financial Risk Alert:</span> Low debt service coverage of {results.riskMetrics.debtServiceCoverage.toFixed(2)}x 
                      suggests potential difficulty meeting debt obligations.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-700 mb-2">Key Action Items</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Value Creation:</span> Focus on operational improvements to maintain 
                  {results.cashConversionRate}% cash conversion rate and support exit multiple expansion.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Capital Structure:</span> {' '}
                  {results.riskMetrics.debtToEbitda > 4 ? 
                    'Consider reducing leverage to improve financial flexibility.' :
                    'Current leverage level appears sustainable.'}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Exit Strategy:</span> {' '}
                  {results.dealStructure.exitMultiple > results.dealStructure.multiplePaid * 1.5 ? 
                    'Exit multiple assumptions may be aggressive. Consider sensitivity analysis.' :
                    'Exit multiple assumptions appear reasonable based on entry valuation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <ConsultingRecommendation 
          results={results}
          companyName={formData.companyOverview.projectName}
          industry={formData.companyOverview.industry}
        />
      </div>

      {/* Sensitivity Analysis */}
      <div className="space-y-8">
        <SensitivityAnalysis results={results} />
      </div>

      {/* Return Calculation Breakdown */}
      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Return Calculation Breakdown</h3>
        
        {/* MOIC and Cash Flow Table */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Cash Flow and Returns Summary</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-primary-medium">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">EBITDA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cash Flow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Debt Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Net Cash Flow</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Initial Investment</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-{formatCurrency(results.enterpriseValue)}</td>
                </tr>
                {results.cashFlowGeneration.map((_, index) => {
                  const ebitda = results.projectedEbitda[index] || 0;
                  const operatingCashFlow = ebitda * (results.cashConversionRate / 100);
                  const debtService = results.debtService.yearlyPayments[index] || 0;
                  const netCashFlow = operatingCashFlow - debtService;
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year {index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(ebitda)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(operatingCashFlow)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(debtService)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(netCashFlow)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Exit Value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.projectedEbitda[results.projectedEbitda.length - 1])}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">@ {results.dealStructure.exitMultiple.toFixed(1)}x Multiple</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(results.projectedEbitda[results.projectedEbitda.length - 1] * results.dealStructure.exitMultiple)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total Returns</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={2}>
                    MOIC: {results.returnMetrics.moic.toFixed(2)}x
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    IRR: {results.returnMetrics.irr.toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* NPV Analysis Table */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">NPV Analysis</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-primary-medium">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Cash Flow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Discount Factor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Present Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.cashFlowGeneration.map((cf, index) => {
                  const discountFactor = Math.pow(1 + results.dealStructure.discountRate / 100, index + 1);
                  const presentValue = cf / discountFactor;
                  return (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Year {index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(cf)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discountFactor.toFixed(3)}x</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(presentValue)}</td>
                    </tr>
                  );
                })}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Exit Value</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(results.projectedEbitda[results.projectedEbitda.length - 1] * results.dealStructure.exitMultiple)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.pow(1 + results.dealStructure.discountRate / 100, results.projectedEbitda.length).toFixed(3)}x
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency((results.projectedEbitda[results.projectedEbitda.length - 1] * results.dealStructure.exitMultiple) / 
                      Math.pow(1 + results.dealStructure.discountRate / 100, results.projectedEbitda.length))}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NPV Summary</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Discount Rate: {results.dealStructure.discountRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Initial Investment: -{formatCurrency(results.enterpriseValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    NPV: {formatCurrency(results.npv)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}