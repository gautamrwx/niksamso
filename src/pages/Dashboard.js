import { useState } from 'react';
import logoff from '../misc/logOut';

import { Box, Tab, Tabs, Typography } from '@mui/material';


function Dashboard() {
    const [villageDropDownData, setVillageDropDownData] = useState('');
    const [value, setValue] = useState(0);

    // Tab View Thing
    const TabPanel = ({ children, value, index, ...other }) => {
        return (
            <div role="tabpanel" hidden={value !== index} {...other}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>


            <h1>User Dashboard</h1>
            <button onClick={logoff}>Logout</button>
        </>
    );
}

export default Dashboard;
