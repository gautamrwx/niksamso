import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../misc/firebase';
import { onValue, ref } from 'firebase/database';
import logoff from '../misc/logOut';

const profileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        const authUnsub = auth.onAuthStateChanged(authObj => {
            if (authObj) {
                // Fetch Name And Profile Pic From DataBase
                const usersRef = ref(db, "users/" + authObj.uid);
                onValue(usersRef, (snapshot) => {
                    const user = snapshot.val();

                    if (user) {
                        const userProfileData = {
                            fullName: user.fullName,
                            profilePicThumbnail: user.profilePicThumbnail,
                            profilePicFull: user.profilePicFull,
                            uid: authObj.uid,
                            email: authObj.email,
                            mappedVillGroupKey: user.mappedVillGroupKey
                        }

                        setProfile(userProfileData);
                        setisLoading(false);
                    }
                    else {
                        alert('User Not Found In Database');
                        logoff();
                        setProfile(null);
                        setisLoading(false);
                    }
                });
            } else {
                logoff();
                setProfile(null);
                setisLoading(false);
            }
        });

        return () => {
            authUnsub();
        };
    }, []);

    return (
        <profileContext.Provider value={{ profile, isLoading, setProfile }}>
            {children}
        </profileContext.Provider>
    );
};

export const useProfile = () => useContext(profileContext);
