import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    console.log('UserContext: Attempting to fetch user...');
    try {
      const res = await axios.get("${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/me", { withCredentials: true });
      setUser(res.data.user);
      console.log('UserContext: User fetched successfully:', res.data.user);
    } catch (error) {
      setUser(null);
      console.log('UserContext: Failed to fetch user, setting to null:', error);
    }
  };

  useEffect(() => {
    console.log('UserContext: Provider mounted, fetching user...');
    fetchUser();
  }, []);

  useEffect(() => {
    console.log('UserContext: User state changed to:', user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
