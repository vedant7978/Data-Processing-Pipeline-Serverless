import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faHome, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Get the role from localStorage
  const role = localStorage.getItem("role");

  const onLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    const baseUrl = process.env.REACT_APP_API_URL;
    try {
      const apiUrl = `${baseUrl}/dev/auth/logout`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("userEmail");

        navigate("/login");
      } else {
        console.error("Logout failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const navigateToHome = () => {
    navigate("/home");
  };

  const navigateToStats = () => {
    navigate("/user-login-stats");
  };

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        {/* Left Section: Home Icon */}
        <div className="flex-none">
          <button
            onClick={navigateToHome}
            className="btn btn-ghost btn-circle flex items-center justify-center"
            aria-label="Go to Home"
          >
            <FontAwesomeIcon icon={faHome} size="2x" className="text-white" />
          </button>
        </div>

        {/* Center Title */}
        <div className="flex flex-1 mx-6">
          <h1 className="text-xl font-bold mx-auto">Quick Data Processor</h1>
        </div>

        {/* Right Section */}
        <div className="flex-none flex items-center">
          {/* Admin-only: Stats Button */}
          {role === "Admin" && (
            <button
            onClick={navigateToStats}
            className="btn btn-sm btn-outline btn-secondary mx-2 flex items-center"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              View Stats
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faUser} size="2x" className="text-white" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={onLogout} className="flex items-center text-black">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-red-500" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;