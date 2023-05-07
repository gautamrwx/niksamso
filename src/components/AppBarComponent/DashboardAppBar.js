import { AppBar, Box, CircularProgress, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, Tab, Tabs, Toolbar, } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupIcon from '@mui/icons-material/Group';
import { useEffect, useState } from 'react';
import NavigationDrawer from './innterComponents/NavigationDrawer';
import UserProfileActionAvatar from './innterComponents/UserProfileActionAvatar';
import { useLocation } from 'react-router-dom';
import linkPageMappingHelper from '../../misc/linkPageMappingHelper';
import HeaderLogoAndText from './innterComponents/HeaderLogoAndText';

function DashboardAppBar({
    props,
    villageDropDownData,
    selectedVillageKey,
    isLoadingVillageList,
    handleVillageSelectionChange,
    selectedTabBarIndex,
    setSelectedTabBarIndex }) {

    // Container Will Use in App Drawer
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    const location = useLocation();

    const [isDrowerOpen, setIsDrawerOpen] = useState(false);
    const [linkPageMappings, setLinkPageMappings] = useState([]);
    const [currentPageName, setCurrentPageName] = useState(null);

    // Set Page-Path Name and Link to help Navigation Bar 
    useEffect(() => {
        const currentPath = location.pathname;
        const linkAndPagesWithActiveStatus = linkPageMappingHelper(currentPath)
        setLinkPageMappings(linkAndPagesWithActiveStatus);

        const pageName = linkAndPagesWithActiveStatus.find(x => x.isLinkActive);
        setCurrentPageName(pageName.linkPageName);
    }, [location.pathname]);

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
                    <Box sx={{ width: { xs: 3 / 5, sm: 240, md: 340 }, ml: 1 }}>
                        <FormControl className='selectItemOnAppBar' fullWidth size="small">
                            <InputLabel>Village</InputLabel>
                            <Select
                                disabled={isLoadingVillageList}
                                value={selectedVillageKey}
                                label="Village"
                                onChange={handleVillageSelectionChange}
                            >
                                {villageDropDownData && villageDropDownData.map(vill => <MenuItem key={vill.key} value={vill.key}>{vill.val}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {isLoadingVillageList && <LinearProgress />}
                    </Box >

                    {/* ==> User Profile Avatar  */}
                    <UserProfileActionAvatar />
                </Toolbar>

                {/* Next Line  */}
                {/* Party Members Tab Bar  */}
                <Box sx={{ background: 'white' }}>
                    <Tabs
                        value={selectedTabBarIndex}
                        onChange={(event, newValue) => {
                            setSelectedTabBarIndex(newValue);
                        }}
                        aria-label="basic tabs example">
                        <Tab icon={<ContactPhoneIcon />} iconPosition="start" label="Party Workers" />
                        <Tab icon={<GroupIcon />} iconPosition="start" label="Party Members" />
                    </Tabs>
                </Box>
            </AppBar >

            <Box component={Toolbar} p={0} height={130} />

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