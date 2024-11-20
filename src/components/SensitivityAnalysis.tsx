import React from 'react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResults } from '../types/analysis';

interface Props {
  results: AnalysisResults;
}

export function SensitivityAnalysis({ results }: Props) {
  const baseValuation = results.valuation;
  const baseMultiple = results.dealStructure.exitMultiple;
  const baseEBITDA = results.firstYearEbitda;
  const baseIRR = results.returnMetrics.irr;

  // Generate sensitivity data for multiple scenarios
  const generateSensitivityData = () => {
    const multipleRange = [-20, -10, 0, 10, 20]; // Percentage changes
    const ebitdaRange = [-20, -10, 0, 10, 20]; // Percentage changes

    return multipleRange.map(multipleChange => {
      const adjustedMultiple = baseMultiple * (1 + multipleChange / 100);
      return {
        multipleChange: `${multipleChange > 0 ? '+' : ''}${multipleChange}%`,
        ...ebitdaRange.reduce((acc, ebitdaChange) => {
          const adjustedEBITDA = baseEBITDA * (1 + ebitdaChange / 100);
          const newValuation = adjustedEBITDA * adjustedMultiple;
          const valuationChange = ((newValuation - baseValuation) / baseValuation) * 100;
          acc[`EBITDA${ebitdaChange}`] = Number(valuationChange.toFixed(1));
          return acc;
        }, {} as Record<string, number>),
      };
    });
  };

  const sensitivityData = generateSensitivityData();

  return (
    <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Sensitivity Analysis</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-4">Valuation Sensitivity to Multiple and EBITDA Changes</h4>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="multipleChange" />
                <YAxis 
                  label={{ value: 'Valuation Change (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="EBITDA-20" stroke="#ff7f7f" name="EBITDA -20%" />
                <Line type="monotone" dataKey="EBITDA-10" stroke="#ffbf7f" name="EBITDA -10%" />
                <Line type="monotone" dataKey="EBITDA0" stroke="#7fbf7f" name="EBITDA Base" />
                <Line type="monotone" dataKey="EBITDA10" stroke="#7f7fff" name="EBITDA +10%" />
                <Line type="monotone" dataKey="EBITDA20" stroke="#ff7fff" name="EBITDA +20%" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Key Metrics</h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Base Valuation: ${(baseValuation / 1000).toFixed(1)}M</li>
              <li>• Exit Multiple: {baseMultiple.toFixed(1)}x</li>
              <li>• Base EBITDA: ${(baseEBITDA / 1000).toFixed(1)}M</li>
              <li>• Base IRR: {baseIRR.toFixed(1)}%</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-4">Analysis Summary</h4>
            <p className="text-gray-600">
              This sensitivity analysis shows how changes in the EBITDA multiple and EBITDA value
              affect the overall valuation. The chart demonstrates the non-linear relationship
              between these variables and helps identify the most impactful factors on valuation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
