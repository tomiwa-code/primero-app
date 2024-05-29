import { getCurrentUser } from "@/lib/appwrites";
import React from "react";

type StateProps = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: null | {};
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<null | {}>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

type GlobalProviderProps = {
  children: React.ReactNode;
};

const GlobalContext = React.createContext<StateProps>({
  isLoading: false,
  isLoggedIn: false,
  user: null,
  setIsLoggedIn: () => {},
  setUser: () => {},
  setIsLoading: () => {},
});
export const useGlobalContext = () => React.useContext(GlobalContext);

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<null | {}>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const getUser = async () => {
    try {
      const res = await getCurrentUser();
      
      if (res) {
        setUser(res);
        setIsLoggedIn(true)
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        setIsLoading,
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
