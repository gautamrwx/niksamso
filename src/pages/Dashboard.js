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

const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];
const settings = ['My Account', 'Logout'];

function Dashboard(props) {
    const { profile } = useProfile();

    // Container Will Use in App Drawer
    const { window } = props;
    const container = window !== undefined ? () => window().document.body : undefined;

    const [villageDropDownData, setVillageDropDownData] = useState(null);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');

    const [mobileOpen, setMobileOpen] = useState(false);

    const [value, setValue] = useState(0);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [partyMembersInfo, setPartyMembersInfo] = useState(null);

    const handleVillageSelectionChange = (event) => {
        const villageKey = event.target.value
        setSelctedVillageKey(villageKey);

        fetchVillagePartyMembers(villageKey);
    };

    // Fetch Village Party Members   ---  
    const fetchVillagePartyMembers = (villageKey) => {
        const mapPartyMemberRef = ref(db, "map-vill-patyMem/" + villageKey);

        onValue(mapPartyMemberRef, (snapshot) => {
            const partyMemberDbKey = snapshot.val();

            if (partyMemberDbKey) {
                executeFetchVillagePartyMembers(partyMemberDbKey);
            } else {
                setPartyMembersInfo(null)
            }

            mapPartyMemberRef && off(mapPartyMemberRef);
        })
    }

    // Execute
    const executeFetchVillagePartyMembers = (partyMemberDbKey) => {
        const partyMemberRef = ref(db, "partyMember/" + partyMemberDbKey);

        onValue(partyMemberRef, (snapshot) => {
            const partyMember = snapshot.val();

            if (partyMember) {
                setPartyMembersInfo(partyMember);
            } else {
                setPartyMembersInfo(null)
            }
        });
    }

    // ---- Initializing Dashboard (fetch Village list) ----
    useEffect(() => {
        // Step 1. Fetch User-Vllage Key Mapping
        (function () {
            get(child(ref(db), 'mapping-User-villageListData/' + profile.uid)).then((snapshot) => {
                const villageListDataKey = snapshot.val();

                villageListDataKey && fetchAllVillageForCurrUser(villageListDataKey);
            }).catch((error) => {
                console.error(error);
            });
        })();

        // Step 2. Fetch All Villages ( Display in DropDown )
        const fetchAllVillageForCurrUser = (villageListDataKey) => {
            const villageListDataRef = ref(db, "villageListData/" + villageListDataKey);
            get(villageListDataRef, (snapshot) => {
                const villListObject = snapshot.val();
                if (villListObject) {
                    // Convert JsonList Into Array
                    const arrVillList = [];
                    Object.keys(villListObject).forEach(function (key) {
                        arrVillList.push({
                            'key': key,
                            'val': villListObject[key]
                        });
                    });

                    // Short Villages By Name
                    const compareStrings = (a, b) => {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                        return (a < b) ? -1 : (a > b) ? 1 : 0;
                    }
                    arrVillList.sort((a, b) => {
                        return compareStrings(a.val, b.val);
                    });

                    // Set Array data in DropDown Input
                    setVillageDropDownData(arrVillList);
                }
                //villageListDataRef && off(villageListDataRef);
            })
        }
    }, [profile]);

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

    const handleMemberTabBarChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = (seletedMenu = null) => {
        setAnchorElUser(null);

        if (seletedMenu) {
            switch (seletedMenu) {
                case "Logout":
                    logoff();
                    break;

                default:
                    break;
            }
        }
    };
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box variant="h6" sx={{ my: 2 }}>
                MUI
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>);

    return (
        <>
            <AppBar component="nav" sx={{ boxShadow: 'none' }}>
                <Toolbar>
                    {/* App Drawer Toggle Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <DehazeIcon />
                    </IconButton>

                    {/*Fill Empty Midddle Space*/}
                    <Box sx={{ flexGrow: 1 }}></Box>

                    {/* Village Selection DropDown  */}
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

                    {/* User Profile Avatar  */}
                    <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={profile.email} src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={anchorElUser}
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => { handleCloseUserMenu(setting) }}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>

                {/* Party Members Tab Bar  */}
                <Box sx={{ background: 'white' }}>
                    <Tabs value={value} onChange={handleMemberTabBarChange} aria-label="basic tabs example">
                        <Tab icon={<ContactPhoneIcon />} iconPosition="start" label="Party Workers" />
                        <Tab icon={<GroupIcon />} iconPosition="start" label="Party Members" />
                    </Tabs>
                </Box>
            </AppBar >
            <Toolbar />
            <Tabs />

            <Box component="nav">
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

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
