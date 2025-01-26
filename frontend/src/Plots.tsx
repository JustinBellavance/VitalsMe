import React, { useEffect } from 'react';
import './App.css';
import Plot from 'react-plotly.js';

const Plots = ({ allFigures }: { allFigures: Array<any> }) => {
    useEffect(() => {
        // Log all figures to the console when the component mounts
        console.log("allFigures", allFigures);
    }, [allFigures]);
  return (
    <div className="plots-container">
      {allFigures.map((fig, index) => (
        <div key={index} className="plot-item">
          <Plot
            data={fig.data}
            layout={{
                ...fig.layout,
                width: 550,
                height: 250, 
                margin: {
                    t: 30, // Top margin
                    r: 50, // Right margin
                    b: 0, // Bottom margin
                    l: 50, // Left margin
                  },
              }}
            config={fig.config}
            style={{ width: '100%', height: '100%' }} // Ensure the plot takes full space of the container
          />
        </div>
      ))}
    </div>
  );
};

export default Plots;
