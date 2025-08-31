import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Helper function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };

  // Helper function to set token in localStorage
  const setToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  // Helper function to remove token from localStorage
  const removeToken = () => {
    localStorage.removeItem("jwtToken");
  };

  useEffect(() => {
    if (location.pathname === "/") return;

    async function fetchUser() {
      try {
        const token = getToken();
        if (!token) {
          setAuthData(null);
          setLoading(false);
          return;
        }

        // Include token in Authorization header instead of relying on cookies
        const response = await axios.get("http://13.61.114.153:8082/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Map the backend field names to frontend expected names
        const userData = {
          token: token,
          ...response.data,
          // Map profile_pic to profilePic for consistency
          profilePic: response.data.profile_pic || response.data.profilePic
        };


        setAuthData(userData);
      } catch (err) {
        console.error("User fetch failed", err);
        removeToken();
        setAuthData(null);
      }
      setLoading(false);
    }

    fetchUser();
  }, [location.pathname]);

  const loginUser = (data) => {
    // Also map profile_pic to profilePic on login
    const mappedData = {
      ...data,
      profilePic: data.profile_pic || data.profilePic
    };
    setAuthData(mappedData);
    setToken(data.token);
  };

  const logoutUser = async () => {
    try {
      const token = getToken();
      await axios.post(
        "http://13.61.114.153:8082/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setAuthData(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ authData, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Add and export this custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}