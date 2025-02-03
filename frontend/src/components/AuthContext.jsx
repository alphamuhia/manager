import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh_token"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Check if the token is expired and refresh it
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Session expired, please log in again.");
      }

      const data = await response.json();
      setAccessToken(data.access);
      localStorage.setItem("access_token", data.access);
    } catch (error) {
      console.error("Token refresh error", error);
      logout();
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const value = { user, login, logout, accessToken, isTokenExpired, refreshAccessToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
