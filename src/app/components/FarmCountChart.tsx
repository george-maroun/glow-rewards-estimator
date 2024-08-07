import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p className="label">{`Week ${label}`}</p>
        <p style={{ color: payload[0].color }}>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


interface DataPoint {
  week: number;
  value: number;
}

interface FarmCountChartProps {
  title: string;
  data: any;
  slopeOfEstimate: number;
  startX: number;
  endX: number;
}

const FarmCountChart: React.FC<FarmCountChartProps> = ({ title, data, slopeOfEstimate, startX, endX }) => {
  // Calculate the y values for the start and end points of the estimate line
  const endY = Math.round(slopeOfEstimate * endX);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="week" 
          domain={[0, endX]}
          type="number"
        />
        <YAxis domain={[0, endY]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8"
          dot={false}
          activeDot={{ r: 4 }}
          name="Actual"
        />
        <ReferenceLine 
          segment={[{ x: 16, y: 0 }, { x: endX, y: endY }]} 
          stroke="red" 
          strokeDasharray="3 3"
          label={{ value: 'Estimate', position: 'insideTopRight' }}
        />
      </LineChart>
    </div>
  );
};

export default FarmCountChart;