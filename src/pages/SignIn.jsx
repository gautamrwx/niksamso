import { useState } from 'react';
import { auth } from '../misc/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alert, Box, Button, CircularProgress, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField } from '@mui/material';
import logo from '../images/logo.png'
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { emailValidator, passwordValidator } from '../misc/emailPasswordValidator';

function SignIn() {
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  });
  const [userInputValidation, setuserInputValidation] = useState({
    isCorrectEmail: true,
    isCorrectPassword: true
  });
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUserInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserFormData(values => ({ ...values, [name]: value }))
  }

  const onShowSnackbarMessage = (message) => {
    setIsSnackbarOpen(true);
    setAlertMessage(message);
  }

  const onUserSignIn = (event) => {
    event.preventDefault();

    // Reset Prevoius Error Highlights And Process Next
    setuserInputValidation({
      isCorrectEmail: true,
      isCorrectPassword: true
    });

    // Validate Input Email
    const isEmailValid = emailValidator(userFormData.email);
    if (!isEmailValid) {
      setuserInputValidation(values => ({ ...values, isCorrectEmail: false }));
      onShowSnackbarMessage('Email Is Invalid');
      return;
    }

    // Validate Input Password
    const { isValidPassword, invalidReason } = passwordValidator(userFormData.password);
    if (!isValidPassword) {
      setuserInputValidation(values => ({ ...values, isCorrectPassword: false }));
      onShowSnackbarMessage(invalidReason);
      return;
    }

    // proceed to login after successful validation 
    setIsLoginInProgress(true);
    signInWithEmailAndPassword(auth, userFormData.email, userFormData.password)
      .then((userCredential) => {
        setIsLoginInProgress(false);
        // Do Nothing - Page will be Auto Redirected To DashBoard
      })
      .catch((error) => {
        setIsLoginInProgress(false);

        let errorMessage;
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            errorMessage = 'Invalid Email Or Password.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Login Not Posiible Due To Multiple Wrong Attemps.'
            break;
          default:
            errorMessage = 'Unknown Error , Retry After Sometime.'
            break;
        }
        onShowSnackbarMessage(errorMessage);

        setuserInputValidation({
          isCorrectEmail: false,
          isCorrectPassword: false
        });
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          width={150}
          component="img"
          src={logo} />

        <Box component="form" onSubmit={onUserSignIn} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            error={!userInputValidation.isCorrectEmail}
            fullWidth
            required
            label="Email Address"
            type='email'
            name="email"
            value={userFormData.email || ""}
            onChange={handleUserInputChange}
          />

          <FormControl
            margin='normal'
            fullWidth
            required
            error={!userInputValidation.isCorrectPassword}
            onChange={handleUserInputChange}
            variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              inputProps={{ maxLength: 12 }}
              name="password"
              value={userFormData.password || ""}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => { setShowPassword(!showPassword) }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            startIcon={!isLoginInProgress && <Lock />}
            fullWidth
            sx={{
              mt: 3, pt: 3 / 2, pb: 3 / 2, "&.Mui-disabled": {
                background: "transparent"
              }
            }}
            disabled={isLoginInProgress}
          >
            {!isLoginInProgress ? 'Log In' : <CircularProgress disableShrink />}
          </Button>
        </Box>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={isSnackbarOpen}
          onClose={() => setIsSnackbarOpen(false)}
        >
          <Alert severity="error">{alertMessage}</Alert>
        </Snackbar>
      </Box>
    </Container >
  );
}

export default SignIn;
