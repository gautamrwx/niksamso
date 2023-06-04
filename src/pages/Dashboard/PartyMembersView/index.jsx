import { Grid } from "@mui/material";
import PartyMemberProfileCard from "./PartyMemberProfileCard";
import ProfilePicViewDrawer from "./ProfilePicViewDrawer";
import { useState } from "react";
import { ref, update } from 'firebase/database';
import { db } from "../../../misc/firebase";

function PartyMembersView({
    partyPeopleKey,
    members,
    openContactDrawer
}) {

    const [isProfilePicDrawerOpen, setIsProfilePicDrawerOpen] = useState(false);
    const [profilePicDrawerData, setProfilePicDrawerData] = useState({});
    const [selectedProfilePicIndex, setSselectedProfilePicIndex] = useState(null);
    const [imageUploadLocation, setImageUploadLocation] = useState(null);

    const handleAvatarClickEvent = (selectedProfileData, selectedIndex) => {
        setIsProfilePicDrawerOpen(true);
        setSselectedProfilePicIndex(selectedIndex);
        setImageUploadLocation(`ProfilePictures/PartyMembers/${partyPeopleKey}/${selectedIndex}`);
        setProfilePicDrawerData(selectedProfileData);
    }

    const handleProfilePicDrawerClose = () => {
        setIsProfilePicDrawerOpen(false);
        setSselectedProfilePicIndex(null);
        setImageUploadLocation(null);
        setProfilePicDrawerData({});
    }

    const handleUploaedImageUrl = ({ profilePicFull, profilePicThumbnail }) => {
        // Update Image Backend Database
        const updates = {}

        // 1. Assign User Profile Information
        updates['/partyPeoples/' + partyPeopleKey + '/partyMembers/' + selectedProfilePicIndex + '/profilePicFull'] = profilePicFull
        updates['/partyPeoples/' + partyPeopleKey + '/partyMembers/' + selectedProfilePicIndex + '/profilePicThumbnail'] = profilePicThumbnail

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {
            //onsuccess
        }).catch((error) => {
            alert("Failed To Update");
        });

        // Update Image in Local Database
    }

    return (
        <>
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}>
                {Array.from(members).map((memberProfileData, index) => (
                    <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                        <PartyMemberProfileCard
                            memberProfileData={memberProfileData}
                            openContactDrawer={openContactDrawer}
                            handleAvatarClickEvent={handleAvatarClickEvent}
                            index={index}
                        />
                    </Grid>
                ))
                }
            </Grid >

            <ProfilePicViewDrawer
                anchor='bottom'
                isProfilePicDrawerOpen={isProfilePicDrawerOpen}
                handleProfilePicDrawerClose={handleProfilePicDrawerClose}
                profilePicDrawerData={profilePicDrawerData}
                imageUploadLocation={imageUploadLocation}
                handleUploaedImageUrl={handleUploaedImageUrl}
            />
        </>
    )
}

export default PartyMembersView