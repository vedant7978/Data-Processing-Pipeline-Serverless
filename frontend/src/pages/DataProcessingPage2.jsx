import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

const DataProcessingPage2 = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null); // State to store processed file info
  const [error, setError] = useState(''); // State for error handling

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

    const email = localStorage.getItem('userEmail'); // Get email from localStorage
    if (!email) {
      alert('Email is missing. Please log in first.');
      return;
    }

    if (file) {
      setIsProcessing(true);

      try {
        // Convert file to base64
        const base64FileContent = await convertToBase64(file);
        console.log("base64FileContent", base64FileContent);
        // Create payload
        const payload = {
          email: email,
          body: base64FileContent, // Send base64 encoded content
        };

        // API endpoint
        const apiUrl = 'https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/dp2'; // Replace with your Lambda endpoint

        // Send payload to the backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        console.log("res", response);
        if (response.ok) {
          setIsProcessing(false);
          const result = await response.json();
          alert('Named Entity Extraction Complete!');
        } else {
          setIsProcessing(false);
          const errorMessage = await response.text();
          alert(`Error extracting entities: ${errorMessage}`);
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

  // Function to handle fetching processed files
  const handleProcessedFileFetch = async () => {
    const email = localStorage.getItem('userEmail'); // Get email from localStorage
    if (!email) {
      alert('Email is missing. Please log in first.');
      return;
    }

    try {
      const response = await fetch('https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/ProcessedData/getDP2Data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response Data:", data); // Log the response data

        // Parse the 'body' string to an actual array
        const processedFiles = JSON.parse(data.body);

        if (Array.isArray(processedFiles) && processedFiles.length > 0) {
          // Successfully fetched processed data
          setProcessedFile(processedFiles); // Update the state with the processed data
          setError(''); // Clear any previous errors
        } else {
          // No processed file found
          setProcessedFile(null);
          setError('No processed file found.');
        }
      } else {
        setError('Failed to fetch processed file data');
      }
    } catch (error) {
      console.error('Error fetching processed file data:', error);
      setError('An error occurred while fetching the processed file.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <div className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
            Named Entity Recognition
          </h1>

          {/* File Upload Section */}
          <div className="bg-white shadow-xl rounded-lg p-6 max-w-3xl mx-auto flex flex-col items-center text-center hover:shadow-2xl transition">
            <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Upload Your Text File
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div className="border-4 border-dashed border-green-500 p-10 rounded-xl flex justify-center items-center">
                <label htmlFor="file-upload" className="text-center text-gray-600 cursor-pointer w-full">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Drag & Drop or Click to Browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Only .txt files are accepted
                    </p>
                    {fileName && (
                      <p className="mt-2 text-gray-700">Selected file: {fileName}</p>
                    )}
                  </div>
                </label>
              </div>

              {/* Upload Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className={`${
                    isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  } text-white px-6 py-2 rounded-full shadow-lg transition`}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Start Extraction'}
                </button>
              </div>
            </form>

            {/* Additional Notes */}
            <p className="text-gray-600 text-sm mt-4">
              Upload a valid .txt file to extract Named Entities. Results will
              be stored in DynamoDB.
            </p>
          </div>

          {/* Processed File Section */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleProcessedFileFetch}
              className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600"
            >
              Get Processed File
            </button>
          </div>

          {/* Processed File Display */}
          <div className="mt-8 max-w-3xl mx-auto">
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {processedFile && (
              <div className="overflow-x-auto bg-white shadow-md rounded-md">
                <table className="min-w-full table-auto text-center">
                  <thead className="bg-gray-300 text-gray-800">
                    <tr>
                      <th className="px-6 py-3">File ID</th>
                      <th className="px-6 py-3">S3 Output</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedFile.map((file, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4">{file.file_id}</td>
                        <td className="px-6 py-4">
                          <a href={file.s3_output} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                            {file.s3_output}
                          </a>
                        </td>
                        <td className="px-6 py-4">{file.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DataProcessingPage2;
