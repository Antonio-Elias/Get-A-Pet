import { createContext } from "react";
import userAuth from "../hooks/useAuth";

const Context = createContext();

function UserProvider({ children }){
    const { authenticated, register } = userAuth();

    return <Context.Provider value={{ authenticated, register }}>{children}</Context.Provider>

}

export { Context, UserProvider}