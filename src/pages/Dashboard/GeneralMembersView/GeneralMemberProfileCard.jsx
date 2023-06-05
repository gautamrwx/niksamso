import { WhatsApp, SmsOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import { Avatar, Box, Button } from "@mui/material";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import userLogoWhite from '../../../images/userLogoWhite.png';

function GeneralMemberProfileCard({
    memberProfileData,
    openContactDrawer
}) {
    return (
        <Card>
            <Box
                display="flex"
                flexDirection="row"
            >
                <Box
                    sx={{
                        bgcolor: '#1976d2',
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        mr: 1
                    }}
                >
                    <Avatar
                        sx={{ bgcolor: 'transparent', width: 45, height: 45, m: 'auto', pr: 2, pl: 2 }}
                        alt='U'
                        src={userLogoWhite}
                    />
                </Box>
                <Box
                    sx={{
                        height: '100%',
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1
                    }}
                >
                    <Typography fontWeight='600' color={'rgb(78 81 84)'} fontSize={18}>
                        {memberProfileData.fullName ? memberProfileData.fullName : 'N/A'}
                    </Typography>
                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                            display: "flex",
                            flexDirection: "row"
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1
                            }}
                        >
                            <Typography color={"#527ca6"}>
                                Age : {memberProfileData.age ? memberProfileData.age : 'N/A'}
                            </Typography>

                            <Typography color={"#527ca6"}>
                                {memberProfileData.youthGeneral ? memberProfileData.youthGeneral : 'N/A'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column"
                            }}
                        >
                            <Button
                                onClick={() => {
                                    openContactDrawer({
                                        fullName: memberProfileData.fullName ? memberProfileData.fullName : 'N/A',
                                        phoneNumbers: memberProfileData.mobileNumber
                                    })
                                }}
                                fullWidth
                                size="small"
                            >
                                <SmsOutlined />
                                <LocalPhoneOutlined />
                                <WhatsApp />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card >
    )
}

export default GeneralMemberProfileCard