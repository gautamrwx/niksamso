import { Box, CircularProgress, Typography } from "@mui/material";

function BlankTextProcessingDisplay({
    selectedVillageKey,
    isLoadingPartyPeoples
}) {
    const Customizetext = ({ children, ...other }) => {
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
                String(selectedVillageKey).length <= 0
                    ? <Customizetext>Please Select Village From DropDown</Customizetext>
                    : (isLoadingPartyPeoples
                        ? <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                            <Customizetext>Loading</Customizetext>
                        </Box>
                        : <Customizetext>Data Not Uploaded For Selected Village</Customizetext>
                    )
            }
        </Box>
    );
}

export default BlankTextProcessingDisplay;