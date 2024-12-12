import React, { useState, useEffect } from "react";
import FeedbackForm from "../components/FeedbackForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FeedbackPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]); // State to store feedbacks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const openFeedbackForm = () => setShowForm(true);
  const closeFeedbackForm = () => setShowForm(false);

  // Fetch feedbacks from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("https://us-central1-serverless-440117.cloudfunctions.net/getAllFeedbacks");
        if (!response.ok) {
          throw new Error("Failed to fetch feedbacks");
        }
        const data = await response.json();
        setFeedbacks(data); // Set the feedbacks in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Content Section */}
      <main className="flex-grow overflow-auto p-6 bg-gray-50">
        {/* Header Row with Title and Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-center flex-1">User Feedbacks</h2>
          <button
            onClick={openFeedbackForm}
            className="btn btn-primary px-6 py-2 rounded-lg"
          >
            Give Feedback
          </button>
        </div>

        {/* Loading State */}
        {loading && <p>Loading feedbacks...</p>}
        
        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Feedback Table */}
        {!loading && !error && feedbacks.length > 0 ? (
          <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Reference ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th> {/* Added Name Column */}
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id}>
                    <td className="border border-gray-300 px-4 py-2">{feedback.referenceId}</td>
                    <td className="border border-gray-300 px-4 py-2">{feedback.name}</td> {/* Display Name */}
                    <td className="border border-gray-300 px-4 py-2">{feedback.description}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{feedback.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // No feedbacks message
          !loading && <p>No feedbacks yet! Fetch and display them here later.</p>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Feedback Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button
              onClick={closeFeedbackForm}
              className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <FeedbackForm onClose={closeFeedbackForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;