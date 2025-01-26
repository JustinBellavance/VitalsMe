import React from 'react';
import './App.css';
import Plot from 'react-plotly.js';

const Plots = ({ allFigures }: { allFigures: Array<any> }) => {
  return (
    <div className="plots-container">
      {allFigures.map((fig, index) => (
        <div key={index} className="plot-item">
          <Plot
            data={fig.data}
            layout={{
                ...fig.layout,
                width: 300,
                height: 300, 
                margin: {
                    t: 0, // Top margin
                    r: 0, // Right margin
                    b: 0, // Bottom margin
                    l: 0, // Left margin
                  },
              }}
            config={fig.config}
          />
        </div>
      ))}
    </div>
  );
};

export default Plots;
