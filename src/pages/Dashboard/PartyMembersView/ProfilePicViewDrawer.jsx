import { Avatar, Box, Button, Container, Drawer, Typography } from "@mui/material";
import { useProfilePicCtx } from "../../../context/selectedProfilePicInfo.context";
import userLogo from '../../../images/userLogo.png';

export default function ProfilePicViewDrawer({
    anchor
}) {
    const { isProfilePicDrawerOpen, setIsProfilePicDrawerOpen, selectedProfilePicData } = useProfilePicCtx()

    return (
        <Drawer
            anchor={anchor}
            open={isProfilePicDrawerOpen}
            onClose={() => setIsProfilePicDrawerOpen(false)}
        >
            <Container maxWidth="xs">
                <Box
                    minHeight={400}
                    display="flex"
                    justifyContent="center"
                >
                    <Box>
                        <Box
                            height={300}
                            component="img"
                            src={
                                selectedProfilePicData.profilePic && selectedProfilePicData.profilePic !== ''
                                    ? selectedProfilePicData.profilePic
                                    : userLogo
                            }
                        />
                        <Typography textAlign={'center'}>
                            {selectedProfilePicData.name}
                        </Typography>

                        <Box mt={2} mb={2} display={'flex'} justifyContent={'center'}>
                            <Button>Capture</Button>
                            <Button>Upload</Button>
                            <Button>Cancel</Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Drawer>
    );
}