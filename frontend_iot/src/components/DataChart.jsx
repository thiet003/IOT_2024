import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


const DataChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20, right: 50, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" style={{ fontSize: '12px' }} />
        <YAxis yAxisId="left" domain={[0, 'auto']} width={60} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 1024]} width={60} />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="cardinal"
          dataKey="temperature"
          stroke="red"
          dot={false}
          name="Nhiệt độ"
        />
        <Line
          yAxisId="left"
          type="cardinal"
          dataKey="humidity"
          stroke="#007bff"
          dot={false}
          name="Độ ẩm"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="light"
          stroke="#ffbb00"
          dot={false}
          name="Ánh sáng"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
