import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../misc/firebase';
import { child, get, ref } from 'firebase/database';

const profileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        const authUnsub = auth.onAuthStateChanged(authObj => {
            if (authObj) {

                let userProfileData;

                // Fetch Name And Profile Pic From DataBase
                get(child(ref(db), "users/" + authObj.uid)).then((snapshot) => {
                    const user = snapshot.val();

                    if (user) {
                        userProfileData = {
                            fullName: user.fullName,
                            profilePic: user.profilePic,
                            uid: authObj.uid,
                            email: authObj.email,
                            mappedVillGroupKey: user.mappedVillGroupKey
                        }

                        setProfile(userProfileData);
                        setisLoading(false);
                    }
                    else {
                        throw Object.assign(new Error('Undef'), { code: 0 });
                    }
                }).catch((e) => {
                    userProfileData = {
                        fullName: "Unknown",
                        profilePic: "",
                        uid: authObj.uid,
                        email: authObj.email,
                        mappedVillGroupKey: ''
                    }

                    setProfile(userProfileData);
                    setisLoading(false);
                });
            } else {
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
