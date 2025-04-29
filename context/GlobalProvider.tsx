import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "../lib/appwrite";
import {  Models } from "appwrite";

const GlobalContext = createContext({
  isLogged: false,
  setIsLogged: (value: boolean) => {},
  user: null as Models.Document | null,
  setUser: (value: Models.Document | null) => {},
  loading: true,
});
export const useGlobalContext = () => useContext(GlobalContext);

import { ReactNode } from "react";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLogged(true);
          setUser(res as Models.Document);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setIsLogged(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;