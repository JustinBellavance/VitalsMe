import React from 'react';
import './App.css';

function UploadPage() {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file);
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
    </div>
  );
}

export default UploadPage;