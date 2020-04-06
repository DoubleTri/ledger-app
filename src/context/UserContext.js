import React, { useEffect, useState } from 'react';
import { auth, fireStore } from '../firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [teamName, setTeamName] = useState(null)
    const [allData, setAllData] = useState(null)


    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser)
    }, []);

    useEffect(() => {

        if (currentUser) {
            fireStore.collection("Teams").where("uids", "array-contains", currentUser.uid).onSnapshot((snap) => {
                setAllData(snap.docs[0].data())
                setTeamName(snap.docs[0].data().teamName)
                Object.values(snap.docs[0].data().members).map((member) => {
                    if (member.uid === currentUser.uid) {
                        setUserInfo((member))
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
                allData,
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