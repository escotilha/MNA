import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { Toaster } from 'react-hot-toast';
import { toast } from './components/toast/Toast';

console.log('App.tsx loaded');

function MNACalculator() {
  console.log('MNACalculator component rendering');
  const currentYear = new Date().getFullYear();
  const [showResults, setShowResults] = useState(false);
  const { state: { selectedAnalysis }, saveAnalysis } = useSavedAnalysis();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  console.log('MNACalculator state:', {
    selectedAnalysis,
    loading,
    showResults,
    results
  });

  const initialFormData: AnalysisFormData = {
    companyOverview: {
      projectName: 'Project Alpha',
      yearFounded: currentYear - 5,
      location: 'São Paulo',
      industry: '',
    },
    historicalData: Array.from({ length: 3 }, (_, i) => ({
      year: currentYear - (3 - i),
      metrics: {
        grossRevenue: Math.round(1000 * Math.pow(1.3, i)),
        ebitda: Math.round(300 * Math.pow(1.3, i)),
      },
    })),
    projectionData: Array.from({ length: 4 }, (_, i) => ({
      year: currentYear + i + 1,
      metrics: {
        grossRevenue: 0,
        ebitda: 0,
      },
    })),
    kpis: {
      recurringRevenue: 0,
      cashConversionRate: 50,
      employeeCount: 0,
      churnRate: 0,
    },
    dealStructure: {
      multiplePaid: 0,
      exitMultiple: 0,
      acquisitionSchedule: [],
    },
    financingDetails: {
      cashComponent: 0,
      stockComponent: 0,
      interestRate: 0,
      termYears: 5,
      discountRate: 0,
    },
  };

  const [formData, setFormData] = useState<AnalysisFormData>(initialFormData);

  useEffect(() => {
    console.log('MNACalculator useEffect running');
    if (selectedAnalysis) {
      try {
        setFormData({
          companyOverview: selectedAnalysis.companyOverview,
          historicalData: selectedAnalysis.historicalData,
          projectionData: selectedAnalysis.projectionData,
          kpis: selectedAnalysis.kpis,
          dealStructure: {
            multiplePaid: selectedAnalysis.results.dealStructure.multiplePaid,
            exitMultiple: selectedAnalysis.results.dealStructure.exitMultiple,
            acquisitionSchedule: selectedAnalysis.results.acquisitionSchedule,
          },
          financingDetails: {
            cashComponent: selectedAnalysis.results.dealStructure.equityComponent,
            stockComponent: selectedAnalysis.results.dealStructure.debtComponent,
            interestRate: selectedAnalysis.results.dealStructure.discountRate,
            termYears: 5,
            discountRate: selectedAnalysis.results.dealStructure.discountRate,
          },
        });
        setResults(selectedAnalysis.results);
        setShowResults(true);
      } catch (error) {
        console.error('Error setting form data:', error);
        toast.error('Error loading analysis data');
      }
    }
    setLoading(false);
  }, [selectedAnalysis]);

  const calculateResults = () => {
    try {
      // Get LTM EBITDA from the last historical year
      const ltmEbitda = formData.historicalData[formData.historicalData.length - 1].metrics.ebitda;

      // Calculate valuation
      const valuation = calculateValuation(ltmEbitda, formData.dealStructure.multiplePaid);

      // Calculate debt service based on financing structure
      const debtService = calculateDebtService(
        valuation * (formData.financingDetails.stockComponent / 100),
        formData.financingDetails.interestRate,
        formData.financingDetails.termYears
      );

      // Project cash flows
      const projectedEbitda = [
        ...formData.historicalData.map(year => year.metrics.ebitda),
        ...formData.projectionData.map(year => year.metrics.ebitda),
      ];

      // Calculate IRR
      const irr = calculateIRR(projectedEbitda, valuation);

      // Calculate MOIC
      const moic = calculateMOIC(projectedEbitda, valuation);

      // Calculate payback period
      const paybackPeriod = calculatePaybackPeriod(projectedEbitda, valuation);

      const results: AnalysisResults = {
        valuation,
        projectedEbitda,
        irr,
        moic,
        paybackPeriod,
        dealStructure: {
          multiplePaid: formData.dealStructure.multiplePaid,
          exitMultiple: formData.dealStructure.exitMultiple,
          equityComponent: formData.financingDetails.cashComponent,
          debtComponent: formData.financingDetails.stockComponent,
          discountRate: formData.financingDetails.discountRate,
        },
        debtService,
        acquisitionSchedule: formData.dealStructure.acquisitionSchedule,
      };

      setResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error calculating results:', error);
      toast.error('Error calculating results. Please check your inputs.');
    }
  };

  const handleSaveAnalysis = async () => {
    if (!results) {
      toast.error('Please calculate results before saving');
      return;
    }

    try {
      setSaveLoading(true);
      saveAnalysis({
        companyName: formData.companyOverview.projectName || '',
        industry: formData.companyOverview.industry || '',
        results,
      });
      toast.success('Analysis saved successfully!');
    } catch (error) {
      console.error('Failed to save analysis:', error);
      toast.error('Failed to save analysis. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('Rendering main component');
  console.log('Form Data:', formData);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Forms */}
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
            <div className="flex justify-end mt-6">
              <button
                onClick={calculateResults}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Calculate Results
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-end space-x-4">
              <button
                onClick={handleSaveAnalysis}
                disabled={saveLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  saveLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saveLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Analysis'
                )}
              </button>
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back to Edit
              </button>
            </div>
            {results && <AnalysisResultsView results={results} />}
          </>
        )}
      </div>
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
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