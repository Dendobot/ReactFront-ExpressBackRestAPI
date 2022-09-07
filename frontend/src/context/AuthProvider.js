import { createContext, useState } from "react";


/*Context is designed to share data that can be considered “global” 
for a tree of React components, such as the current authenticated user*/

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;