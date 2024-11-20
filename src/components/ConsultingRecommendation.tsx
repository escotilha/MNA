import React from 'react';
import { AnalysisResults } from '../types/analysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  results: AnalysisResults;
  companyName: string;
  industry?: string;
}

export function ConsultingRecommendation({ results, companyName, industry }: Props) {
  if (!results || !results.projectedEbitda || !results.cashFlowGeneration || !results.debtService) {
    return null;
  }

  // Calculate key metrics for recommendation
  const ebitdaGrowth = results.projectedEbitda.length > 1
    ? ((results.projectedEbitda[results.projectedEbitda.length - 1] / results.projectedEbitda[0]) - 1) * 100
    : 0;
  
  const debtServiceCoverageRatio = results.cashFlowGeneration.map((cf, index) => ({
    year: `Year ${index + 1}`,
    ratio: results.debtService[index] ? cf / results.debtService[index] : 0,
  }));

  const valueCreationData = results.projectedEbitda.map((ebitda, index) => ({
    year: `Year ${index + 1}`,
    ebitda: ebitda / 1000000, // Convert to millions
    multiple: results.dealStructure?.exitMultiple || 0,
    enterpriseValue: (ebitda * (results.dealStructure?.exitMultiple || 0)) / 1000000,
  }));

  // Generate strategic recommendation based on metrics
  const getStrategicRecommendation = () => {
    try {
      const hasStrongCashFlow = results.cashFlowGeneration.every(cf => cf > 0);
      const hasHighIRR = (results.returnMetrics?.irr || 0) > 20;
      const hasHighMOIC = (results.returnMetrics?.moic || 0) > 2;
      const hasGoodDebtCoverage = debtServiceCoverageRatio.every(year => year.ratio > 1.5);

      if (hasStrongCashFlow && hasHighIRR && hasHighMOIC && hasGoodDebtCoverage) {
        return "Strong Buy";
      } else if ((hasStrongCashFlow && hasHighIRR) || (hasHighMOIC && hasGoodDebtCoverage)) {
        return "Buy with Conditions";
      } else if (!hasStrongCashFlow || !hasGoodDebtCoverage) {
        return "Restructure Deal";
      } else {
        return "Pass";
      }
    } catch (error) {
      console.error('Error generating recommendation:', error);
      return "Unable to Generate";
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Strategic Recommendation</h3>
          <span className={`px-4 py-2 rounded-full font-semibold ${
            getStrategicRecommendation() === "Strong Buy" ? "bg-green-100 text-green-800" :
            getStrategicRecommendation() === "Buy with Conditions" ? "bg-blue-100 text-blue-800" :
            getStrategicRecommendation() === "Restructure Deal" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {getStrategicRecommendation()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Executive Summary</h4>
            <div className="prose prose-sm text-gray-600">
              <p className="mb-4">
                Based on our comprehensive analysis of {companyName || 'the company'}, we recommend a 
                {getStrategicRecommendation() === "Strong Buy" ? " decisive acquisition strategy" :
                 getStrategicRecommendation() === "Buy with Conditions" ? "n acquisition with specific value-creation conditions" :
                 getStrategicRecommendation() === "Restructure Deal" ? " restructuring of the current deal terms" :
                 " pass on this opportunity"}.
              </p>
              <p className="mb-4">
                Key factors supporting this recommendation:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                <li>Projected EBITDA growth of {ebitdaGrowth.toFixed(1)}% over the investment period</li>
                <li>Expected IRR of {(results.returnMetrics?.irr || 0).toFixed(1)}% with {(results.returnMetrics?.moic || 0).toFixed(2)}x MOIC</li>
                <li>Average debt service coverage ratio of {(debtServiceCoverageRatio.reduce((acc, curr) => acc + curr.ratio, 0) / debtServiceCoverageRatio.length).toFixed(2)}x</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Value Creation Potential</h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valueCreationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enterpriseValue" fill="#0071E0" name="Enterprise Value ($M)" />
                  <Bar dataKey="ebitda" fill="#00CFFF" name="EBITDA ($M)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Key Value Creation Levers</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Operational Excellence</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Working capital optimization</li>
                  <li>• Cost structure improvement</li>
                  <li>• Operational efficiency</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Strategic Growth</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Market expansion</li>
                  <li>• Product development</li>
                  <li>• Strategic partnerships</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Financial Optimization</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Capital structure optimization</li>
                  <li>• Tax efficiency</li>
                  <li>• Working capital management</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Implementation Roadmap</h4>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="relative">
                <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm absolute -left-0">1</div>
                    <div className="ml-12">
                      <h6 className="font-medium text-gray-700">First 100 Days</h6>
                      <p className="text-sm text-gray-600 mt-1">Establish integration team, identify quick wins, and develop detailed value creation plan</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm absolute -left-0">2</div>
                    <div className="ml-12">
                      <h6 className="font-medium text-gray-700">Months 4-12</h6>
                      <p className="text-sm text-gray-600 mt-1">Execute operational improvements, implement strategic initiatives, and monitor KPIs</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm absolute -left-0">3</div>
                    <div className="ml-12">
                      <h6 className="font-medium text-gray-700">Year 2+</h6>
                      <p className="text-sm text-gray-600 mt-1">Scale successful initiatives, explore M&A opportunities, and prepare for potential exit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Risk Mitigation Strategy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Key Risks</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Market volatility and cyclicality</li>
                  <li>• Integration challenges</li>
                  <li>• Competition and market dynamics</li>
                  <li>• Regulatory environment</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Mitigation Measures</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Detailed integration planning</li>
                  <li>• Conservative financial modeling</li>
                  <li>• Strong governance framework</li>
                  <li>• Regular performance monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
