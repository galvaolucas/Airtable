import { useState } from "react";
import { assignLanes } from "./assignLanes";

function dateToPercent(date, minDate, maxDate) {
  const totalDays = (maxDate - minDate) / 86400000;
  const daysFromStart = (date - minDate) / 86400000;
  return (daysFromStart / totalDays) * 100;
}

function generateScale(minDate, maxDate, steps = 8) {
  const dates = [];
  const totalDays = (maxDate - minDate) / 86400000;
  const stepDays = totalDays / steps;

  for (let i = 0; i <= steps; i++) {
    const d = new Date(minDate.getTime() + stepDays * i * 86400000);
    dates.push(d);
  }
  return dates;
}

export default function Timeline({ items }) {
  const datasetMin = new Date(Math.min(...items.map((i) => new Date(i.start))));
  const datasetMax = new Date(Math.max(...items.map((i) => new Date(i.end))));
  const lanes = assignLanes(items);

  const [zoomLevel, setZoomLevel] = useState(1);

  const scaleDates = generateScale(datasetMin, datasetMax);

  function zoom(factor) {
    setZoomLevel((z) => Math.max(1, z * factor)); // Prevent zoom < 1
  }

  function resetZoom() {
    setZoomLevel(1);
  }

  const baseWidth = 100; // % width for zoomLevel=1
  const totalWidthPercent = baseWidth * zoomLevel;

  return (
    <div>
      {/* Zoom Controls */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => zoom(1.25)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Zoom In
        </button>
        <button
          onClick={() => zoom(0.8)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Zoom Out
        </button>
        <button
          onClick={resetZoom}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset Zoom
        </button>
      </div>

      {/* Scrollable Wrapper */}
      <div className="border border-gray-300 rounded-lg bg-white shadow overflow-x-auto">
        {/* Inner Timeline with scalable width */}
        <div className="font-bold p-2">{datasetMin.getFullYear()}</div>
        <div
          className="relative p-4"
          style={{ width: `${totalWidthPercent}%` }}
        >
          {/* Date Scale */}
          <div className="relative mb-4 border-b border-gray-200 h-6">
            {scaleDates.map((d, idx) => {
              const left = dateToPercent(d, datasetMin, datasetMax);
              return (
                <div
                  key={idx}
                  className="absolute text-gray-500 text-xs transform -translate-x-1/2 italic"
                  style={{ left: `${left}%` }}
                >
                  {d
                    .toLocaleDateString()
                    .split("/")
                    .reverse()
                    .slice(-2)
                    .join("/")}
                </div>
              );
            })}
          </div>

          {/* Lanes */}
          {lanes.map((lane, laneIndex) => (
            <div
              key={laneIndex}
              className="relative h-12 mb-2 bg-gray-50 rounded-md"
            >
              {/* Grid Lines */}
              {scaleDates.map((d, idx) => {
                const left = dateToPercent(d, datasetMin, datasetMax);
                return (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 border-l border-gray-200"
                    style={{ left: `${left}%` }}
                  />
                );
              })}

              {/* Events */}
              {lane.map((item) => {
                const left = dateToPercent(
                  new Date(item.start),
                  datasetMin,
                  datasetMax,
                );
                const right = dateToPercent(
                  new Date(item.end),
                  datasetMin,
                  datasetMax,
                );
                const width = right - left;

                return (
                  <div
                    key={item.id}
                    className="absolute top-1 bottom-1 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-sm overflow-hidden whitespace-nowrap text-ellipsis"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
