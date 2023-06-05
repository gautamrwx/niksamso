import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import logo from '../../../images/logo.png'
import { Link } from 'react-router-dom';
import { CircleSharp } from '@mui/icons-material';

const drawerWidth = 240;

function NavigationDrawer({ linkPageMappings, container, isDrowerOpen, setIsDrawerOpen }) {
    const handleNavDrawerBoxPress = () => {
        setIsDrawerOpen((prevState) => !prevState);
    }

    return (
        <Box component="nav">
            <SwipeableDrawer
                container={container}
                variant="temporary"
                open={isDrowerOpen}
                onClose={() => { setIsDrawerOpen((prevState) => !prevState) }}
                onOpen={() => { setIsDrawerOpen((prevState) => !prevState) }}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                <Box
                    onClick={handleNavDrawerBoxPress}
                    sx={{ textAlign: 'center' }}                >
                    <Box
                        width={130}
                        component="img"
                        src={logo}
                    />
                    <Divider />
                    <List>
                        {linkPageMappings.map((item) => (
                            item.visibleInNavBar &&
                            <ListItem key={item.linkPath} disablePadding>
                                <ListItemButton
                                    selected={item.isLinkActive}
                                    component={Link}
                                    to={item.linkPath}
                                >
                                    <ListItemIcon>
                                        <item.drawerIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.linkPageName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </SwipeableDrawer>
        </Box>
    )
}

export default NavigationDrawer;