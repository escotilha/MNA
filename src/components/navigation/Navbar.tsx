import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Calculator, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">M&A Calculator</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link
                to="/calculator"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/calculator'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Calculator className="h-5 w-5 mr-1" />
                Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
