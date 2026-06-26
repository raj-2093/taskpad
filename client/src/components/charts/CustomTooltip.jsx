import React from "react";

export default function CustomToolTip({ chartType, active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xs font-semibold text-purple-800 mb-1">
          {chartType === "PieChart" ? payload[0].name : payload[0].payload.priority}
        </p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="text-sm font-medium text-gray-900">
            {chartType === "PieChart" ? payload[0].value : payload[0].payload.count}
          </span>
        </p>
      </div>
    );
  }

  return null;
}
