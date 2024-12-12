import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const DataProcessingPage3 = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState([]);

  const reportBaseUrl =
    'https://lookerstudio.google.com/embed/reporting/1d6a3eee-e04e-4064-bd6d-7f9dbe0a8ef4/page/PB2WE';

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Convert file to base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 part after data:image/png;base64,
      reader.onerror = reject;
      reader.readAsDataURL(file); // Read file as base64
    });
  };

  // Handle file upload and processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('Email is missing. Please log in first.');
      return;
    }

    if (file) {
      setIsProcessing(true);

      try {
        const base64FileContent = await convertToBase64(file);
        const payload = {
          email,
          body: base64FileContent,
        };

        const apiUrl =
          'https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/dp3';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setIsProcessing(false);
          alert('Word Cloud Generated!');
        } else {
          setIsProcessing(false);
          const errorMessage = await response.text();
          alert(`Error generating word cloud: ${errorMessage}`);
        }
      } catch (error) {
        setIsProcessing(false);
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      }
    } else {
      alert('Please select a file to upload');
    }
  };

  // Fetch processed files from the backend
  const fetchProcessedFiles = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('Email is missing. Please log in first.');
      return;
    }

    try {
      const response = await fetch(
        'https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/ProcessedData/getDP3Data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setProcessedFiles(parsedData);
      } else {
        const errorMessage = await response.text();
        alert(`Error fetching processed files: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching processed files.');
    }
  };

  // Open Looker Studio report in a new tab
  const handleOpenLookerStudio = () => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      alert('Email is missing. Please log in first.');
      return;
    }

    const params = {
      'ds0.email_parameter': email,
    };
    const paramsAsString = JSON.stringify(params);
    const encodedParams = encodeURIComponent(paramsAsString);

    const reportUrl = `${reportBaseUrl}?params=${encodedParams}`;
    const newTab = window.open();
    newTab.document.body.innerHTML = `
      <iframe 
        src="${reportUrl}" 
        width="100%" 
        height="100%" 
        frameborder="0" 
        style="border: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;">
      </iframe>
    `;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
            Word Cloud Generation
          </h1>

          <div className="bg-white shadow-xl rounded-lg p-6 max-w-3xl mx-auto flex flex-col items-center text-center hover:shadow-2xl transition">
            <FontAwesomeIcon icon={faChartLine} size="3x" className="text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Your Text File
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-4 border-dashed border-purple-500 p-10 rounded-xl flex justify-center items-center">
                <label htmlFor="file-upload" className="text-center text-gray-600 cursor-pointer w-full">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">Drag & Drop or Click to Browse</p>
                    <p className="text-sm text-gray-500">Only .txt files are accepted</p>
                    {fileName && (
                      <p className="mt-2 text-gray-700">Selected file: {fileName}</p>
                    )}
                  </div>
                </label>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`${
                    isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
                  } text-white px-6 py-2 rounded-full shadow-lg transition`}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Generate Word Cloud'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={fetchProcessedFiles}
              className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-full shadow-lg"
            >
              Get Processed Files
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleOpenLookerStudio}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full shadow-lg"
            >
              Open Looker Studio Report
            </button>
          </div>

          {processedFiles.length > 0 && (
            <div className="mt-8 overflow-x-auto bg-white shadow-xl rounded-lg p-6">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-semibold">File ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">S3 Location</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedFiles.map((file, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 text-sm">{file.file_id}</td>
                      <td className="px-4 py-2 text-sm">{file.s3_location}</td>
                      <td className="px-4 py-2 text-sm">{file.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DataProcessingPage3;
