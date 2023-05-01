import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../misc/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LinearProgress from '@mui/material/LinearProgress';

function SignIn() {
    const [userFormData, setUserFormData] = useState({
        "email": "alex@test.in",
        "password": "Windows11",
        "confirmPasswd": "Windows11"
    });
    const [isLoginInProgress, setIsLoginInProgress] = useState(false);

    const onUserSignIn = (event) => {
        event.preventDefault();
        setIsLoginInProgress(true);

        signInWithEmailAndPassword(auth, userFormData.email, userFormData.password)
            .then((userCredential) => {
                //const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                //const errorMessage = error.message;
                setIsLoginInProgress(false);
                alert(errorCode);
            });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserFormData(values => ({ ...values, [name]: value }))
    }

    return (
        <div>
            <h1>User SignIn</h1>
            <div className="mt-3">
                <form onSubmit={onUserSignIn}>
                    <input
                        type="email"
                        placeholder='email'
                        name="email"
                        required
                        value={userFormData.email || ""}
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        placeholder='password'
                        name="password"
                        value={userFormData.password || ""}
                        onChange={handleChange}
                    />

                    <input value="Submit" type='submit' />
                </form>


                {isLoginInProgress && <LinearProgress />}

                <Link to="/SetPassword" className="btn btn-primary">Set Password</Link>
            </div>
        </div>
    );
}

export default SignIn;
