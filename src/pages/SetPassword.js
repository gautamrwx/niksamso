import { useState } from 'react';
import { onValue, ref, update, push, child, off } from 'firebase/database';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from '../misc/firebase';
import md5 from 'md5';
import LinearProgress from '@mui/material/LinearProgress';

function SetPassword() {
    const [userFormData, setUserFormData] = useState({
        "email": "alex@test.in",
        "password": "Windows11",
        "confirmPasswd": "Windows11"
    });
    const [isSignUpInProgress, setIsSignUpInProgress] = useState(false);

    const onUserDataFormSubmit = (event) => {
        event.preventDefault();
        setIsSignUpInProgress(true);

        // Step 1. Verify Inputs 
        if (userFormData.password !== userFormData.confirmPasswd) {
            setIsSignUpInProgress(false);
            return;
        }

        // Step 2. Check If Current User is in Unregisted List
        let unRegisteredUserKey = md5(userFormData.email); // We using Email(md5) as primary key of Firebase 

        const unRegistedUsersRef = ref(db, 'unRegistedUsers/' + unRegisteredUserKey);

        onValue(unRegistedUsersRef, (snapshot) => {
            unRegistedUsersRef && off(unRegistedUsersRef)  // Close Listner

            const data = snapshot.val();
            if (data) {
                // Get Village Array (for Cureent User) From Response 
                const assignedVillages = data.assignedVillages ? data.assignedVillages : [];

                // ---- Sign Up for A New User ---- //
                createUserWithEmailAndPassword(auth, userFormData.email, userFormData.password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;

                        //-----------------------------------
                        // Assign User Data and Mapping to Database
                        //-----------------------------------
                        initializaUserAndMapVillages(unRegisteredUserKey, user, assignedVillages)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        // const errorMessage = error.message;
                        setIsSignUpInProgress(false);
                        alert(errorCode);
                    });
            }
            else {
                alert("Contact Admin To Assign User");
            }
        });
    }

    const initializaUserAndMapVillages = (unRegisteredUserKey, user, assignedVillages) => {
        const updates = {}

        // 1. Assign User Profile Information
        const profileInfo = {
            profilePic: "something.jpg"
        };
        updates['/users/' + user.uid] = profileInfo

        // 2. Assign Villages
        const newVillageGroupKey = push(child(ref(db), 'villageListData')).key;

        assignedVillages.forEach(villageName => {
            const newVillageKey = push(child(ref(db), 'villageListData/' + newVillageGroupKey)).key;
            updates['/villageListData/' + newVillageGroupKey + '/' + newVillageKey] = villageName;
        });

        // 3. Map User With VillageListData
        updates['/mapping-User-villageListData/' + user.uid] = newVillageGroupKey;

        // 4. User Has been Regitered , Now Delete Unregistered User from Database 
        updates['/unRegistedUsers/' + unRegisteredUserKey] = null;

        update(ref(db), updates).then(x => {
            alert("User Created With Database");
        }).catch((error) => {
            alert("User Created Without Database");
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setUserFormData(values => ({ ...values, [name]: value }))
    }

    return (
        <>
            <h1>User SetPassword</h1>
            <form onSubmit={onUserDataFormSubmit}>
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

                <input
                    type="password"
                    placeholder='confirm password'
                    name="confirmPasswd"
                    required
                    value={userFormData.confirmPasswd || ""}
                    onChange={handleChange}
                />

                <input value="Submit" type='submit' />
            </form>

            {isSignUpInProgress && <LinearProgress />}
        </>
    );
}

export default SetPassword;
