import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom"; 
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["jwtToken"]);
  const [authData, setAuthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); 

  
  useEffect(() => {
    
    if (location.pathname === "/") return; 
    async function fetchUser() {
      console.log("Fetching user dataaaa...");
      try {
        const response = await axios.get("http://localhost:8080/api/auth/user", {
          withCredentials: true,
        });
        setAuthData({ token: cookies.jwtToken, ...response.data });
      } catch (err) {
        console.error("User fetch failed", err);
        removeCookie("jwtToken", { path: "/" });
        setAuthData(null);
      }
      setLoading(false);
    }
    fetchUser();
  }, [cookies.jwtToken, location.pathname]); 

  
  const loginUser = (data) => {
    setAuthData(data);
    setCookie("jwtToken", data.token, { path: "/", secure: false, httpOnly: false, maxAge: 7 * 24 * 60 * 60 });
  };

  
  const logoutUser = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setAuthData(null);
    removeCookie("jwtToken", { path: "/" });
  };

  return (
    <AuthContext.Provider value={{ authData, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
