import { AppBar, Box, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Select, Tab, Tabs, Toolbar } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupIcon from '@mui/icons-material/Group';
import { useEffect, useState } from 'react';
import NavigationDrawer from './innterComponents/NavigationDrawer';
import UserProfileActionAvatar from './innterComponents/UserProfileActionAvatar';
import { useLocation } from 'react-router-dom';
import linkPageMappingHelper from '../../misc/linkPageMappingHelper';
import HeaderLogoAndText from './innterComponents/HeaderLogoAndText';

function DashboardAppBar({ props }) {
    // Container Will Use in App Drawer
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    const [villageDropDownData, setVillageDropDownData] = useState(null);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');
    const [isDrowerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBar, setSelectedBar] = useState(0);
    const [linkPageMappings, setLinkPageMappings] = useState([]);
    const [currentPageName, setCurrentPageName] = useState(null);
    const location = useLocation();

    // Set Page-Path Name and Link to help Navigation Bar 
    useEffect(() => {
        const currentPath = location.pathname;
        const linkAndPagesWithActiveStatus = linkPageMappingHelper(currentPath)
        setLinkPageMappings(linkAndPagesWithActiveStatus);

        const pageName = linkAndPagesWithActiveStatus.find(x => x.isLinkActive);
        setCurrentPageName(pageName.linkPageName);
    }, [])

    //==>  Business Logic Start <=== 
    const handleVillageSelectionChange = (event) => {
        const villageKey = event.target.value
        setSelctedVillageKey(villageKey);
        //fetchVillagePartyMembers(villageKey);
    };

    const handleMemberTabBarChange = (event, newValue) => {
        setSelectedBar(newValue);
    }
    //==>  Business Logic End <=== 

    return (
        <>
            <AppBar component="nav" sx={{ boxShadow: 'none' }}>
                <Toolbar>
                    {/* ==> App Drawer Toggle Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => { setIsDrawerOpen((prevState) => !prevState) }}
                        sx={{ mr: 1 }}
                    >
                        <DehazeIcon />
                    </IconButton>

                    <HeaderLogoAndText isDashBoardAppBar='true' currentPageName={currentPageName} />

                    {/*Fill Empty Midddle Space*/}
                    <Box sx={{ flexGrow: 1 }}></Box>

                    {/* ==> Village Selection DropDown  */}
                    <FormControl className='selectItemOnAppBar' sx={{ width: { xs: 3 / 5, sm: 240 } }} size="small">
                        <InputLabel>Village</InputLabel>
                        <Select
                            value={selectedVillageKey}
                            label="Village"
                            onChange={handleVillageSelectionChange}
                        >
                            {villageDropDownData && villageDropDownData.map(vill => <MenuItem key={vill.key} value={vill.key}>{vill.val}</MenuItem>)}

                        </Select>
                    </FormControl>

                    {/* ==> User Profile Avatar  */}
                    <UserProfileActionAvatar />
                </Toolbar>

                {/* Next Line  */}
                {/* Party Members Tab Bar  */}
                <Box sx={{ background: 'white' }}>
                    <Tabs value={selectedBar} onChange={handleMemberTabBarChange} aria-label="basic tabs example">
                        <Tab icon={<ContactPhoneIcon />} iconPosition="start" label="Party Workers" />
                        <Tab icon={<GroupIcon />} iconPosition="start" label="Party Members" />
                    </Tabs>
                </Box>
            </AppBar >

            <Toolbar />
            <Tabs />

            {/* Navigation Drawer  */}
            <NavigationDrawer
                linkPageMappings={linkPageMappings}
                setIsDrawerOpen={setIsDrawerOpen}
                isDrowerOpen={isDrowerOpen}
                container={container} />
        </>
    )
}

export default DashboardAppBar