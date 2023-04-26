import React from 'react';
import { Button } from 'rsuite';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../misc/firebase';

function SignIn() {

    const signInWithProvider = async provider => {
        debugger;
        signInWithPopup(auth, provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    };

    const onGoogleSignIn = () => {
        signInWithProvider(new GoogleAuthProvider());
    };

    return (
        <div>
            <div className="mt-3">
                <Button block color="blue" onClick={onGoogleSignIn} >
                    <FcGoogle /> Login With Google
                </Button>
            </div>
        </div>
    );
}

export default SignIn;
