import { useState } from 'react';
import logoff from '../misc/logOut';
import { AppBar, Avatar, Box, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Select, Tab, Tabs, Toolbar, Tooltip, Typography } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupIcon from '@mui/icons-material/Group';
import { useProfile } from '../context/profile.context';
import { child, get, off, onValue, ref } from 'firebase/database';
import { db } from '../misc/firebase';
import { useEffect } from 'react';
import DashboardAppBar from '../components/AppBarComponent/DashboardAppBar';

function Dashboard(props) {
    // const { profile } = useProfile();

    const [value, setValue] = useState(0);
    const [partyMembersInfo, setPartyMembersInfo] = useState(null);

    // Fetch Village Party Members   ---  
    // const fetchVillagePartyMembers = (villageKey) => {
    //     const mapPartyMemberRef = ref(db, "map-vill-patyMem/" + villageKey);

    //     onValue(mapPartyMemberRef, (snapshot) => {
    //         const partyMemberDbKey = snapshot.val();

    //         if (partyMemberDbKey) {
    //             executeFetchVillagePartyMembers(partyMemberDbKey);
    //         } else {
    //             setPartyMembersInfo(null)
    //         }

    //         mapPartyMemberRef && off(mapPartyMemberRef);
    //     })
    // }

    // Execute
    // const executeFetchVillagePartyMembers = (partyMemberDbKey) => {
    //     const partyMemberRef = ref(db, "partyMember/" + partyMemberDbKey);

    //     onValue(partyMemberRef, (snapshot) => {
    //         const partyMember = snapshot.val();

    //         if (partyMember) {
    //             setPartyMembersInfo(partyMember);
    //         } else {
    //             setPartyMembersInfo(null)
    //         }
    //     });
    // }

    // ---- Initializing Dashboard (fetch Village list) ----
    // useEffect(() => {
    //     // Step 1. Fetch User-Vllage Key Mapping
    //     (function () {
    //         get(child(ref(db), 'mapping-User-villageListData/' + profile.uid)).then((snapshot) => {
    //             const villageListDataKey = snapshot.val();

    //             // Step 2. Fetch User-Vllage Key Mapping
    //             villageListDataKey && fetchAllVillageForCurrUser(villageListDataKey);
    //         }).catch((error) => {
    //             console.log(error);
    //         });
    //     })();

    //     // Step 2. Fetch All Villages ( Display in DropDown )
    //     const fetchAllVillageForCurrUser = (villageListDataKey) => {
    //         get(child(ref(db), "villageListData/" + villageListDataKey)).then((snapshot) => {
    //             const villListObject = snapshot.val();
    //             if (villListObject) {
    //                 // Convert JsonList Into Array
    //                 const arrVillList = [];
    //                 Object.keys(villListObject).forEach(function (key) {
    //                     arrVillList.push({
    //                         'key': key,
    //                         'val': villListObject[key]
    //                     });
    //                 });

    //                 // Short Villages By Name
    //                 const compareStrings = (a, b) => {
    //                     a = a.toLowerCase();
    //                     b = b.toLowerCase();
    //                     return (a < b) ? -1 : (a > b) ? 1 : 0;
    //                 }
    //                 arrVillList.sort((a, b) => {
    //                     return compareStrings(a.val, b.val);
    //                 });

    //                 // Set Array data in DropDown Input
    //                 setVillageDropDownData(arrVillList);
    //             }
    //         });
    //     }
    // }, [profile]);

    // Tab View Thing
    const TabPanel = ({ children, value, index, ...other }) => {
        return (
            <div role="tabpanel" hidden={value !== index} {...other}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Box>{children}</Box>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>
            <DashboardAppBar props={props} />

            <TabPanel value={value} index={0}>
                {partyMembersInfo ? JSON.stringify(partyMembersInfo.vip) : "Data Not Uploaded"}
            </TabPanel>
            <TabPanel value={value} index={1}>
                {partyMembersInfo ? JSON.stringify(partyMembersInfo.member) : "Data Not Uploaded"}
            </TabPanel>
        </>
    );
}

export default Dashboard;
