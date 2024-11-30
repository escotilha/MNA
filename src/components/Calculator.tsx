import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSavedAnalysis } from '../contexts/SavedAnalysisContext';
import { SavedAnalysis } from '../types/savedAnalysis';
import { AnalysisResults } from '../types/analysis';

interface LocationState {
  editMode?: boolean;
  analysisId?: string;
}

export const Calculator: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, saveAnalysis } = useSavedAnalysis();
  const { editMode, analysisId } = (location.state as LocationState) || {};

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    results: {} as AnalysisResults
  });

  useEffect(() => {
    if (editMode && analysisId) {
      const analysis = state.analyses.find(a => a.id === analysisId);
      if (analysis) {
        setFormData({
          companyName: analysis.companyName,
          industry: analysis.industry || '',
          results: analysis.results
        });
      }
    }
  }, [editMode, analysisId, state.analyses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    saveAnalysis(formData);
    navigate('/dashboard');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {editMode ? 'Edit Analysis' : 'New M&A Analysis'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Company Name</span>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Industry</span>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>

          {/* Add other analysis input fields here */}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editMode ? 'Save Changes' : 'Create Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Calculator;
