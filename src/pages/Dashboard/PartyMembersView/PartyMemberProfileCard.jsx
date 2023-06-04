import { WhatsApp, SmsOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, CardActions, IconButton } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import userLogo from '../../../images/userLogo.png';
import cover from '../../../images/cover.jpg';
import { useProfilePicCtx } from "../../../context/selectedProfilePicInfo.context";

function PartyMemberProfileCard({
    memberProfileData,
    openContactDrawer,
    index
}) {
    const { setIsProfilePicDrawerOpen, setSelectedProfilePicData } = useProfilePicCtx();

    const handleUserProfilePicView = (selectedIndex, { profilePicThumbnail, profilePic, name }) => {
        setIsProfilePicDrawerOpen(true);
        setSelectedProfilePicData({
            selectedIndex,
            profilePicThumbnail,
            profilePic,
            name
        });
    }

    return (
        <Card sx={{ minHeight: 120 }}>
            <Box sx={{
                background: '#308ce6',
                height: 80,
                backgroundImage: `url(${cover})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }}></Box>
            <Box
                height={150}
                display="grid"
                justifyContent="center"
                alignItems="center"
                mt={-6}
            >

                <Avatar
                    onClick={() => { handleUserProfilePicView(index, memberProfileData) }}
                    sx={{ bgcolor: 'white', width: 80, height: 80, m: 'auto' }}
                    src={
                        memberProfileData.profilePicThumbnail && memberProfileData.profilePicThumbnail !== ''
                            ? memberProfileData.profilePicThumbnail
                            : userLogo
                    }
                />

                <Box display="grid" alignItems="center">
                    <Typography align="center" color={'rgb(78 81 84)'} fontSize={16}>
                        {memberProfileData.name ? memberProfileData.name : 'N/A'}
                    </Typography>
                </Box>

                <Typography width={1} align="center" color={"#527ca6"} fontSize={14}>
                    {memberProfileData.post ? memberProfileData.post : 'N/A'}
                </Typography>
            </Box>
            <CardContent >
                <Box display={"flex"}>
                    <Typography width={'auto'} mr={1} color={"#527ca6"}>
                        Age :
                    </Typography>
                    <Typography fontWeight='bold' color={"#527ca6"}>
                        {memberProfileData.age ? memberProfileData.age : 'N/A'}
                    </Typography>
                </Box>
                <Typography fontWeight='bold' color={"#527ca6"}>
                    {memberProfileData.youthGeneral ? memberProfileData.youthGeneral : 'N/A'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => {
                    openContactDrawer({
                        name: memberProfileData.name ? memberProfileData.name : 'N/A',
                        phoneNumbers: memberProfileData.mobileNumber
                    })
                }} fullWidth size="small">
                    <SmsOutlined />
                    <LocalPhoneOutlined />
                    <WhatsApp />
                </Button>
            </CardActions>
        </Card >
    )
}

export default PartyMemberProfileCard