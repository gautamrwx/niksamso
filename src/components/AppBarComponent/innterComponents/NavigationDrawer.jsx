import { Box, Divider, List, ListItem, ListItemButton, ListItemText, SwipeableDrawer, } from '@mui/material';
import logo from '../../../images/logo.png'
import { Link } from 'react-router-dom';

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
                        src={logo} />
                    <Divider />
                    <List>
                        {linkPageMappings.map((item) => (
                            item.visibleInNavBar &&
                            <ListItem key={item.linkPath} disablePadding>
                                <ListItemButton
                                    disabled={item.isLinkActive}
                                    sx={{
                                        "&.Mui-disabled": {
                                            backgroundColor: "#1769aa",
                                            color: "white"
                                        }
                                    }}
                                    component={Link}
                                    to={item.linkPath}
                                >
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