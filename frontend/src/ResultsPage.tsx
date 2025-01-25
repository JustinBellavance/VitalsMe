import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function ResultsPage() {
  return (
    <div className="results-page flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="results-title">Vitals.me</h1>
      <p className="results-summary">
        Your blood test results show normal levels across key areas. Red blood cells are within the
        healthy range at 4.5-5.9 million cells/mcL, indicating no anemia. White blood cells are normal
        at 4,000–11,000 cells/mcL, suggesting no infection. Platelets are optimal at 150,000–450,000/mcL,
        ruling out clotting issues. Blood glucose is 70–99 mg/dL, showing no diabetes. Kidney function
        markers like creatinine (0.6–1.2 mg/dL) and BUN (7–20 mg/dL) are normal. Liver enzymes ALT
        (7–95 U/L) and AST (10–40 U/L) are within range. Cholesterol levels are healthy: LDL &lt;100 mg/dL,
        HDL &gt;40 mg/dL, and triglycerides &lt;150 mg/dL. Thyroid-stimulating hormone (TSH) is 0.4–4.0 mIU/L,
        indicating balanced thyroid function. Overall, your results are normal, and no further action is needed.
      </p>
      <div className="results-metrics">
        <div className="metric">
          <span className="metric-label">RBC</span>
          <span className="metric-value">4.8 million cells/mcL</span>
        </div>
        <div className="metric">
          <span className="metric-label">WBC</span>
          <span className="metric-value">6,000 cells/mcL</span>
        </div>
        <div className="metric">
          <span className="metric-label">HDL</span>
          <span className="metric-value">55 mg/dL</span>
        </div>
        {/* Add more metrics as needed */}
      </div>
      <Link to="/">
        <button className="button-secondary">Back to Home</button>
      </Link>
    </div>
  );
}

export default ResultsPage;