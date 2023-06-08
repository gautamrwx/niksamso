import { Box, CircularProgress, Typography } from "@mui/material";

function FullScreenMessageText({ showLoader, children }) {
    const Customizetext = ({ children }) => {
        return (
            <Typography
                fontWeight='bold'
                fontFamily={"sans-serif"}
                color='#686868'
            >
                {children}
            </Typography>
        );
    }

    return (
        <Box
            display="grid"
            justifyContent="center"
            alignItems="center"
            minWidth="100%"
            minHeight="60vh"
        >
            {
                showLoader
                    ? <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                        <Customizetext>{children}</Customizetext>
                    </Box>
                    : <Customizetext>{children}</Customizetext>



            }
        </Box>
    );
}

export default FullScreenMessageText;