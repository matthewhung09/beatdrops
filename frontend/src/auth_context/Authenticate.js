import { createContext, useState } from "react";

const Authenticate = createContext({});

export const AuthProvider = ({ children }) => {
    
    const [auth, setAuth] = useState({});

    return (

        <Authenticate.Provider value={{ auth, setAuth }}>

            {children}

        </Authenticate.Provider>
    )
}

export default Authenticate;