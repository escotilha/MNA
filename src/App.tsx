import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/print.css';
import { Building2, Calculator as CalculatorIcon } from 'lucide-react';
import { CompanyOverviewForm } from './components/CompanyOverviewForm';
import { FinancialDataForm } from './components/FinancialDataForm';
import { DealStructureForm } from './components/DealStructureForm';
import { FinancingDetailsForm } from './components/FinancingDetailsForm';
import { AnalysisResultsView } from './components/AnalysisResults';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/navigation/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { SavedAnalysisProvider, useSavedAnalysis } from './contexts/SavedAnalysisContext';
import { AnalysisFormData, AnalysisResults } from './types/analysis';
import { calculateValuation, calculateDebtService, calculateIRR, calculateMOIC, calculatePaybackPeriod } from './utils/calculations';
import Dashboard from './components/dashboard/Dashboard';

function MNACalculator() {
  const currentYear = new Date().getFullYear();
  const [showResults, setShowResults] = useState(false);
  const { state: { selectedAnalysis }, saveAnalysis } = useSavedAnalysis();
  
  const initialGrossRevenue = 1000;
  const initialEBITDA = 300;
  const growthRate = 1.3;

  // Greek letter names with pronunciations
  const greekLetters = [
    'Alpha (AL-fuh)',
    'Beta (BAY-tuh)',
    'Gamma (GAM-uh)',
    'Delta (DEL-tuh)',
    'Epsilon (EP-si-lon)',
    'Zeta (ZAY-tuh)',
    'Eta (AY-tuh)',
    'Theta (THAY-tuh)',
    'Iota (eye-OH-tuh)',
    'Kappa (KAP-uh)',
    'Lambda (LAM-duh)',
    'Mu (myoo)',
    'Nu (noo)',
    'Xi (KSEE)',
    'Omicron (OM-i-kron)',
    'Pi (pie)',
    'Rho (row)',
    'Sigma (SIG-muh)',
    'Tau (taw)',
    'Upsilon (OOP-si-lon)',
    'Phi (fie)',
    'Chi (kai)',
    'Psi (sigh)',
    'Omega (oh-MAY-guh)'
  ];

  const randomGreekLetter = greekLetters[Math.floor(Math.random() * greekLetters.length)];

  const [formData, setFormData] = useState<AnalysisFormData>(() => {
    if (selectedAnalysis) {
      // If there's a selected analysis, pre-fill the form
      return {
        companyOverview: {
          projectName: selectedAnalysis.companyName,
          industry: selectedAnalysis.industry || '',
          yearFounded: 2020,
          location: 'São Paulo',
        },
        historicalData: selectedAnalysis.results.projectedEbitda.slice(0, 3).map((ebitda, i) => ({
          year: currentYear - (3 - i),
          metrics: {
            grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i)),
            ebitda,
          },
        })),
        projectionData: selectedAnalysis.results.projectedEbitda.slice(3).map((ebitda, i) => ({
          year: currentYear + i + 1,
          metrics: {
            grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i + 3)),
            ebitda,
          },
        })),
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
            { date: '2024', percentage: 55 },
            { date: '2025', percentage: 15 },
            { date: '2026', percentage: 15 },
            { date: '2027', percentage: 15 },
          ],
        },
        financingDetails: {
          cashComponent: 50,
          stockComponent: 50,
          interestRate: 18,
          termYears: 5,
          discountRate: 10,
        },
      };
    }
    return {
      companyOverview: {
        projectName: `Project ${randomGreekLetter}`,
        yearFounded: 2020,
        location: 'São Paulo',
        industry: '',
      },
      historicalData: Array.from({ length: 3 }, (_, i) => ({
        year: currentYear - (3 - i),
        metrics: {
          grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i)),
          ebitda: Math.round(initialEBITDA * Math.pow(growthRate, i)),
        },
      })),
      projectionData: Array.from({ length: 4 }, (_, i) => ({
        year: currentYear + i + 1,
        metrics: {
          grossRevenue: Math.round(initialGrossRevenue * Math.pow(growthRate, i + 3)),
          ebitda: Math.round(initialEBITDA * Math.pow(growthRate, i + 3)),
        },
      })),
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
          { date: '2024', percentage: 55 },
          { date: '2025', percentage: 15 },
          { date: '2026', percentage: 15 },
          { date: '2027', percentage: 15 },
        ],
      },
      financingDetails: {
        cashComponent: 50,
        stockComponent: 50,
        interestRate: 18,
        termYears: 5,
        discountRate: 10,
      },
    };
  });

  const [results, setResults] = useState<AnalysisResults | null>(() => {
    // If there's a selected analysis, use its results
    return selectedAnalysis ? selectedAnalysis.results : null;
  });

  // Show results if we're loading a saved analysis
  useEffect(() => {
    if (selectedAnalysis) {
      setShowResults(true);
    }
  }, [selectedAnalysis]);

  const calculateResults = () => {
    try {
      // Get LTM EBITDA from the last historical year
      const lastHistoricalData = formData.historicalData[formData.historicalData.length - 1];
      const ltmEbitda = lastHistoricalData.metrics.ebitda;
      console.log('Using LTM EBITDA for calculation:', ltmEbitda);
      
      // Validate LTM EBITDA value
      if (!ltmEbitda || ltmEbitda <= 0) {
        throw new Error("LTM EBITDA must be positive to calculate meaningful returns");
      }

      if (isNaN(ltmEbitda)) {
        throw new Error("LTM EBITDA must be a valid number");
      }

      const valuation = calculateValuation(ltmEbitda, formData.dealStructure.multiplePaid);
      console.log('Valuation calculation:', {
        ltmEbitda,
        multiplePaid: formData.dealStructure.multiplePaid,
        calculatedValuation: valuation
      });
      
      if (valuation <= 0) {
        throw new Error("Valuation must be positive");
      }

      // Calculate enterprise value (same as valuation in this case)
      const enterpriseValue = valuation;
      
      const debtAmount = enterpriseValue * (formData.financingDetails.cashComponent / 100);
      const debtService = calculateDebtService(
        debtAmount,
        formData.financingDetails.interestRate,
        formData.financingDetails.termYears
      );

      const projectedCashFlows = formData.projectionData.map(year => {
        const cf = year.metrics.ebitda * (formData.kpis.cashConversionRate / 100);
        if (isNaN(cf)) {
          throw new Error("Invalid cash flow calculation");
        }
        return cf;
      });
      
      const cashFlowGeneration = projectedCashFlows.map((cf, i) => {
        const yearlyDebtService = i < debtService.yearlyPayments.length ? debtService.yearlyPayments[i] : 0;
        const netCf = cf - yearlyDebtService;
        if (isNaN(netCf)) {
          throw new Error("Invalid net cash flow calculation");
        }
        return netCf;
      });
      
      const exitValue = formData.projectionData[formData.projectionData.length - 1].metrics.ebitda * formData.dealStructure.exitMultiple;
      if (exitValue <= 0) {
        throw new Error("Exit value must be positive");
      }

      const totalCashFlows = [-enterpriseValue, ...cashFlowGeneration, exitValue];
      
      const irr = calculateIRR(totalCashFlows);
      if (isNaN(irr)) {
        throw new Error("Could not calculate IRR - please check your cash flow projections");
      }

      const totalReturn = exitValue + cashFlowGeneration.reduce((a, b) => a + b, 0);
      const moic = calculateMOIC(totalReturn, enterpriseValue);
      if (isNaN(moic)) {
        throw new Error("Could not calculate MOIC - please check your return and investment values");
      }

      const paybackPeriod = calculatePaybackPeriod(totalCashFlows);
      const equityComponent = 100 - formData.financingDetails.cashComponent;
      
      const results: AnalysisResults = {
        valuation,
        enterpriseValue,
        debtService,
        cashFlowGeneration,
        netCashPosition: cashFlowGeneration.reduce((a, b) => a + b, 0),
        returnMetrics: {
          irr,
          moic,
          paybackPeriod,
        },
        ltmEbitda,
        firstYearEbitda: formData.projectionData[0].metrics.ebitda,
        debtComponent: formData.financingDetails.cashComponent,
        projectedEbitda: formData.projectionData.map(year => year.metrics.ebitda),
        cashConversionRate: formData.kpis.cashConversionRate,
        acquisitionSchedule: formData.dealStructure.acquisitionSchedule,
        dealStructure: {
          exitMultiple: formData.dealStructure.exitMultiple,
          equityComponent,
          debtComponent: formData.financingDetails.cashComponent,
          multiplePaid: formData.dealStructure.multiplePaid,
          discountRate: formData.financingDetails.discountRate,
        },
        riskMetrics: {
          debtServiceCoverage: cashFlowGeneration[0] / (debtService.yearlyPayments[0] || 1),
          interestCoverage: ltmEbitda / (debtService.totalInterest / formData.financingDetails.termYears || 1),
          debtToEbitda: debtAmount / ltmEbitda,
        },
        npv: totalCashFlows.reduce((acc, cf, i) => 
          acc + cf / Math.pow(1 + formData.financingDetails.discountRate / 100, i), 0)
      };

      // Debug log the final results
      console.log('Final results:', {
        ltmEbitda,
        enterpriseValue,
        multiple: formData.dealStructure.multiplePaid,
        calculatedValuation: valuation,
        fullResults: results
      });

      setResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error in calculation:', error instanceof Error ? error.message : String(error));
      return null;
    }
  };

  const handleSaveAnalysis = () => {
    if (results) {
      saveAnalysis({
        companyName: formData.companyOverview.projectName || '',
        industry: formData.companyOverview.industry || '',
        results
      });
    }
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
                <CalculatorIcon className="mr-2 h-6 w-6" />
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
            {showResults && (
              <div className="mt-8">
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleSaveAnalysis}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mr-4"
                  >
                    Save Analysis
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Print Report
                  </button>
                </div>
                <AnalysisResultsView
                  results={results}
                  companyName={formData.companyOverview.projectName}
                  industry={formData.companyOverview.industry}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SavedAnalysisProvider>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/calculator" element={<MNACalculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </SavedAnalysisProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;