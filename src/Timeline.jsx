import { useState, useEffect } from "react";
import { assignLanes } from "./assignLanes";
import TextEditComponent from "./components/TextEditComponent";
import { twMerge } from "tailwind-merge";

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
  const [itemsCopy, setItemsCopy] = useState(items);
  const datasetMin = new Date(
    Math.min(...itemsCopy.map((i) => new Date(i.start))),
  );
  const datasetMax = new Date(
    Math.max(...itemsCopy.map((i) => new Date(i.end))),
  );
  const lanes = assignLanes(itemsCopy);
  const [doubleClickedItem, setDoubleClickedItem] = useState(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const scaleDates = generateScale(datasetMin, datasetMax);
  const baseWidth = 100;
  const totalWidthPercent = baseWidth * zoomLevel;


  function zoom(factor) {
    setZoomLevel((z) => Math.max(1, z * factor)); // Prevent zoom < 1
  }

  function resetZoom() {
    setZoomLevel(1);
  }

  function onDoubleClick(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      setDoubleClickedItem(elementId);
      setTimeout(() => {
        const textInput = document.getElementById(`${elementId}_textInput`);
        if (textInput) {
          textInput.focus();
        }
      }, 250);
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!doubleClickedItem) return;
      const activeElement = document.getElementById(doubleClickedItem);
      if (activeElement && !activeElement.contains(event.target)) {
        setDoubleClickedItem(null);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [doubleClickedItem]);

  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => zoom(1.25)}
          className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Zoom In
        </button>
        <button
          onClick={() => zoom(0.8)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Zoom Out
        </button>
        <button
          onClick={resetZoom}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Reset Zoom
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg bg-white shadow overflow-x-auto">
        <div className="font-bold p-2">{datasetMin.getFullYear()}</div>
        <div
          className="relative p-4"
          style={{ width: `${totalWidthPercent}%` }}
        >
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

          {lanes.map((lane, laneIndex) => (
            <div
              key={laneIndex}
              className="relative h-12 mb-2 bg-gray-50 rounded-md"
            >
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
                const elementId = `laneItem_${item.id}`;

                return (
                  <div
                    key={elementId}
                    id={elementId}
                    onDoubleClick={() => onDoubleClick(elementId)}
                    className={twMerge(
                      "absolute h-full flex flex-row items-center justify-start text-white text-xs px-2 py-1 rounded shadow-sm overflow-hidden whitespace-nowrap text-ellipsis",
                      doubleClickedItem === elementId
                        ? "bg-gray-400"
                        : "bg-blue-500",
                    )}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                    }}
                  >
                    <TextEditComponent
                      show={doubleClickedItem === elementId}
                      text={item.name}
                      itemsCopy={itemsCopy}
                      setItemsCopy={setItemsCopy}
                      itemId={elementId}
                    />
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

