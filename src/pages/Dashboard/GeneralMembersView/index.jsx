import { Box, Grid, IconButton, Input } from "@mui/material"
import GeneralMemberProfileCard from "./GeneralMemberProfileCard"
import { Close, Search } from "@mui/icons-material";
import { useState } from "react";



function GeneralMembersView({ members, openContactDrawer }) {
    const [searchBarInputText, setSearchBarInputText] = useState('');

    // Sort Memebr By Name A to Z
    members.sort((a, b) => {
        return (function (a, b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        })(a.fullName, b.fullName);
    });

    return <>
        <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
        >
            <Input
                sx={{ mr: { xs: 1, sm: 2, md: 5 }, mb: 1, "&.Mui-focused .MuiIconButton-root": { color: 'primary.main' } }}
                placeholder='Search'
                value={searchBarInputText}
                onChange={(event) => { setSearchBarInputText(event.target.value) }}
                endAdornment={
                    <>
                        <IconButton
                            sx={{ visibility: searchBarInputText.length > 0 ? "visible" : "hidden" }}
                            onClick={() => { setSearchBarInputText('') }}
                        >
                            <Close />
                        </IconButton>
                        <Search />
                    </>
                }
            />
        </Box>

        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
            {Array.from(members).filter(x => x.fullName.toLowerCase().includes(searchBarInputText.toLowerCase())).map((memberProfileData, index) => (
                <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                    <GeneralMemberProfileCard
                        memberProfileData={memberProfileData}
                        openContactDrawer={openContactDrawer} />
                </Grid>
            ))}
        </Grid >
    </>
}



export default GeneralMembersView