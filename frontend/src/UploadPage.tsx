import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload } from '@mynaui/icons-react';
import { Progress } from "@/components/ui/progress"

import './App.css';

function UploadPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(function(oldProgress) {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)
    return () => clearInterval(timer)
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // Show loading spinner
      setProgress(0);
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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center mb-16 w-[80%]">
        <Upload width={84} height={84} className="mb-8 text-black" />
        <div className="text-center">
          <p className="text-6xl text-black font-['Sublima-ExtraBold']">
            Upload your health results here.
          </p>
        </div>
      </div>

      <label className="button flex items-center gap-2 px-10 py-4 w-fit transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <Upload width={24} height={24} />
        <span className="text-xl font-medium">Upload PDF</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-[300px]">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-[#3d98a3] rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-lg font-semibold text-[#3d98a3] mt-4">
              Processing...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default UploadPage;
