import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResults, AnalysisFormData } from '../types/analysis';
import { SensitivityAnalysis } from './SensitivityAnalysis';
import { ConsultingRecommendation } from './ConsultingRecommendation';
import { generatePDFReport } from './PDFReport';
import { FileDown } from 'lucide-react';

interface Props {
  results: AnalysisResults;
  formData: AnalysisFormData;
}

export function AnalysisResultsView({ results, formData }: Props) {
  if (!results) {
    return (
      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <p className="text-red-600">Error: No results available to display.</p>
      </div>
    );
  }

  const handleExportPDF = () => {
    try {
      // Log the data being passed to PDF generation
      console.log('PDF Generation Input Data:', {
        results,
        formData
      });
      
      if (!results) {
        throw new Error('Analysis results are undefined');
      }
      
      if (!formData) {
        throw new Error('Form data is required');
      }

      generatePDFReport(results, formData);
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      // Show error to user
      alert('Failed to generate PDF report: ' + (error as Error).message);
    }
  };

  const cashFlowData = results.cashFlowGeneration?.map((cf, index) => ({
    year: `Year ${index + 1}`,
    cashFlow: cf / 1000000, // Convert to millions
    debtService: (results.debtService?.[index] || 0) / 1000000, // Convert to millions
  })) || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-xl shadow-glass text-white bg-primary-medium hover:bg-primary-medium/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200"
        >
          <FileDown className="mr-2 h-5 w-5" />
          Export PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Valuation Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Enterprise Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${((results.valuation || 0) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Year EBITDA</p>
              <p className="text-2xl font-bold text-gray-900">
                ${((results.firstYearEbitda || 0) / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IRR</p>
              <p className="text-2xl font-bold text-gray-900">
                {(results.returnMetrics?.irr || 0).toFixed(2)}%
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cash Flow Analysis</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="cashFlow"
                  stackId="1"
                  stroke="#0071E0"
                  fill="#0071E0"
                  name="Cash Flow"
                />
                <Area
                  type="monotone"
                  dataKey="debtService"
                  stackId="2"
                  stroke="#FF4444"
                  fill="#FF4444"
                  name="Debt Service"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <SensitivityAnalysis results={results} />
        
        <ConsultingRecommendation 
          results={results}
          companyName={formData.companyOverview.projectName}
          industry={formData.companyOverview.industry}
        />
      </div>

      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Deal Structure</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Debt Component</p>
            <p className="text-xl font-semibold text-gray-900">{results.debtComponent || 0}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cash Conversion Rate</p>
            <p className="text-xl font-semibold text-gray-900">{results.cashConversionRate || 0}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Cash Position</p>
            <p className="text-xl font-semibold text-gray-900">
              ${((results.netCashPosition || 0) / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Acquisition Schedule</h3>
          <div className="space-y-2">
            {(results.acquisitionSchedule || []).map((schedule, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">Year {schedule.year}</span>
                <span className="text-gray-900 font-semibold">{schedule.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}