import React from 'react';
import { AnalysisFormData } from '../types/analysis';

interface Props {
  formData: AnalysisFormData;
  setFormData: React.Dispatch<React.SetStateAction<AnalysisFormData>>;
}

export function DealStructureForm({ formData, setFormData }: Props) {
  const handleScheduleChange = (index: number, value: number) => {
    const newSchedule = [...formData.dealStructure.acquisitionSchedule];
    newSchedule[index].percentage = value;
    setFormData({
      ...formData,
      dealStructure: {
        ...formData.dealStructure,
        acquisitionSchedule: newSchedule
      }
    });
  };

  const totalPercentage = formData.dealStructure.acquisitionSchedule.reduce((sum, item) => sum + item.percentage, 0);
  const isValidSchedule = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Deal Structure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Multiple Paid</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            placeholder="Enter multiple (e.g., 5.0)"
            value={formData.dealStructure.multiplePaid || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value) && value > 0) {
                setFormData({
                  ...formData,
                  dealStructure: {
                    ...formData.dealStructure,
                    multiplePaid: value
                  }
                });
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enterprise Value = LTM EBITDA × Multiple Paid
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Exit Multiple</label>
          <input
            type="number"
            step="0.1"
            value={formData.dealStructure.exitMultiple}
            onChange={(e) => setFormData({
              ...formData,
              dealStructure: {
                ...formData.dealStructure,
                exitMultiple: parseFloat(e.target.value)
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Acquisition Schedule</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-primary to-primary-medium">
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">Metric</th>
                {formData.dealStructure.acquisitionSchedule.map((schedule, index) => (
                  <th key={schedule.date} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    {index === 0 ? 'CLOSING' : new Date(schedule.date).getFullYear()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Acquisition (%)</td>
                {formData.dealStructure.acquisitionSchedule.map((schedule, index) => (
                  <td key={schedule.date} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={schedule.percentage}
                      onChange={(e) => handleScheduleChange(index, parseFloat(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center">
          <div className="text-sm">
            Total: <span className={`font-medium ${isValidSchedule ? 'text-green-600' : 'text-red-600'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          {!isValidSchedule && (
            <div className="ml-4 text-sm text-red-600">
              Total must equal 100%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}