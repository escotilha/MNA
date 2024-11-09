import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{
    year: string;
    percentage: number;
  }>;
}

export function AcquisitionChart({ data }: Props) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Bar dataKey="percentage" fill="#0071E0" name="Acquisition %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}