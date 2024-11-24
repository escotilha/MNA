import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calculator, DollarSign, TrendingUp, Shield, X } from 'lucide-react';
import { ExampleCharts } from '../landing/ExampleCharts';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/calculator', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate');
    }
  };

  const openModal = (mode: 'login' | 'signup') => {
    setIsLogin(mode === 'login');
    setShowModal(true);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-primary to-primary-dark">
      {/* Auth Buttons in Upper Right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => openModal('login')}
          className="px-4 py-1.5 text-sm bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Sign In
        </button>
        <button
          onClick={() => openModal('signup')}
          className="px-4 py-1.5 text-sm text-white font-medium rounded-md hover:bg-primary-darker border border-white/50 transition-colors"
        >
          Create Account
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center text-white space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Calculator className="h-12 w-12" />
              <h1 className="text-4xl font-bold">MNA Calculator</h1>
            </div>
            <p className="text-xl max-w-2xl mx-auto">
              Your comprehensive solution for Mergers & Acquisitions analysis. Make informed decisions
              with our powerful financial modeling tools.
            </p>
          </div>

          {/* Example Charts */}
          <div className="mb-12">
            <ExampleCharts />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <DollarSign className="h-8 w-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">Valuation Analysis</h3>
              <p className="text-white/90">Calculate enterprise value, EBITDA multiples, and deal structures with precision.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">Return Metrics</h3>
              <p className="text-white/90">Track IRR, MOIC, and payback periods to evaluate investment performance.</p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <Shield className="h-8 w-8 mb-4 text-white" />
              <h3 className="text-lg font-semibold mb-2 text-white">Try It Now</h3>
              <p className="text-white/90">
                Sign up for free to explore our comprehensive M&A analysis tools. Perfect for investment
                bankers, private equity professionals, and business analysts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium"
                >
                  {isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
