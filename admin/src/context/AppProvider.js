import React, { useState } from "react";

export const AppContext = React.createContext({
  companies: [], setCompanies: () => {},
  routeControl: [], setRoutControl: () => {},
  universalChangeCounter: 0
});

const AppProvider = ({ children }) => {
  const [routeControl, setRoutControl] = useState({
    page: "/",
    indexItem: null,
  });
  const [companies, setCompanies] = useState([]);
  const [universalChangeCounter, setUniversalChange] = useState(0);

  const onUniversalChange = () => {
    const interval = setTimeout(() => {
        setUniversalChange(universalChangeCounter + 1);
    }, 2000);

    return () => {
      clearTimeout(interval);
    };
  };

  // Pass getters and setters down to child components.
  return (
    <AppContext.Provider
      value={{
        companies, setCompanies,
        routeControl, setRoutControl,
        onUniversalChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;