import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const valuationData = [
  { year: '2020', value: 100 },
  { year: '2021', value: 120 },
  { year: '2022', value: 180 },
  { year: '2023', value: 220 },
  { year: '2024', value: 280 },
];

const returnData = [
  { year: 'Year 1', irr: 15, moic: 1.2 },
  { year: 'Year 2', irr: 22, moic: 1.5 },
  { year: 'Year 3', irr: 28, moic: 1.8 },
  { year: 'Year 4', irr: 32, moic: 2.2 },
  { year: 'Year 5', irr: 35, moic: 2.5 },
];

const cashflowData = [
  { month: 'Jan', inflow: 50, outflow: -30 },
  { month: 'Feb', inflow: 60, outflow: -35 },
  { month: 'Mar', inflow: 75, outflow: -40 },
  { month: 'Apr', inflow: 85, outflow: -45 },
  { month: 'May', inflow: 100, outflow: -50 },
];

export function ExampleCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Valuation Growth Chart */}
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-4">Enterprise Value Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={valuationData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Returns Chart */}
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-4">Investment Returns</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={returnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="irr"
                name="IRR %"
                stroke="#4F46E5"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="moic"
                name="MOIC x"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
        <h3 className="text-white text-lg font-semibold mb-4">Cash Flow Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="inflow" name="Cash Inflow" fill="#10B981" />
              <Bar dataKey="outflow" name="Cash Outflow" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
