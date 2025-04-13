"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_chartjs_2_1 = require("react-chartjs-2");
const chart_js_1 = require("chart.js");
// Register components for Chart.js
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
const Chart = () => {
    // Dummy data for the chart
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Messages',
                data: [120, 190, 300, 500, 200, 300, 400],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Calls',
                data: [100, 300, 250, 450, 500, 700, 600],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
        ],
    };
    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Activity Overview',
            },
        },
    };
    return (<div className="p-4 bg-white rounded-lg shadow-md h-64">
      <react_chartjs_2_1.Line data={data} options={options}/>
    </div>);
};
exports.default = Chart;
