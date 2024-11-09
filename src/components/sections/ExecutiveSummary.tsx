import React from 'react';
import { DollarSign, TrendingUp, Percent, Users } from 'lucide-react';

interface Props {
  valuation: number;
  irr: number;
  moic: number;
  netCashPosition: number;
}

export function ExecutiveSummary({ valuation, irr, moic, netCashPosition }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-primary to-primary-medium p-6 rounded-xl">
        <DollarSign className="h-8 w-8 text-white/80 mb-2" />
        <h3 className="text-lg font-semibold text-white/90">Enterprise Value</h3>
        <p className="text-3xl font-bold text-white">${valuation.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-primary-medium to-primary-light p-6 rounded-xl">
        <TrendingUp className="h-8 w-8 text-white/80 mb-2" />
        <h3 className="text-lg font-semibold text-white/90">IRR</h3>
        <p className="text-3xl font-bold text-white">{(irr * 100).toFixed(1)}%</p>
      </div>
      <div className="bg-gradient-to-br from-primary to-primary-medium p-6 rounded-xl">
        <Percent className="h-8 w-8 text-white/80 mb-2" />
        <h3 className="text-lg font-semibold text-white/90">MOIC</h3>
        <p className="text-3xl font-bold text-white">{moic.toFixed(2)}x</p>
      </div>
      <div className="bg-gradient-to-br from-primary-medium to-primary-light p-6 rounded-xl">
        <Users className="h-8 w-8 text-white/80 mb-2" />
        <h3 className="text-lg font-semibold text-white/90">Cash Position</h3>
        <p className="text-3xl font-bold text-white">${netCashPosition.toLocaleString()}</p>
      </div>
    </div>
  );
}