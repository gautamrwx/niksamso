import { Grid } from "@mui/material";
import PartyMemberProfileCard from "./PartyMemberProfileCard";
import ProfilePicViewDrawer from "./ProfilePicViewDrawer";

function PartyMembersView({ members, openContactDrawer }) {
    return (
        <>
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 4, lg: 6 }}>
                {Array.from(members).map((memberProfileData, index) => (
                    <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                        <PartyMemberProfileCard
                            memberProfileData={memberProfileData}
                            openContactDrawer={openContactDrawer}
                            index={index}
                        />
                    </Grid>
                ))
                }
            </Grid >

            <ProfilePicViewDrawer
                anchor='bottom'
            />
        </>
    )
}

export default PartyMembersView