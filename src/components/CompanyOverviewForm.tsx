import { AnalysisFormData } from '../types/analysis';

interface Props {
  formData: AnalysisFormData;
  setFormData: (data: AnalysisFormData) => void;
}

export function CompanyOverviewForm({ formData, setFormData }: Props) {
  const handleChange = (field: keyof typeof formData.companyOverview, value: string | number) => {
    setFormData({
      ...formData,
      companyOverview: {
        ...formData.companyOverview,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Overview</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={formData.companyOverview.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select
            id="industry"
            value={formData.companyOverview.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
            value={formData.companyOverview.yearFounded}
            onChange={(e) => handleChange('yearFounded', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.companyOverview.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}