import {createContext, useContext, useEffect, useState} from "react";
import {retrieveUser} from "./AuthService.js";

const AuthContext = createContext(undefined);

export default function AuthProvider ({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            (async () => {
                try {
                    const userData = await retrieveUser();
                    console.log(userData);
                    setUser(userData);
                } catch (error) {
                    console.log(error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            })();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}