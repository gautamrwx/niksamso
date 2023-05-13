import { Box, Button, Container, Typography } from '@mui/material';
import SimpleAppBar from '../components/AppBarComponent/SimpleAppBar';
import { useProfile } from '../context/profile.context';
import { useEffect, useState } from 'react';
import { child, get, push, ref, update } from 'firebase/database';
import { db } from '../misc/firebase';

function ManageVillageMembers(props) {

    const { profile } = useProfile();

    const [villageList, setVillageList] = useState([]);

    // Get Village List
    useEffect(() => {
        // Step 1. Fetch User-Vllage Key Mapping
        (function () {
            get(child(ref(db), 'mapping_users_villageGroupList/' + profile.uid)).then((snapshot) => {
                const villageGroupListKey = snapshot.val();

                // Step 2. Fetch User-Vllage Key Mapping
                if (villageGroupListKey) {
                    get(child(ref(db), "villageGroupList/" + villageGroupListKey)).then((snapshot) => {
                        const villListObject = snapshot.val();
                        if (villListObject) {
                            // Convert JsonList Into Array
                            const arrVillList = [];
                            Object.keys(villListObject).forEach(function (key) {
                                arrVillList.push({
                                    'key': key,
                                    'val': villListObject[key]
                                });
                            });

                            // Short Villages By Name
                            arrVillList.sort((a, b) => {
                                return (function (a, b) {
                                    a = a.toLowerCase();
                                    b = b.toLowerCase();
                                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                                })(a.val, b.val);
                            });

                            // Set Array data in DropDown Input
                            setVillageList(arrVillList);
                        }
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        })();
    }, [profile]);

    const getPreapredData = () => {
        debugger
        const peopleInformation = {
            partyMembers: [
                {
                    post: 'Village Party President ',
                    name: 'Nick Fuery',
                    age: '33',
                    mobileNumber: [99,55,66,66],
                    youthGeneral: 'Youth'
                },
                {
                    post: 'Village Party President ',
                    name: 'Ram Shyam',
                    age: '33',
                    mobileNumber: [99,55,66,66],
                    youthGeneral: 'General'
                },
                {
                    post: 'Village Party President ',
                    name: 'Doremon',
                    age: '33',
                    mobileNumber: [99,55,66,66],
                    youthGeneral: 'Youth'
                },
                {
                    post: 'Village Party President ',
                    name: 'Ram',
                    age: '33',
                    mobileNumber: [99,55,66,66],
                    youthGeneral: 'Youth'
                }
            ],
            generalMembers: [
                {
                    name: 'Mohan',
                    age: '33',
                    mobileNumber: [22,55],
                    youthGeneral: 'General'
                },
                {
                    name: 'Sigma User',
                    age: '33',
                    mobileNumber: ['+918888888888','8888888888'],
                    youthGeneral: 'Youth'
                },
                {
                    name: 'Abcd user',
                    age: '33',
                    mobileNumber: [22,55],
                    youthGeneral: 'General'
                },
                {
                    name: 'Mohan',
                    age: '33',
                    mobileNumber: [22,55],
                    youthGeneral: 'General'
                },
                {
                    name: 'Mohan',
                    age: '33',
                    mobileNumber: [22,55],
                    youthGeneral: 'General'
                }
            ]
        }

        return peopleInformation;
    }

    const upload = (key) => {
        debugger;
        const updates = {};

       
        const newPartyPerson = push(child(ref(db), 'peopleInformation')).key;
        updates['/mapping_village_partyPeoples/' + key] = newPartyPerson;
        updates['/partyPeoples/' + newPartyPerson] = getPreapredData();

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {
            // Do Nothing
        }).catch((error) => {
            alert("Error  Update");
        });

        // assign relational data
    }

    return (
        <>
            <SimpleAppBar props={props} />

            <Container>
                {
                    villageList.map((x,index) =>
                        <Box
                            key={index}
                            mt={2}
                        >

                            <Typography >
                                {x.val} {x.key}
                            </Typography>

                            <Button
                                type="button"
                                variant="contained"
                                onClick={() => { upload(x.key) }}
                            >
                                Upload
                            </Button>
                        </Box>
                    )
                }
            </Container >
        </>
    );
}

export default ManageVillageMembers;
