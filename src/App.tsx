import React, { useState } from 'react';
import { Building2, Calculator } from 'lucide-react';
import { CompanyOverviewForm } from './components/CompanyOverviewForm';
import { FinancialDataForm } from './components/FinancialDataForm';
import { DealStructureForm } from './components/DealStructureForm';
import { FinancingDetailsForm } from './components/FinancingDetailsForm';
import { AnalysisResultsView } from './components/AnalysisResults';
import { AnalysisFormData, AnalysisResults } from './types/analysis';
import { calculateValuation, calculateDebtService, calculateIRR, calculateMOIC } from './utils/calculations';

function App() {
  const currentYear = new Date().getFullYear();
  const [showResults, setShowResults] = useState(false);
  
  const initialGrossRevenue = 1000;
  const initialEBITDA = 300;
  const growthRate = 1.3;

  const historicalData = Array.from({ length: 3 }, (_, i) => ({
    year: currentYear - (3 - i),
    metrics: {
      grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i)),
      ebitda: Math.round(initialEBITDA * Math.pow(growthRate, i))
    },
  }));

  const projectionData = Array.from({ length: 4 }, (_, i) => ({
    year: currentYear + i + 1,
    metrics: {
      grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i + 3)),
      ebitda: Math.round(initialEBITDA * Math.pow(growthRate, i + 3))
    },
  }));

  const [formData, setFormData] = useState<AnalysisFormData>({
    companyOverview: {
      projectName: '',
      yearFounded: 2020,
      location: '',
    },
    historicalData,
    projectionData,
    kpis: {
      recurringRevenue: 0,
      cashConversionRate: 50,
      employeeCount: 0,
      churnRate: 0,
    },
    dealStructure: {
      multiplePaid: 6,
      exitMultiple: 12,
      acquisitionSchedule: [
        { year: 1, percentage: 55 },
        { year: 2, percentage: 15 },
        { year: 3, percentage: 15 },
        { year: 4, percentage: 15 },
      ],
    },
    financingDetails: {
      cashComponent: 50,
      stockComponent: 50,
      interestRate: 5,
      termYears: 5,
    },
  });

  const [results, setResults] = useState<AnalysisResults | null>(null);

  const calculateResults = () => {
    const firstHistoricalEbitda = formData.historicalData[0].metrics.ebitda;
    const valuation = calculateValuation(firstHistoricalEbitda, formData.dealStructure.multiplePaid);
    
    const debtAmount = firstHistoricalEbitda * formData.dealStructure.multiplePaid * (formData.financingDetails.cashComponent / 100);
    const debtService = calculateDebtService(
      debtAmount,
      formData.financingDetails.interestRate,
      formData.financingDetails.termYears
    );

    const projectedCashFlows = formData.projectionData.map(year => 
      year.metrics.ebitda * (formData.kpis.cashConversionRate / 100)
    );
    const cashFlowGeneration = projectedCashFlows.map((cf, i) => cf - debtService[i]);
    
    const exitValue = formData.projectionData[3].metrics.ebitda * formData.dealStructure.exitMultiple;
    const totalCashFlows = [-valuation, ...cashFlowGeneration, exitValue];
    
    const irr = calculateIRR(totalCashFlows);
    const moic = calculateMOIC(exitValue + cashFlowGeneration.reduce((a, b) => a + b, 0), valuation);

    const results: AnalysisResults = {
      valuation,
      debtService,
      cashFlowGeneration,
      netCashPosition: cashFlowGeneration.reduce((a, b) => a + b, 0),
      returnMetrics: {
        irr,
        moic,
      },
      firstYearEbitda: firstHistoricalEbitda,
      debtComponent: formData.financingDetails.cashComponent,
      projectedEbitda: formData.projectionData.map(year => year.metrics.ebitda),
      cashConversionRate: formData.kpis.cashConversionRate,
      acquisitionSchedule: formData.dealStructure.acquisitionSchedule,
    };

    setResults(results);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-medium to-primary-light">
      <header className="bg-white/10 backdrop-blur-glass shadow-glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Building2 className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">M&A Analysis Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!showResults ? (
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
              <CompanyOverviewForm
                data={formData.companyOverview}
                onChange={(data) => setFormData({ ...formData, companyOverview: data })}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
              <FinancialDataForm
                historicalData={formData.historicalData}
                projectionData={formData.projectionData}
                kpis={formData.kpis}
                onHistoricalChange={(data) => setFormData({ ...formData, historicalData: data })}
                onProjectionChange={(data) => setFormData({ ...formData, projectionData: data })}
                onKPIsChange={(data) => setFormData({ ...formData, kpis: data })}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
              <DealStructureForm
                data={formData.dealStructure}
                onChange={(data) => setFormData({ ...formData, dealStructure: data })}
              />
            </div>

            <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
              <FinancingDetailsForm
                data={formData.financingDetails}
                onChange={(data) => setFormData({ ...formData, financingDetails: data })}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={calculateResults}
                className="inline-flex items-center px-8 py-4 border border-white/20 text-lg font-medium rounded-xl shadow-glass text-white bg-primary-medium hover:bg-primary-medium/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200"
              >
                <Calculator className="mr-2 h-6 w-6" />
                Calculate Return
              </button>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowResults(false)}
              className="mb-6 inline-flex items-center px-6 py-3 border border-white/20 text-sm font-medium rounded-xl shadow-glass text-white bg-primary-medium hover:bg-primary-medium/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-all duration-200"
            >
              ← Back to Form
            </button>
            {results && <AnalysisResultsView results={results} />}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;