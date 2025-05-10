import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportChart = ({ type, data, title }) => {
  const chartData = {
    labels: data.map(item => item.label || item._id || item.eventTitle),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value || item.totalRegistrations || item.count || item.totalRevenue || item.refundAmount),
        backgroundColor: [
          "#D08860",
          "#B3714E",
          "#F5CBA7",
          "#E59866",
          "#A04000",
        ],
        borderColor: "#D08860",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title, color: "#78350F", font: { size: 18 } },
    },
    scales: type !== "pie" ? {
      y: {
        beginAtZero: true,
        ticks: { color: "#78350F" },
      },
      x: {
        ticks: { color: "#78350F" },
      },
    } : {},
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      {type === "bar" && <Bar data={chartData} options={options} />}
      {type === "line" && <Line data={chartData} options={options} />}
      {type === "pie" && <Pie data={chartData} options={options} />}
    </div>
  );
};

export default ReportChart;