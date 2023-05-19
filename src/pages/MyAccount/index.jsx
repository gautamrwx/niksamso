import SimpleAppBar from '../../components/AppBarComponent/SimpleAppBar';
import { Alert, Avatar, Box, Button, CircularProgress, Container, FormControl, InputLabel, Modal, OutlinedInput, Paper, Snackbar, TextField, Toolbar } from '@mui/material';
import { useState } from 'react';
import { useProfile } from '../../context/profile.context';
import PasswordChange from './PasswordChange';
import { ref, update } from 'firebase/database';
import { db } from '../../misc/firebase';

function MyAccount(props) {
    const { profile, setProfile } = useProfile();

    const [isEditMode, setIsEditMode] = useState(false);
    const [myProfileInfo, setMyProfileInfo] = useState(profile);
    const [isProfileUpdateProgress, setIsProfileUpdateProgress] = useState(false);
    const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({
        msgType: null,
        msgContent: null
    });

    const onShowSnackbarMessage = (msgType, msgContent) => {
        setIsSnackbarOpen(true);
        setAlertMessage({ msgType, msgContent });
    }

    const onHideSnackbarMessage = () => {
        setIsSnackbarOpen(false);
    }

    const handleUserInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setMyProfileInfo(values => ({ ...values, [name]: value }))
    }

    const saveProfileInformation = () => {
        // Check is data actually changed by user 
        if (myProfileInfo.fullName === profile.fullName) {
            return;
        }

        // ==> Update userInfo in dataBase <==
        setIsProfileUpdateProgress(true);
        const updates = {}

        // 1. Assign User Profile Information
        updates['/users/' + profile.uid + '/fullName'] = myProfileInfo.fullName;

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {

            setProfile(prev => ({ ...prev, fullName: myProfileInfo.fullName }));

            setIsProfileUpdateProgress(false);
            onShowSnackbarMessage('success', 'Successful');
        }).catch((error) => {
            alert("Failed To Update");
        });
    }

    return (
        <>
            <SimpleAppBar props={props} />
            <Box
                sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ height: '6rem', width: '6rem' }} alt={'A'} src="/static/images/avatar/2.jpg" />
            </Box>

            <Container component="main" maxWidth="xs">
                <Box>
                    <TextField
                        disabled={!isEditMode}
                        margin='normal'
                        fullWidth
                        required
                        label="Full Name"
                        type='text'
                        name="fullName"
                        value={myProfileInfo.fullName}
                        onChange={handleUserInputChange}
                    />

                    <FormControl
                        disabled
                        margin='normal'
                        fullWidth
                        required
                        variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            inputProps={{ maxLength: 12 }}
                            name="email"
                            label="Email"
                            value={myProfileInfo.email}
                        />
                    </FormControl>

                    <Button
                        onClick={() => { setIsPasswordPopupOpen(true) }}
                        type="button"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        Change Password
                    </Button>
                </Box>
            </Container>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <Toolbar >
                    <Box style={{ flex: 1 }}></Box>

                    {isEditMode &&
                        (
                            isProfileUpdateProgress
                                ? <CircularProgress />
                                : <>
                                    <Button onClick={() => setIsEditMode(false)} sx={{ mr: 1 }} variant="outlined">
                                        Cancel
                                    </Button>

                                    <Button onClick={() => saveProfileInformation()} sx={{ mr: 1 }} variant="contained">
                                        Save
                                    </Button>
                                </>
                        )
                    }

                    {!isEditMode &&
                        <Button onClick={() => setIsEditMode(true)} sx={{ mr: 1 }} variant="outlined">
                            Edit
                        </Button>
                    }
                </Toolbar>
            </Paper>

            <Modal open={isPasswordPopupOpen} onClose={null}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: { xs: '95%', sm: '400px' },
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                    }}
                >
                    <PasswordChange
                        onShowSnackbarMessage={onShowSnackbarMessage}
                        setIsPasswordPopupOpen={setIsPasswordPopupOpen}
                    />
                </Box>
            </Modal>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={isSnackbarOpen}
                onClose={onHideSnackbarMessage}
            >
                <Alert severity={alertMessage.msgType}>{alertMessage.msgContent}</Alert>
            </Snackbar>
        </>
    );
}

export default MyAccount;
