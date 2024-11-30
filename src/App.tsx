import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './styles/print.css';
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
import { Toaster } from 'react-hot-toast';
import { toast } from './components/toast/Toast';

console.log('App.tsx loaded');

function MNACalculator() {
  console.log('MNACalculator component rendering');
  const currentYear = new Date().getFullYear();
  
  // Generate project name with Greek letter and day of year
  const generateProjectName = () => {
    const greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
    const randomGreek = greekLetters[Math.floor(Math.random() * greekLetters.length)];
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return `Project ${randomGreek} ${dayOfYear}`;
  };

  const [showResults, setShowResults] = useState(false);
  const { state: { selectedAnalysis }, saveAnalysis } = useSavedAnalysis();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  console.log('MNACalculator state:', {
    selectedAnalysis,
    loading,
    showResults,
    results
  });

  const initialFormData: AnalysisFormData = {
    companyOverview: {
      projectName: generateProjectName(),
      yearFounded: currentYear - 5,
      location: 'São Paulo',
      industry: 'Technology',
      cashConversionRate: 60,
    },
    historicalData: Array.from({ length: 3 }, (_, i) => ({
      year: currentYear - (3 - i),
      metrics: {
        grossRevenue: Math.round(1000 * Math.pow(1.3, i)),
        ebitda: Math.round(300 * Math.pow(1.3, i)),
      },
    })),
    projectionData: [
      {
        year: currentYear + 1,
        metrics: {
          grossRevenue: 2000,
          ebitda: 400,
          netIncome: 300,
          fcf: 240
        }
      },
      {
        year: currentYear + 2,
        metrics: {
          grossRevenue: 2400,
          ebitda: 480,
          netIncome: 360,
          fcf: 288
        }
      },
      {
        year: currentYear + 3,
        metrics: {
          grossRevenue: 3000,
          ebitda: 600,
          netIncome: 450,
          fcf: 360
        }
      },
      {
        year: currentYear + 4,
        metrics: {
          grossRevenue: 3600,
          ebitda: 720,
          netIncome: 540,
          fcf: 432
        }
      }
    ],
    kpis: {
      recurringRevenue: 0,
      cashConversionRate: 60,
      employeeCount: 0,
      churnRate: 0,
    },
    dealStructure: {
      multiplePaid: 5.0,
      exitMultiple: 6.0,
      acquisitionSchedule: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(currentYear + 1 + i, 0, 1).toISOString(),
        percentage: i === 0 ? 60 : 10,
      })),
    },
    financingDetails: {
      cashComponent: 40,
      debtComponent: 60,
      interestRate: 8.0,
      discountRate: 12,
      termYears: 5,
    },
  };

  const [formData, setFormData] = useState<AnalysisFormData>(initialFormData);

  useEffect(() => {
    console.log('MNACalculator useEffect running');
    if (selectedAnalysis) {
      try {
        const { results } = selectedAnalysis;
        const newFormData: AnalysisFormData = {
          companyOverview: {
            projectName: selectedAnalysis.companyName,
            yearFounded: new Date().getFullYear() - 5,
            location: 'Not specified',
            industry: selectedAnalysis.industry || 'Not specified',
          },
          historicalData: results.projectedEbitda.map((ebitda, index) => ({
            year: new Date().getFullYear() - (results.projectedEbitda.length - index),
            metrics: {
              grossRevenue: ebitda * 3.33,
              ebitda: ebitda,
            },
          })),
          projectionData: results.projectedEbitda.map((ebitda, index) => ({
            year: new Date().getFullYear() + index + 1,
            metrics: {
              grossRevenue: ebitda * 3.33,
              ebitda: ebitda,
            },
          })),
          kpis: {
            recurringRevenue: 0,
            cashConversionRate: 50,
            employeeCount: 0,
            churnRate: 0,
          },
          dealStructure: {
            multiplePaid: results.dealStructure.multiplePaid,
            exitMultiple: results.dealStructure.exitMultiple,
            acquisitionSchedule: results.acquisitionSchedule || [],
          },
          financingDetails: {
            cashComponent: results.dealStructure.equityComponent,
            debtComponent: results.dealStructure.debtComponent,
            interestRate: 5,
            termYears: 5,
            discountRate: results.dealStructure.discountRate,
          },
        };
        console.log('Setting form data from selected analysis:', newFormData);
        setFormData(newFormData);
        setResults(results);
        setShowResults(true);
        setLoading(false);
      } catch (error) {
        console.error('Error setting form data:', error);
        toast.error('Error loading analysis data');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [selectedAnalysis]);

  const calculateResults = () => {
    try {
      console.log('Starting calculation with form data:', formData);

      // Validate company overview
      if (!formData.companyOverview.projectName) {
        throw new Error('Project name is required');
      }
      if (!formData.companyOverview.industry) {
        throw new Error('Industry is required');
      }

      // Validate historical data
      if (!formData.historicalData || formData.historicalData.length === 0) {
        throw new Error('Historical data is required');
      }
      
      const latestEbitda = formData.historicalData[formData.historicalData.length - 1]?.metrics?.ebitda;
      if (!latestEbitda || !Number.isFinite(latestEbitda)) {
        throw new Error('Invalid EBITDA value in historical data');
      }
      console.log('Latest EBITDA:', latestEbitda);

      // Validate deal structure
      if (!formData.dealStructure.multiplePaid || !Number.isFinite(formData.dealStructure.multiplePaid)) {
        throw new Error('Invalid multiple paid value');
      }
      if (!formData.dealStructure.exitMultiple || !Number.isFinite(formData.dealStructure.exitMultiple)) {
        throw new Error('Invalid exit multiple value');
      }
      
      // Validate financing details
      if (!formData.financingDetails.cashComponent || !Number.isFinite(formData.financingDetails.cashComponent)) {
        throw new Error('Invalid cash component value');
      }
      if (!formData.financingDetails.debtComponent || !Number.isFinite(formData.financingDetails.debtComponent)) {
        throw new Error('Invalid debt component value');
      }
      if (formData.financingDetails.cashComponent + formData.financingDetails.debtComponent !== 100) {
        throw new Error('Cash and debt components must sum to 100%');
      }
      if (!formData.financingDetails.interestRate || !Number.isFinite(formData.financingDetails.interestRate)) {
        throw new Error('Invalid interest rate value');
      }
      if (!formData.financingDetails.termYears || !Number.isFinite(formData.financingDetails.termYears)) {
        throw new Error('Invalid term years value');
      }
      if (!formData.financingDetails.discountRate || !Number.isFinite(formData.financingDetails.discountRate)) {
        throw new Error('Invalid discount rate value');
      }

      // Validate projection data
      if (!formData.projectionData || formData.projectionData.length === 0) {
        throw new Error('Projection data is required');
      }
      formData.projectionData.forEach((year, index) => {
        if (!year.metrics.ebitda || !Number.isFinite(year.metrics.ebitda)) {
          throw new Error(`Invalid EBITDA value in projection year ${index + 1}`);
        }
      });

      try {
        // Calculate valuation
        const valuation = calculateValuation(latestEbitda, formData.dealStructure.multiplePaid);
        console.log('Valuation:', valuation);

        // Calculate debt service
        const debtAmount = valuation * (formData.financingDetails.debtComponent / 100);
        const debtServiceResult = calculateDebtService(
          debtAmount,
          formData.financingDetails.interestRate,
          formData.financingDetails.termYears
        );
        console.log('Debt service result:', debtServiceResult);

        // Get projected cash flows
        const projectedCashFlows = formData.projectionData.map(year => year.metrics.ebitda);
        console.log('Projected cash flows:', projectedCashFlows);
        
        // Calculate initial investment (negative) and add projected cash flows
        const investmentCashFlows = [-valuation, ...projectedCashFlows];
        console.log('Investment cash flows before terminal value:', investmentCashFlows);
        
        // Add terminal value to the last cash flow
        const terminalValue = projectedCashFlows[projectedCashFlows.length - 1] * formData.dealStructure.exitMultiple;
        investmentCashFlows[investmentCashFlows.length - 1] += terminalValue;
        console.log('Terminal value:', terminalValue);
        console.log('Final investment cash flows:', investmentCashFlows);

        // Calculate IRR and other metrics
        const irr = calculateIRR(investmentCashFlows);
        console.log('IRR:', irr);

        const totalReturn = investmentCashFlows.reduce((sum, cf) => sum + cf, 0);
        const moic = calculateMOIC(totalReturn, valuation);
        console.log('MOIC:', moic);

        const paybackPeriod = calculatePaybackPeriod(investmentCashFlows);
        console.log('Payback period:', paybackPeriod);

        const results: AnalysisResults = {
          valuation,
          enterpriseValue: valuation,
          ltmEbitda: latestEbitda,
          firstYearEbitda: formData.projectionData[0].metrics.ebitda,
          projectedEbitda: projectedCashFlows,
          cashFlowGeneration: projectedCashFlows.map(ebitda => ebitda * 0.7),
          debtService: {
            monthlyPayment: debtServiceResult.yearlyPayments[0] / 12,
            annualPayment: debtServiceResult.yearlyPayments[0],
            totalInterest: debtServiceResult.totalInterest,
            totalPayment: debtServiceResult.totalPayment,
            yearlyPayments: debtServiceResult.yearlyPayments,
            schedule: debtServiceResult.yearlyPayments.map((yearlyPayment, index) => {
              const remainingYears = formData.financingDetails.termYears - index;
              const remainingPayments = yearlyPayment * remainingYears;
              return {
                year: index + 1,
                payment: yearlyPayment,
                interest: yearlyPayment * (formData.financingDetails.interestRate / 100),
                principal: yearlyPayment * (1 - formData.financingDetails.interestRate / 100),
                remainingBalance: Math.max(0, debtServiceResult.totalPayment - yearlyPayment * (index + 1))
              };
            })
          },
          netCashPosition: 0,
          dealStructure: {
            exitMultiple: formData.dealStructure.exitMultiple,
            equityComponent: 100 - formData.financingDetails.debtComponent,
            debtComponent: formData.financingDetails.debtComponent,
            multiplePaid: formData.dealStructure.multiplePaid,
            discountRate: formData.financingDetails.discountRate
          },
          acquisitionSchedule: formData.dealStructure.acquisitionSchedule,
          returnMetrics: {
            irr,
            moic,
            paybackPeriod
          },
          riskMetrics: {
            debtServiceCoverage: projectedCashFlows[0] / debtServiceResult.yearlyPayments[0],
            interestCoverage: projectedCashFlows[0] / (debtServiceResult.totalInterest / formData.financingDetails.termYears),
            debtToEbitda: (valuation * formData.financingDetails.debtComponent / 100) / projectedCashFlows[0]
          },
          npv: investmentCashFlows.reduce((npv, cf, year) => 
            npv + cf / Math.pow(1 + formData.financingDetails.discountRate / 100, year), 0)
        };

        setResults(results);
        setShowResults(true);
        
        // Save the analysis
        saveAnalysis({
          companyName: formData.companyOverview.projectName,
          industry: formData.companyOverview.industry,
          results
        });

      } catch (error) {
        console.error('Error in calculation:', error);
        toast.error(error instanceof Error ? error.message : 'Error calculating analysis results');
      }
    } catch (error) {
      console.error('Error in form validation:', error);
      toast.error(error instanceof Error ? error.message : 'Error validating form data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {!showResults ? (
            <>
              <CompanyOverviewForm
                formData={formData}
                setFormData={setFormData}
              />
              <FinancialDataForm
                formData={formData}
                setFormData={setFormData}
              />
              <DealStructureForm
                formData={formData}
                setFormData={setFormData}
              />
              <FinancingDetailsForm
                formData={formData}
                setFormData={setFormData}
              />
              <button
                onClick={calculateResults}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Calculate Results
              </button>
            </>
          ) : results ? (
            <AnalysisResultsView
              results={results}
              formData={formData}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

function ProtectedLayout(props: ProtectedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SavedAnalysisProvider>
            <div className="min-h-screen bg-gray-50">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <ProtectedLayout>
                        <Outlet />
                      </ProtectedLayout>
                    </ProtectedRoute>
                  }
                >
                  <Route path="/calculator" element={<MNACalculator />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </div>
          </SavedAnalysisProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export { MNACalculator };
export default App;