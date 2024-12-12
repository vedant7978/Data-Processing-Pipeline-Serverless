import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const UserConcerns = ({ onSelectConcern }) => {
  const [concerns, setConcerns] = useState([]);
  const [referenceIds, setReferenceIds] = useState([]);
  const [selectedReferenceId, setSelectedReferenceId] = useState("");
  const [newConcernText, setNewConcernText] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingConcern, setAddingConcern] = useState(false);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const customerEmail = localStorage.getItem("userEmail");

    if (!customerEmail) {
      setError("User email not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch concerns
        const concernsQuery = query(
          collection(db, "Concerns"),
          where("customerEmail", "==", customerEmail)
        );
        const querySnapshot = await getDocs(concernsQuery);
        const concernsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConcerns(concernsData);

        // Fetch reference IDs for dropdown
        const response = await fetch(
          "https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/getFileIDS",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: customerEmail }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parsedBody = JSON.parse(data.body);
          setReferenceIds(parsedBody.file_ids || []);
        } else {
          setError("Failed to fetch reference IDs.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching your data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddConcern = async (e) => {
    e.preventDefault();
    setAddingConcern(true);
    setResponseMessage(null);

    const name = localStorage.getItem("name");
    const email = localStorage.getItem("userEmail");

    if (!name || !email || !selectedReferenceId) {
      setAddingConcern(false);
      setResponseMessage("Error: Missing required information.");
      return;
    }

    const payload = {
      name,
      email,
      referenceCode: selectedReferenceId,
      concernText: newConcernText,
    };

    try {
      const response = await fetch(
        "https://us-central1-quickdataprocessorbot-kxxq.cloudfunctions.net/publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const message = await response.text();
        setResponseMessage(`Success: ${message}`);
        setNewConcernText("");
        setSelectedReferenceId("");

        const customerEmail = localStorage.getItem("userEmail");
        const concernsQuery = query(
          collection(db, "Concerns"),
          where("customerEmail", "==", customerEmail)
        );
        const querySnapshot = await getDocs(concernsQuery);
        const updatedConcerns = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConcerns(updatedConcerns);
      } else {
        const error = await response.text();
        setResponseMessage(`Error: ${error}`);
      }
    } catch (err) {
      setResponseMessage(`Error: ${err.message}`);
    } finally {
      setAddingConcern(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
         
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Concern
            </h2>
            <form onSubmit={handleAddConcern} className="space-y-4">
              <div>
                <label
                  htmlFor="referenceId"
                  className="block text-gray-600 font-medium mb-2"
                >
                  Select Reference ID
                </label>
                <select
                  id="referenceId"
                  value={selectedReferenceId}
                  onChange={(e) => setSelectedReferenceId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="" disabled>
                    {loading ? "Loading..." : "Select a Reference ID"}
                  </option>
                  {referenceIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={newConcernText}
                onChange={(e) => setNewConcernText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your concern"
                rows="4"
                required
              ></textarea>
              <button
                type="submit"
                disabled={addingConcern}
                className={`w-full px-4 py-3 text-white font-bold rounded-lg shadow ${
                  addingConcern
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {addingConcern ? "Adding..." : "Add Concern"}
              </button>
            </form>
            {responseMessage && (
              <div
                className={`mt-4 text-center font-medium ${
                  responseMessage.startsWith("Success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {responseMessage}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Concerns
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : concerns.length === 0 ? (
              <p className="text-gray-500">No concerns found.</p>
            ) : (
              <div className="space-y-4">
                {concerns.map((concern) => (
                  <div
                    key={concern.id}
                    onClick={() => onSelectConcern && onSelectConcern(concern)}
                    className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition ${
                      onSelectConcern ? "hover:bg-gray-50" : ""
                    }`}
                  >
                    <h3 className="text-lg font-bold text-teal-600">
                      Concern ID: {concern.concernId || "N/A"}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      <strong>Concern:</strong> {concern.concernText || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      <strong>Agent Name:</strong> {concern.agentName || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserConcerns;
