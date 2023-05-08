import { WhatsApp, SmsOutlined, LocalPhoneOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, CardActions } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function PartyMemberProfileCard({
    memberProfileData
}) {
    return (
        <Card>
            <Box
                sx={{ pb: 1, pt: 2, background: '#2196f3' }}
                display="grid"
                justifyContent="center"
                alignItems="center"
            >
                <Avatar
                    sx={{
                        width: 70,
                        height: 70,
                        margin: 'auto'
                    }}
                    alt='S'
                    src="/static/images/avatar/2.jpg" />

                <Box
                    padding={1}
                    display="grid"
                    alignItems="center"
                    minHeight={50}
                >
                    <Typography align="center" fontSize={16}>
                        {memberProfileData.name}
                    </Typography>
                </Box>
            </Box>
            <CardContent >
                <Typography color="text.secondary">
                    {memberProfileData.post}
                </Typography>
                <Typography color="text.secondary">
                    {memberProfileData.youthGeneral}
                </Typography>
                <Typography color="text.secondary">
                    Age : {memberProfileData.age}
                </Typography>
            </CardContent>
            <CardActions>
                <Button fullWidth size="small">
                    <SmsOutlined />
                    <LocalPhoneOutlined />
                    <WhatsApp />
                </Button>
            </CardActions>
        </Card>
    )
}

export default PartyMemberProfileCard