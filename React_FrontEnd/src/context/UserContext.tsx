import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LoggedUser } from '../types/LoggedUser';

interface UserContextType {
    user: LoggedUser | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    setUser: (user: LoggedUser | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LoggedUser | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        axios.get('http://localhost:3001/api/users/profile', { withCredentials: true })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((err) => {
                    console.error("Failed to fetch profile:", err);
                    setUser(null);
                }).finally(() => setLoading(false));
    };

    // /**
    //  * Log out the user by calling the server and clearing state
    //  */
    // const logout = async () => {
    //     try {
    //         await axios.post('http://localhost:3001/api/users/logout', {}, { withCredentials: true });
    //         setUser(null);
    //     } catch (error) {
    //         console.error('Failed to log out:', error);
    //     }
    // };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser}}>
            {!loading ? children : <p>Loading...</p>}
        </UserContext.Provider>
    );
};
