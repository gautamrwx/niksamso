import React from 'react';
import { auth } from '../misc/firebase';
import { signOut } from 'firebase/auth';

function Dashboard(props) {

    const logoff = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }


    return (
        <>
            <h1>User Dashboard</h1>
            <button onClick={logoff}>Logout</button>
            {/* <button onClick={sendData}>Apply Data</button> */}
        </>
    );
}

export default Dashboard;
