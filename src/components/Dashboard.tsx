import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSavedAnalysis } from '../contexts/SavedAnalysisContext';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, loadAnalysis, deleteAnalysis } = useSavedAnalysis();
  const { analyses } = state;

  const handleEdit = (analysisId: string) => {
    loadAnalysis(analysisId);
    navigate('/calculator', { 
      state: { 
        editMode: true,
        analysisId 
      }
    });
  };

  const handleDelete = (analysisId: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(analysisId);
    }
  };

  const handleViewReport = (analysisId: string) => {
    loadAnalysis(analysisId);
    navigate(`/report/${analysisId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your M&A Analyses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{analysis.companyName}</h2>
            <div className="text-gray-600 space-y-1 mb-4">
              <p>Created: {new Date(analysis.date).toLocaleDateString()}</p>
              <p>Enterprise Value: {formatCurrency(analysis.summary.enterpriseValue)}</p>
              <p>LTM EBITDA: {formatCurrency(analysis.summary.ltmEbitda)}</p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(analysis.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="Edit Analysis"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleViewReport(analysis.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                title="View Report"
              >
                <FileText size={20} />
              </button>
              <button
                onClick={() => handleDelete(analysis.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                title="Delete Analysis"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {analyses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any analyses yet.</p>
          <button
            onClick={() => navigate('/calculator')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create New Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
