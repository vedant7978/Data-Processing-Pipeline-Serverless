import React, { useState, useEffect } from "react";
import ChatInterface from "../components/ChatInterface";
import UserConcerns from "../components/UserConcerns"; 
import { db } from "../utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PubSubChatPage = () => {
  const [userRole, setUserRole] = useState(""); 
  const [selectedConcern, setSelectedConcern] = useState(null); 
  const [adminConcerns, setAdminConcerns] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "Admin") {
      setUserRole("Admin");
    } else if (role === "Customer") {
      setUserRole("Customer");
    } else {
      console.error("Unknown role: Please check the role in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (userRole === "Admin") {
      const adminEmail = localStorage.getItem("userEmail");

      if (!adminEmail) {
        console.error("Admin email not found in localStorage.");
        return;
      }

      const q = query(
        collection(db, "Concerns"),
        where("agentEmail", "==", adminEmail) 
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const concerns = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdminConcerns(concerns);
      });

      return () => unsubscribe(); 
    }
  }, [userRole]);

  const handleConcernSelect = (concern) => {
    setSelectedConcern(concern);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto py-8 px-4">
        {userRole === "Customer" && !selectedConcern && (
          <UserConcerns onSelectConcern={handleConcernSelect} />
        )}

        {userRole === "Admin" && !selectedConcern && (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Assigned Concerns
            </h1>
            {adminConcerns.length === 0 ? (
              <p className="text-center text-gray-600">
                No concerns assigned to you.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminConcerns.map((concern) => (
                  <div
                    key={concern.id}
                    onClick={() => handleConcernSelect(concern)}
                    className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                  >
                    <h2 className="text-xl font-semibold text-teal-600 mb-2">
                      Concern ID: {concern.concernId}
                    </h2>
                    <p className="text-gray-700 mb-2">
                      <strong>Customer Name:</strong> {concern.customerName}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Concern:</strong> {concern.concernText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedConcern && (
          <ChatInterface
            concernId={selectedConcern.concernId}
            customerName={selectedConcern.customerName}
            agentName={selectedConcern.agentName}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PubSubChatPage;