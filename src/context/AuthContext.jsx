import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login functionimport axios from "axios";

const login = async (username, password) => {
  try {
    const response = await axios.post(
      "https://dummyjson.com/auth/login",
      `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const loggedUser = response.data;
    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    console.log("Login successful:", loggedUser);
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert("Invalid credentials!");
  }
};



  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
