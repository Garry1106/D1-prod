"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineChart = LineChart;
const recharts_1 = require("recharts");
function LineChart({ data }) {
    const chartData = data.map((value, index) => ({ name: `Day ${index + 1}`, value }));
    return (<recharts_1.ResponsiveContainer width="100%" height={300}>
      <recharts_1.LineChart data={chartData}>
        <recharts_1.CartesianGrid strokeDasharray="3 3"/>
        <recharts_1.XAxis dataKey="name"/>
        <recharts_1.YAxis />
        <recharts_1.Tooltip />
        <recharts_1.Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }}/>
      </recharts_1.LineChart>
    </recharts_1.ResponsiveContainer>);
}
