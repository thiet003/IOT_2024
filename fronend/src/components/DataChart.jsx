import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useEffect } from 'react';
const DataChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        <Line type="monotone" dataKey="humidity" stroke="#387908" />
        <Line type="monotone" dataKey="light" stroke="#ffbb00" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DataChart;
