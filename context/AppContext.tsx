import { createContext, useContext, useState } from 'react';

type AppContextType = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

const AppContext = createContext<AppContextType>({
  refreshTrigger: 0,
  triggerRefresh: () => {},
});



export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext); 