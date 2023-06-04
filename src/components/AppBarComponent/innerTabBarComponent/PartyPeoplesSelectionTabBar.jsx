import { Box, Tab, Tabs } from "@mui/material";
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import GroupIcon from '@mui/icons-material/Group';

export default function PartyPeoplesSelectionTabBar({
    selectedTabBarIndex,
    setSelectedTabBarIndex
}) {
    return (
        <Box sx={{ background: 'white' }}>
            <Tabs
                value={selectedTabBarIndex}
                onChange={(event, newValue) => {
                    setSelectedTabBarIndex(newValue);
                }}>
                <Tab icon={<ContactPhoneIcon />} iconPosition="start" label="Party Members" />
                <Tab icon={<GroupIcon />} iconPosition="start" label="General Members" />
            </Tabs>
        </Box>
    )
}


