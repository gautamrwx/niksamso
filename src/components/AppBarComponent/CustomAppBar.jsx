import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { useEffect, useState } from 'react';
import NavigationDrawer from './innterComponents/NavigationDrawer';
import UserProfileActionAvatar from './innterComponents/UserProfileActionAvatar';
import { useLocation } from 'react-router-dom';
import linkPageMappingHelper from '../../misc/linkPageMappingHelper';
import HeaderLogoAndText from './innterComponents/HeaderLogoAndText';
import PartyPeoplesSelectionTabBar from './innerTabBarComponent/PartyPeoplesSelectionTabBar';
import VillageSelector from './innerSelectionComponent/VillageSelector';

export default function CustomAppBar({
    props,
    rightSideComponent,
    handleVillageSelectionChange,
    setIsVillageSelected,
    tabSelectionBarVisible,
    selectedTabBarIndex,
    setSelectedTabBarIndex
}) {

    // Container Will Use in App Drawer
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    const [isDrowerOpen, setIsDrawerOpen] = useState(false);
    const [linkPageMappings, setLinkPageMappings] = useState([]);
    const [currentPageName, setCurrentPageName] = useState(null);

    // Set Page-Path Name and Link to help Navigation Bar 
    const location = useLocation();
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

                    {/* ==> App Drawer Logo And Text */}
                    <HeaderLogoAndText
                        isRightSideComponentOccupied={rightSideComponent ? true : false}
                        currentPageName={currentPageName}
                    />

                    {/*==> Fill Empty Midddle Space */}
                    <Box sx={{ flexGrow: 1 }}></Box>


                    {/*==> Right Side Component*/}
                    {
                        rightSideComponent === 'VillageSelector' &&
                        <VillageSelector
                            setIsVillageSelected={setIsVillageSelected}
                            handleVillageSelectionChange={handleVillageSelectionChange}
                        />
                    }

                    {/* User Profile Avatar  */}
                    <UserProfileActionAvatar />
                </Toolbar>

                {/* Party Members Tab Bar  */}
                {
                    tabSelectionBarVisible &&
                    <PartyPeoplesSelectionTabBar
                        selectedTabBarIndex={selectedTabBarIndex}
                        setSelectedTabBarIndex={setSelectedTabBarIndex}
                    />
                }
            </AppBar >

            {/* Occupy Used Space  */}
            {
                tabSelectionBarVisible
                    ? <Box component={Toolbar} p={0} height={135} />
                    : <Toolbar />
            }

            {/* Navigation Drawer  */}
            <NavigationDrawer
                linkPageMappings={linkPageMappings}
                setIsDrawerOpen={setIsDrawerOpen}
                isDrowerOpen={isDrowerOpen}
                container={container} />
        </>
    )
}