import { createContext, useContext, useState } from 'react';

const selectedProfilePicContext = createContext();

export const SelectedProfilePicProvider = ({ children }) => {
    const [selectedProfilePicData, setSelectedProfilePicData] = useState({
        selectedIndex: null,
        profilePicThumbnail: '',
        profilePic: '',
        fullName: ''
    });
    const [isProfilePicDrawerOpen, setIsProfilePicDrawerOpen] = useState(false);


    return (
        <selectedProfilePicContext.Provider value={{
            selectedProfilePicData,
            setSelectedProfilePicData,
            isProfilePicDrawerOpen,
            setIsProfilePicDrawerOpen
        }}>
            {children}
        </selectedProfilePicContext.Provider>
    );
};

export const useProfilePicCtx = () => useContext(selectedProfilePicContext);
