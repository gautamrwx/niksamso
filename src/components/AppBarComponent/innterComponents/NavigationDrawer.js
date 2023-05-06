import { AppBar, Box, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Select, Tab, Tabs, Toolbar } from '@mui/material';
import logo from '../../../images/logo.png'
import { Link } from 'react-router-dom';

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

function NavigationDrawer({ container, isDrowerOpen, setIsDrawerOpen }) {
    const handleNavDrawerBoxPress = () => {
        setIsDrawerOpen((prevState) => !prevState);
    }

    return (
        <Box component="nav">
            <Drawer
                container={container}
                variant="temporary"
                open={isDrowerOpen}
                onClose={() => { setIsDrawerOpen((prevState) => !prevState) }}
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
                        width={150}
                        component="img"
                        src={logo} />
                    <Divider />

                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item} disablePadding>
                                <ListItemButton
                                    to="/manageVillage"
                                    sx={{ textAlign: 'center' }}
                                >
                                    <ListItemText primary={item} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    )
}

export default NavigationDrawer;