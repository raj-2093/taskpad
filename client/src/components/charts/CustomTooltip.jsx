import React from "react";

export default function CustomTooltip({ active, payload, chartType }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-primary mb-1">
          {chartType === "PieChart" ? payload[0].name : payload[0].payload.Priority}
          {/* {payload[0].name} */}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {chartType === "PieChart" ? payload[0].value : payload[0].payload.count}
            {/* {payload[0].value} */}
          </span>
        </p>
      </div>
    );
  }

  return null;
}
