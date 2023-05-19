import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { passwordValidator } from '../../misc/emailPasswordValidator';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '../../misc/firebase';

function PasswordChange({
    onShowSnackbarMessage,
    setIsPasswordPopupOpen
}) {
    const [inputPassword, setInputPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [inputPasswordValidation, setInputPasswordValidation] = useState({
        isValidOldPassword: true,
        isValidNewPassword: true,
        isValidConfirmPassword: true
    });
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isPasswordChangeProgress, setIsPasswordChangeProgress] = useState(false);

    const handleInputPasswordChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputPassword(values => ({ ...values, [name]: value }))
    }

    const changePassword = (event) => {
        event.preventDefault();

        // reset validation By Default
        setInputPasswordValidation({
            isValidOldPassword: true,
            isValidNewPassword: true,
            isValidConfirmPassword: true
        });

        // Validate old Password
        if (String(inputPassword.oldPassword).length <= 0) {
            setInputPasswordValidation(values => ({ ...values, isValidOldPassword: false }));
            onShowSnackbarMessage('error', 'Old Password Is Empty');
            return;
        }

        // Validate New Password & Confirm Password
        const { isValidPassword, invalidReason } = passwordValidator(inputPassword.newPassword);
        if (!isValidPassword) {
            setInputPasswordValidation(values => ({ ...values, isValidNewPassword: false }));
            onShowSnackbarMessage('error', invalidReason);
            return;
        }
        else if (inputPassword.newPassword !== inputPassword.confirmPassword) {
            setInputPasswordValidation(values => ({ ...values, isValidConfirmPassword: false }));
            onShowSnackbarMessage('error', 'Password Do Not Match');
            return;
        }

        //=== Main Prog Excecution ===// 
        setIsPasswordChangeProgress(true);

        const user = auth.currentUser;

        var credential = EmailAuthProvider.credential(
            user.email,
            inputPassword.oldPassword
        );

        reauthenticateWithCredential(user, credential).then(() => {
            // Change Pass on success
            updatePassword(user, inputPassword.newPassword).then(() => {
                setIsPasswordChangeProgress(false);
                onShowSnackbarMessage('success', 'Password Changed Successfully');
                setIsPasswordPopupOpen(false);
            }).catch((error) => {
                setIsPasswordChangeProgress(false);
                onShowSnackbarMessage('error', 'Failed To Change Password , try again!');
            });
        }).catch(({ code }) => {
            setIsPasswordChangeProgress(false);
            switch (code) {
                case 'auth/wrong-password':
                    onShowSnackbarMessage('error', 'Old Password Is Invalid');
                    break;
                default:
                    break;
            }
        });
    }

    return (
        <Box component="form" onSubmit={changePassword} noValidate sx={{ m: 2 }}>
            <FormControl
                margin='normal'
                fullWidth
                required
                error={!inputPasswordValidation.isValidOldPassword}
                onChange={handleInputPasswordChange}
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                <OutlinedInput
                    inputProps={{ maxLength: 12 }}
                    name="oldPassword"
                    value={inputPassword.oldPassword}
                    type={isOldPasswordVisible ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => { setIsOldPasswordVisible(!isOldPasswordVisible) }}
                                edge="end"
                            >
                                {isOldPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Old Password"
                />
            </FormControl>

            <FormControl
                margin='normal'
                fullWidth
                required
                error={!inputPasswordValidation.isValidNewPassword}
                onChange={handleInputPasswordChange}
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                <OutlinedInput
                    inputProps={{ maxLength: 12 }}
                    name="newPassword"
                    value={inputPassword.newPassword}
                    type={isNewPasswordVisible ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => { setIsNewPasswordVisible(!isNewPasswordVisible) }}
                                edge="end"
                            >
                                {isNewPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="New Password"
                />
            </FormControl>

            <FormControl
                margin='normal'
                fullWidth
                required
                error={!inputPasswordValidation.isValidConfirmPassword}
                onChange={handleInputPasswordChange}
                variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                <OutlinedInput
                    inputProps={{ maxLength: 12 }}
                    name="confirmPassword"
                    value={inputPassword.confirmPassword}
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => { setIsConfirmPasswordVisible(!isConfirmPasswordVisible) }}
                                edge="end"
                            >
                                {isConfirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Confirm Password"
                />
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    mt: 3, pt: 3 / 2, pb: 3 / 2, "&.Mui-disabled": {
                        background: "transparent"
                    }
                }}
                disabled={isPasswordChangeProgress}
            >
                {!isPasswordChangeProgress ? 'Set Password' : <CircularProgress disableShrink />}
            </Button>

            <Button
                onClick={() => { setIsPasswordPopupOpen(false) }}
                variant="outlined"
                fullWidth
                sx={{
                    mt: 3, pt: 3 / 2, pb: 3 / 2, "&.Mui-disabled": {
                        background: "transparent"
                    }
                }}
            >
                Cancel
            </Button>
        </Box>
    );
}

export default PasswordChange;