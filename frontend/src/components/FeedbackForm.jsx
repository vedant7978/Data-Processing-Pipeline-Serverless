import React, { useState, useEffect } from "react";

const FeedbackForm = ({ onClose }) => {
  const [referenceId, setReferenceId] = useState("");
  const [description, setDescription] = useState("");
  const [fileIds, setFileIds] = useState([]); // State for file IDs
  const [loading, setLoading] = useState(false); // Loading state for the dropdown

  // Fetch file IDs on component mount
  useEffect(() => {
    const fetchFileIds = async () => {
      const email = localStorage.getItem("userEmail"); // Retrieve email from local storage
      if (!email) {
        alert("User email is not available in local storage. Please log in first.");
        return;
      }

      try {
        setLoading(true); // Set loading to true
        const response = await fetch(
          "https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/getFileIDS",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parsedBody = JSON.parse(data.body); // Parse the `body` field
          setFileIds(parsedBody.file_ids || []); // Update state with file IDs
        } else {
          alert("Failed to fetch file IDs. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching file IDs:", error);
        alert("Error fetching file IDs. Please try again.");
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchFileIds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = localStorage.getItem("name"); // Retrieve name from local storage
    if (!name) {
      alert("User name is not available in local storage. Please log in first.");
      return;
    }

    const feedbackData = { referenceId, description, name };

    try {
      const response = await fetch(
        "https://us-central1-serverless-440117.cloudfunctions.net/getFeedback/saveFeedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        }
      );

      if (response.ok) {
        setReferenceId("");
        setDescription("");

        if (onClose) onClose();
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4 text-purple-800">
        Quick Data Processor Feedback
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="referenceId"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Reference ID
          </label>
          <select
            id="referenceId"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
            required
          >
            <option value="" disabled>
              {loading ? "Loading..." : "Select a Reference ID"}
            </option>
            {fileIds.map((fileId) => (
              <option key={fileId} value={fileId}>
                {fileId}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-500"
            placeholder="Enter your feedback here"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-500"
            disabled={loading} // Disable button if loading
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;