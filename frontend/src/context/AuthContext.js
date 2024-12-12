import React, { createContext, useContext, useEffect, useState } from "react";

// Key used to store the token in local storage
const AUTH_TOKEN_KEY = "token";

// Create the AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem(AUTH_TOKEN_KEY));

  // Function to set the user as logged in
  const setUserLoggedIn = (token) => {
    setAuthToken(token);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    setIsUserLoggedIn(true);
  };

  // Function to log the user out
  const setUserLoggedOut = () => {
    setAuthToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsUserLoggedIn(false);
  };

  // Automatically check for token on app load
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        isUserLoggedIn,
        setUserLoggedIn,
        setUserLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);