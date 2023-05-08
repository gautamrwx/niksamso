import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useProfile } from '../../../context/profile.context';
import { useState } from 'react';
import logoff from '../../../misc/logOut';
import { useNavigate } from 'react-router-dom';

const settings = ['My Account', 'Logout'];

function UserProfileActionAvatar() {
    const { profile } = useProfile();
    const navigate  = useNavigate();

    const [anchorElUser, setAnchorElUser] = useState(null);

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
                case "My Account":
                    navigate('/MyAccount');
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Box sx={{ flexGrow: 0, marginLeft: 2 }}>
            <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={String(profile.email).toUpperCase()} src="/static/images/avatar/2.jpg" />
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
                <Typography mt={1} mb={1} textAlign="center">{profile.email}</Typography>
                <Divider />
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => { handleCloseUserMenu(setting) }}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

export default UserProfileActionAvatar;