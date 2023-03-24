import { createContext } from "react";
import userAuth from "../hooks/useAuth";

const Context = createContext();

function UserProvider({ children }){
    const { authenticated, register, logout, login } = userAuth();

    return <Context.Provider value={{ authenticated, register, logout, login }}>{children}</Context.Provider>

}

export { Context, UserProvider}