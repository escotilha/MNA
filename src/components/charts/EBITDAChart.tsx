import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{
    year: string;
    EBITDA: number;
    'Cash Flow': number;
  }>;
}

export function EBITDAChart({ data }: Props) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="EBITDA" stroke="#20588C" strokeWidth={2} />
          <Line type="monotone" dataKey="Cash Flow" stroke="#00CFFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}