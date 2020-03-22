import React, { useEffect, useState } from 'react';
import { auth, fireStore } from '../firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser)
        console.log(auth.currentUser);
    }, []);

    useEffect(() => {
        console.log(auth.currentUser);
        if (currentUser) {
            
            fireStore.collection("users").where("uid", "array-contains", currentUser.uid).onSnapshot((snap) => {
        
            })            
        }
        if (!currentUser) {
            setCurrentUser(null)
        }
    }, [currentUser]);

    let logout = () => {
        auth.signOut();
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};