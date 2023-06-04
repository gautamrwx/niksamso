import { createContext, useContext, useEffect, useState } from 'react';
import { useProfile } from './profile.context';
import { db } from '../misc/firebase';
import { onValue, ref } from 'firebase/database';

const VillagesCtx = createContext();

export const VillagesProvider = ({ children }) => {
    const { profile } = useProfile();

    const [villGroupKey, setVillGroupKey] = useState(null);
    const [villages, setVillages] = useState([]);

    // Fetch All Villages 
    useEffect(() => {
        const villageGroupRef = ref(db, 'villageGroupList/' + villGroupKey);
        onValue(villageGroupRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const villages = [];
                Object.keys(data).map(villageKey =>
                    villages.push({ villageKey, villGroupKey, ...data[villageKey] })
                );

                setVillages(villages);
            }
        });
    }, [villGroupKey]);

    useEffect(() => {
        if (profile && profile.mappedVillGroupKey !== villGroupKey) {
            setVillGroupKey(profile.mappedVillGroupKey);
        }
        // eslint-disable-next-line
    }, [profile]);

    return (
        <VillagesCtx.Provider value={{ villages }}>
            {children}
        </VillagesCtx.Provider>
    );
};

export const useVillages = () => useContext(VillagesCtx);
