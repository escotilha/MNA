import React from 'react';
import { CompanyOverview } from '../types/analysis';

interface Props {
  data: CompanyOverview;
  onChange: (data: CompanyOverview) => void;
}

export function CompanyOverviewForm({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Company Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            value={data.projectName}
            onChange={(e) => onChange({ ...data, projectName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year Founded</label>
          <input
            type="number"
            value={data.yearFounded}
            onChange={(e) => onChange({ ...data, yearFounded: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onChange({ ...data, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}