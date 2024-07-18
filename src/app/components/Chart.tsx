import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ComposedChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p className="label">{`Week ${label}`}</p>
        {payload.map((pld: any, index: any) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

// Abstracted Chart Component
const Chart: React.FC<{
  title: string,
  data: any[],
  chartType: 'line' | 'bar' | 'composed',
  dataKeys: string[],
  colors: string[]
}> = ({ title, data, chartType, dataKeys, colors }) => {
  const ChartComponent = chartType === 'line' ? LineChart : chartType === 'bar' ? BarChart : ComposedChart;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ChartComponent width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => 
          chartType === 'composed' && key.includes('weekly') ? (
            <Bar key={key} dataKey={key} fill={colors[index]} />
          ) : (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[index]}
              dot={false} // Hide all dots
              activeDot={{ r: 4 }} // Show and size the active (hovered) dot
            />
          )
        )}
      </ChartComponent>
    </div>
  );
};

export default Chart;