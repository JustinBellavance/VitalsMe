import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import vitalsme from './assets/vitalsme.png';

function DummyResultsPage() {

  const personal_info = [
    ['Name', 'John Doe'],
    ['Age', '45'],
    ['Gender', 'M']
  ];

  const dummyPlotData = {
    ecg: "path/to/ecg/plot",
    heartRate: "path/to/heart/plot"
  };

  const dummyTableData = [
    { parameter: "Heart Rate", value: "75 bpm", status: "Normal" },
    { parameter: "Blood Pressure", value: "120/80", status: "Normal" },
    { parameter: "SpO2", value: "98%", status: "Normal" }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 h-full">
        {/* Left column */}
        <div className="col-span-1 flex flex-col h-full">
          {/* Fixed header */}
          <div className="flex-none">
            <div className="flex justify-center">
              <Link to="/">
                <img src={vitalsme} alt="Vitals.me Logo" className="h-32 w-auto" />
              </Link>
            </div>
            <div className="text-black text-left pl-4">
              <p className="text-3xl font-bold">Hello, {personal_info[0][1]}</p>
              <p className="text-sm">{personal_info[1][1]}, {personal_info[2][1]}</p>
            </div>
          </div>

          {/* Scrollable table section */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-300px)]">
            <div className="bg-white rounded-lg shadow-md p-4">
              {dummyTableData.map((row, index) => (
                <div key={index} className="border-b py-2">
                  <div className="font-medium">{row.parameter}</div>
                  <div className="text-sm text-gray-600">{row.value}</div>
                  <div className="text-sm text-green-500">{row.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 flex flex-col h-full">
          {/* Scrollable plots section */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-200px)]">
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium mb-2">ECG Reading</h3>
                {/* Placeholder for ECG plot */}
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  ECG Plot Visualization
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium mb-2">Heart Rate Trend</h3>
                {/* Placeholder for Heart Rate plot */}
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  Heart Rate Plot Visualization
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DummyResultsPage;