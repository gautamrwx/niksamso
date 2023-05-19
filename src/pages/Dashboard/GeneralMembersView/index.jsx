import { Grid } from "@mui/material"
import GeneralMemberProfileCard from "./GeneralMemberProfileCard"



function GeneralMembersView({ members, openContactDrawer }) {

    // Sort Memebr By Name A to Z
    members.sort((a, b) => {
        return (function (a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        })(a.name, b.name);
    });

    return <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
        {Array.from(members).map((memberProfileData, index) => (
            <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                <GeneralMemberProfileCard
                    memberProfileData={memberProfileData}
                    openContactDrawer={openContactDrawer} />
            </Grid>
        ))}
    </Grid >
}



export default GeneralMembersView