import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const DataProcessingPage1 = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null); // State to store processed file info
  const [error, setError] = useState(''); // State for error handling
  const [processedFiles, setProcessedFiles] = useState(
    parseInt(localStorage.getItem("processedFiles")) || 0
  );
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  const token = localStorage.getItem("token");
  // Handle file upload and processing
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = token ? localStorage.getItem('userEmail') : "";
    // Get email from localStorage
   
    if (file) {
      setIsProcessing(true);

      try {
        // Read file content as base64
        const fileContent = await file.text(); // Read file as text
        const base64Content = btoa(fileContent); // Convert to base64
        console.log("base64content", base64Content);
        // Create payload
        const payload = {
          email: email,
          body: base64Content,
        };
        if (processedFiles >= 2) {
          alert("Guest users can only process up to 2 files.");
          return;
        }
        // API endpoint
        const apiUrl = 'https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/dp1';

        // Send payload to the backend
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
     
        console.log("response", response);
        if (response.ok) {
          if(!token)
          {
            localStorage.setItem("processedFiles", processedFiles + 1);
            setProcessedFiles(processedFiles + 1);
          }
          setIsProcessing(false);
          alert('File uploaded and processing started!');
        } else {
          setIsProcessing(false);
          const errorMessage = await response.text();
          alert(`Error uploading file: ${errorMessage}`);
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
    
  
    const email = token ? localStorage.getItem('userEmail') : "";
    try {
      const response = await fetch('https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/ProcessedData/getDP1Data', {
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
         {token && (
          <Header />
      )}
     

      <div className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
            Convert JSON to CSV
          </h1>

          {/* File Upload Section */}
          <div className="bg-white shadow-md rounded-xl p-8 max-w-3xl mx-auto space-y-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Upload Your JSON File
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div className="border-4 border-dashed border-indigo-500 p-10 rounded-xl flex justify-center items-center">
                <label htmlFor="file-upload" className="text-center text-gray-600 cursor-pointer w-full">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="space-y-4">
                    <FontAwesomeIcon icon={faUpload} size="3x" className="text-indigo-600" />
                    <p className="text-lg font-semibold">Drag & Drop or Click to Browse</p>
                    <p className="text-sm text-gray-500">Only .json files are accepted</p>
                    {fileName && <p className="mt-2 text-gray-700">Selected file: {fileName}</p>}
                  </div>
                </label>
              </div>

              {/* Upload Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className={`${
                    isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white px-8 py-3 rounded-full shadow-md`}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Start Conversion'}
                </button>
              </div>
            </form>

            {/* Additional Notes */}
            <p className="text-center text-gray-600 text-sm">
              Please upload a valid JSON file for conversion. You will receive a CSV once the conversion is completed.
            </p>
          </div>

          {/* Processed File Section */}
          {token && (
           <div className="mt-8 flex justify-center">
           <button
             onClick={handleProcessedFileFetch}
             className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700"
           >
             Get Processed File
           </button>
         </div>
          )}
                  <div className="flex items-center justify-center mt-10">
  {token ? (
    <p />
  ) : (
    
    <p className="text-center text-lg ">
      Please log in to access the result.
    </p>

  )}
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
                          <a href={file.s3_output} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
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
      {token && (
          <Footer />
      )}
    </div>
  );
};

export default DataProcessingPage1;
