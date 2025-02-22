import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import getDateFromWeek from '@/app/utils/getDateFromWeek';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = getDateFromWeek(label);
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p className="label">{`Week ${label}`}</p>
        <p className="date">({date})</p>
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

const FarmCountChart: React.FC<FarmCountChartProps> = ({ title, data, slopeOfEstimate, endX }) => {
  const [chartDimensions, setChartDimensions] = useState({ width: 500, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 550) {
        setChartDimensions({ width: 300, height: 230 });
      } else {
        setChartDimensions({ width: 500, height: 300 });
      }
    };

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate the y values for the start and end points of the estimate line
  const endY = Math.round(slopeOfEstimate * endX);

  return (
    <div className='mb-4'>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <LineChart 
        width={chartDimensions.width} 
        height={chartDimensions.height} 
        data={data} 
        margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="week" 
          domain={[0, endX]}
          label={{ value: 'Week', position: 'insideBottom', offset: -10 }}
          tickFormatter={(value) => `${value}`}
          type="number"
        />
        <YAxis domain={[0, endY]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="top" 
          height={36}
          // wrapperStyle={{ bottom: 0 }}
        />
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
