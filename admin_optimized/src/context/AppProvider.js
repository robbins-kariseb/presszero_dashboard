import React, { useState } from "react";
import Users from "../controllers/user.controller";
import QuerySets from "../controllers/dashboard.controller";

export const AppContext = React.createContext({
  companies: [], setCompanies: () => {},
  routeControl: [], setRoutControl: () => {},
  universalChangeCounter: 0,
  applicationTabs: 0,
});

const AppProvider = ({ children }) => {
  const [USERS] = React.useState(new Users())
  const [userData,setUserData] = React.useState(null)
  const [notification,setNotification] = React.useState("")
  const [warning,setWarning] = React.useState("")
  const [confirmation, setConfirmation] = React.useState(null)
  const [companyList, setCompanyList] = React.useState([])
  const [routeControl, setRoutControl] = useState({
    page: "/",
    indexItem: null,
  });
  const [applicationTabs, setApplicationTabs] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [indexedViewData, setIndexedViewData] = useState({});
  const [universalChangeCounter, setUniversalChange] = useState(0);

  const onUniversalChange = (recursion=false) => {
    const interval = setTimeout(() => {
        setUniversalChange(universalChangeCounter + 1);
    }, 2000);

    return () => {
      if (!recursion){
        setTimeout(() => {
          onUniversalChange(true)
        }, 1000);
      }
      clearTimeout(interval);
    };
  };

  const handleAlert = (message) => {
    setNotification(message)

    const interval = setTimeout(() => {
      setNotification("")
      return ()=> clearInterval(interval)
    }, 10000);
  }

  const handleWarning = (message) => {
    setWarning(message)

    const interval = setTimeout(() => {
      setWarning("")
      return ()=> clearInterval(interval)
    }, 10000);
  }

  const handleUserSignIn = async ({username, password, verification}) => {
    if (verification === undefined) {
      // Handle password Sign In
      const user = await USERS.signIn({password,username})
      if (user.response === "successful" && user.userData && (user.userData.accessGroup === "super-user" || user.userData.accessGroup === "ghost-user")) {
        localStorage.setItem('user_data', JSON.stringify(user))
        return true;
      } else {
        // handleAlert("Invalid username or password!")
        return false;
      }
    } else {
      // Handle mobile Sign In
      return false;
    }
  }

  const handleCompanyStream = () => {
    const controller = new QuerySets()

    setTimeout(async () => {
      if (companyList.length === 0)
      await controller.streamAllCompanies(setCompanyList)
    }, 50);
  }

  React.useEffect(() => {
    // Check if user data exists in local storage
    const storedUserData = localStorage.getItem('user_data');
    const user = storedUserData ? JSON.parse(storedUserData) : null
    setUserData(user);

    if (user === null) {
      if (!window.location.href.includes("/login")) window.location.href = "/login";
    }

    // if (companyList.length === 0) {
    //   handleCompanyStream()
    // }
  }, []); 

  
  React.useEffect(() => {
    handleCompanyStream()
  }, [universalChangeCounter]); 

  // Pass getters and setters down to child components.
  return (
    <AppContext.Provider
      value={{
        companies, setCompanies,
        routeControl, setRoutControl,
        onUniversalChange,
        universalChangeCounter,
        handleUserSignIn,
        indexedViewData, 
        setIndexedViewData,
        applicationTabs, 
        setApplicationTabs,
        notification,
        handleAlert,
        userData,
        handleWarning,
        warning,
        confirmation, 
        setConfirmation,
        companyList
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;