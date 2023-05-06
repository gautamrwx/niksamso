import { Box } from "@mui/material";

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

export default TabPanel
