import { CompanyOverview } from '../types/analysis';

interface Props {
  data: CompanyOverview;
  onChange: (data: CompanyOverview) => void;
}

export function CompanyOverviewForm({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Company Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={data.projectName}
              onChange={(e) => onChange({ ...data, projectName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={data.industry}
              onChange={(e) => onChange({ ...data, industry: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
            >
              <option value="">Select an industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Consumer Goods">Consumer Goods</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Energy">Energy</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="yearFounded" className="block text-sm font-medium text-gray-700">
              Year Founded
            </label>
            <input
              type="number"
              id="yearFounded"
              value={data.yearFounded}
              onChange={(e) => onChange({ ...data, yearFounded: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-medium focus:ring-primary-medium sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}