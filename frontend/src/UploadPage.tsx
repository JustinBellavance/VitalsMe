import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './App.css';

function UploadPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // Show loading spinner
      const formData = new FormData();
      formData.append('pdfFile', file);

      try {
        const response = await fetch('http://localhost:5000/process', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setLoading(false); // Hide loading spinner
          console.log(data)
          navigate('/results', { state: { plotData: data } }); // Navigate to ResultsPage and pass plot data
        } else {
          setLoading(false); // Hide loading spinner
          alert('Failed to process the file.');
        }
      } catch (error) {
        setLoading(false); // Hide loading spinner
        console.error('Error uploading file:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="app-name">Upload Results</h1>
      <p className="slogan">Upload your health results here.</p>

      <label className="upload-button">
        Upload PDF
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {loading && (
      <div className="loading-popup">
        <div className="loading-spinner"></div>
        <p className="mt-4 text-lg font-semibold">Processing...</p>
      </div>
      )}

    </div>
  );
}

export default UploadPage;
