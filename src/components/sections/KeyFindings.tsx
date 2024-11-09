import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  netCashPosition: number;
  irr: number;
  moic: number;
  initialStake: number;
}

export function KeyFindings({ netCashPosition, irr, moic, initialStake }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Strong cash flow generation with a projected net position of ${netCashPosition.toLocaleString()}</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Attractive returns with an IRR of {(irr * 100).toFixed(1)}% and MOIC of {moic.toFixed(2)}x</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Balanced acquisition schedule with {initialStake}% initial stake</p>
      </div>
      <div className="flex items-start">
        <ArrowRight className="h-5 w-5 text-primary mt-1 mr-2 flex-shrink-0" />
        <p className="text-gray-700">Sustainable debt service coverage based on projected EBITDA growth</p>
      </div>
    </div>
  );
}