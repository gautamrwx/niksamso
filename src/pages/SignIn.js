import React from 'react';
import { Link } from 'react-router-dom';
function SignIn() {

    return (
        <div>
            <h1>User SignIn</h1>
            <div className="mt-3">

                <Link to="/SetPassword" className="btn btn-primary">Set Password</Link>
            </div>
        </div>
    );
}

export default SignIn;
