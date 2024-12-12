import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Hompage";
import LoginPage from "./pages/Loginpage";
import DataProcessingpage1 from "./pages/DataProcessingpage1";
import DataProcessingPage2 from "./pages/DataProcessingPage2";
import DataProcessingPage3 from "./pages/DataProcessingPage3";
import FeedbackPage from "./pages/FeedbackPage";
import StatsDashboard from "./components/StatsDashboard";
import UserConcerns from "./components/UserConcerns";
import PubSubChatPage from "./pages/PubSubChatPage"; // Import PubSubChatPage
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dataprocessing"
              element={
                  <DataProcessingpage1 />
              }
            />
            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataprocessing1"
              element={
                <ProtectedRoute>
                  <DataProcessingpage1 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataprocessing2"
              element={
                <ProtectedRoute>
                  <DataProcessingPage2 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dataprocessing3"
              element={
                <ProtectedRoute>
                  <DataProcessingPage3 />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />
            {/* Admin-only route */}
            <Route
              path="/user-login-stats"
              element={
                <ProtectedRoute adminOnly={true}>
                  <StatsDashboard />
                </ProtectedRoute>
              }
            />
            {/* PubSub Chat Page Route */}
            <Route
              path="/pubsub-chat"
              element={
                <ProtectedRoute>
                  <PubSubChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-concerns"
              element={
                <ProtectedRoute>
                  <UserConcerns />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;