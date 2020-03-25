import React, { useEffect, useState } from 'react';
import { auth, fireStore } from '../firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [teamName, setTeamName] = useState(null)


    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser)
    }, []);

    useEffect(() => {

        if (currentUser) {
            fireStore.collection("Teams").where("uids", "array-contains", currentUser.uid).onSnapshot((snap) => {
                setTeamName(snap.docs[0].data().teamName)
                snap.docs[0].data().members.map((member) => {
                    if (Object.values(member)[0].uid === currentUser.uid) {
                        setUserInfo(Object.values(member)[0])
                    }
                })
            })            
        }

        if (!currentUser) {
            setCurrentUser(null)
        }
        
    }, [currentUser]);


    let logout = () => {
        auth.signOut();
        setTeamName(null)
        setUserInfo(null)
        setCurrentUser(null)
    }


    return (
        <AuthContext.Provider
            value={{
                currentUser,
                userInfo,
                teamName,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};