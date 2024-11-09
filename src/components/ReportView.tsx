import React from 'react';
import { AnalysisResults } from '../types/analysis';
import { EBITDAChart } from './charts/EBITDAChart';
import { AcquisitionChart } from './charts/AcquisitionChart';
import { PieChartComponent } from './charts/PieChartComponent';
import { ExecutiveSummary } from './sections/ExecutiveSummary';
import { KeyFindings } from './sections/KeyFindings';
import { Recommendations } from './sections/Recommendations';

interface Props {
  results: AnalysisResults;
}

const COLORS = ['#20588C', '#0071E0', '#00CFFF', '#4FACFE'];

export function ReportView({ results }: Props) {
  const ebitdaData = results.projectedEbitda.map((ebitda, index) => ({
    year: `Year ${index + 1}`,
    EBITDA: ebitda,
    'Cash Flow': results.cashFlowGeneration[index],
  }));

  const acquisitionData = results.acquisitionSchedule.map((schedule) => ({
    year: `Year ${schedule.year}`,
    percentage: schedule.percentage,
  }));

  const cashFlowComponents = [
    { name: 'Debt Service', value: results.debtService.reduce((a, b) => a + b, 0) },
    { name: 'Net Cash Flow', value: results.netCashPosition },
  ];

  const dealStructureData = [
    { name: 'Cash Component', value: results.debtComponent || 0 },
    { name: 'Stock Component', value: 100 - (results.debtComponent || 0) },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">Executive Summary</h2>
        <ExecutiveSummary
          valuation={results.valuation}
          irr={results.returnMetrics.irr}
          moic={results.returnMetrics.moic}
          netCashPosition={results.netCashPosition}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">EBITDA & Cash Flow Projections</h3>
          <EBITDAChart data={ebitdaData} />
        </div>

        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">Acquisition Schedule</h3>
          <AcquisitionChart data={acquisitionData} />
        </div>

        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">Cash Flow Components</h3>
          <PieChartComponent data={cashFlowComponents} colors={COLORS} />
        </div>

        <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
          <h3 className="text-xl font-semibold text-primary mb-6">Deal Structure</h3>
          <PieChartComponent data={dealStructureData} colors={COLORS} />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
        <h3 className="text-xl font-semibold text-primary mb-6">Key Findings</h3>
        <KeyFindings
          netCashPosition={results.netCashPosition}
          irr={results.returnMetrics.irr}
          moic={results.returnMetrics.moic}
          initialStake={results.acquisitionSchedule[0].percentage}
        />
      </div>

      <div className="bg-white/90 backdrop-blur-glass shadow-glass rounded-xl p-8">
        <h3 className="text-xl font-semibold text-primary mb-6">Recommendations</h3>
        <Recommendations />
      </div>
    </div>
  );
}