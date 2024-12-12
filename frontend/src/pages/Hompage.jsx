import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faFileAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';

const Homepage = () => {
  const navigate = useNavigate(); // Create navigate function using useNavigate

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex-1 bg-gray-100 py-12">
        <div className="container mx-auto px-6 md:px-12">
          <h1 className="text-4xl font-extrabold text-center text-gray-700 mb-10">Choose Data Processing</h1>

          {/* Cards for each data processing option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Data Processing 1 */}
            <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition">
              <FontAwesomeIcon icon={faUpload} size="3x" className="text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">JSON to CSV</h3>
              <p className="text-gray-600 mb-4">Convert your JSON file to CSV</p>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition"
                onClick={() => navigate('/dataprocessing1')} // Use navigate for redirect
              >
                Process Now
              </button>
            </div>

            {/* Data Processing 2 */}
            <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition">
              <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Named Entity Recognition</h3>
              <p className="text-gray-600 mb-4">Extract named entities from a text file.</p>
              <button
                className="bg-green-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
                onClick={() => navigate('/dataprocessing2')} // Use navigate for redirect
              >
                Process Now
              </button>
            </div>

            {/* Data Processing 3 */}
            <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition">
              <FontAwesomeIcon icon={faChartLine} size="3x" className="text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Word Cloud</h3>
              <p className="text-gray-600 mb-4">Generate a word cloud from a text file.</p>
              <button
                className="bg-purple-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-purple-600 transition"
                onClick={() => navigate('/dataprocessing3')} // Use navigate for redirect
              >
                Process Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;
