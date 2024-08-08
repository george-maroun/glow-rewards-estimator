import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ComposedChart } from 'recharts';
import getDateFromWeek from '@/app/utils/getDateFromWeek';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = getDateFromWeek(label);
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p className="label">{`Week ${label}`}</p>
        <p className="date">({date})</p>
        {payload.map((pld: any, index: number) => (
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
        <Legend />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="week" 
          label={{ value: 'Week', position: 'insideBottom', offset: -10 }}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        
        {dataKeys.map((key, index) => 
          chartType === 'composed' && key.includes('weekly') ? (
            <Bar key={key} dataKey={key} fill={colors[index]} />
          ) : (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[index]}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )
        )}
      </ChartComponent>
    </div>
  );
};

export default Chart;