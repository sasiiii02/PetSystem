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
          "rgba(208, 136, 96, 0.8)",
          "rgba(179, 112, 77, 0.8)",
          "rgba(245, 203, 167, 0.8)",
          "rgba(229, 152, 102, 0.8)",
          "rgba(160, 64, 0, 0.8)",
        ],
        borderColor: [
          "#D08860",
          "#B3704D",
          "#F5CBA7",
          "#E59866",
          "#A04000",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "#C07A50",
          "#A06040",
          "#E5B897",
          "#D58856",
          "#903000",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#4B2E1A",
          font: { size: 14 },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: title,
        color: "#4B2E1A",
        font: { size: 18, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#FFF5E6",
        titleColor: "#4B2E1A",
        bodyColor: "#4B2E1A",
        borderColor: "#D08860",
        borderWidth: 1,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: type !== "pie" ? {
      y: {
        beginAtZero: true,
        ticks: { color: "#4B2E1A", font: { size: 12 } },
        grid: { color: "rgba(208, 136, 96, 0.1)" },
      },
      x: {
        ticks: { color: "#4B2E1A", font: { size: 12 } },
        grid: { display: false },
      },
    } : {},
  };

  return (
    <div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-all duration-300">
      {type === "bar" && <Bar data={chartData} options={options} />}
      {type === "line" && <Line data={chartData} options={options} />}
      {type === "pie" && <Pie data={chartData} options={options} />}
    </div>
  );
};

export default ReportChart;