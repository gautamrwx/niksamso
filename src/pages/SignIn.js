import { useState } from 'react';
import { auth } from '../misc/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alert, Box, Button, CircularProgress, Container, Snackbar, TextField } from '@mui/material';
import logo from '../images/logo.png'
import { Lock } from '@mui/icons-material';
import { emailValidator, passwordValidator } from '../misc/emailPasswordValidator';

function SignIn() {
  const [userFormData, setUserFormData] = useState({
    "email": "bob@test.in",
    "password": "Windows11"
  });
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const [isFeedbackSnackbarOpen, setIsFeedbackSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [userInputValidation, setuserInputValidation] = useState({
    isCorrectEmail: true,
    isCorrectPassword: true
  });

  const onShowSnackbarMessage = (message) => {
    setIsFeedbackSnackbarOpen(true);
    setAlertMessage(message);
  }

  const onHideSnackbarMessage = () => {
    setIsFeedbackSnackbarOpen(false);
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
        // Do Nothing
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

  const handleUserInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserFormData(values => ({ ...values, [name]: value }))
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
            autoFocus
          />
          <TextField
            margin='normal'
            error={!userInputValidation.isCorrectPassword}
            fullWidth
            required
            inputProps={{ maxLength: 12 }}
            name="password"
            label="Password"
            type="password"
            value={userFormData.password || ""}
            onChange={handleUserInputChange}
          />
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

        <Button
          type="button"
          variant="outlined"
          fullWidth
          sx={{ mt: 3 }}
        >
          Account Setup
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={isFeedbackSnackbarOpen}
          onClose={onHideSnackbarMessage}
        >
          <Alert severity="error">{alertMessage}</Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default SignIn;
