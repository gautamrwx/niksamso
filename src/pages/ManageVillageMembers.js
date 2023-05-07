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
        const peopleInformation = {
            partyMembers: [
                {
                    post: '',
                    name: '',
                    age: '',
                    mobileNumber: [],
                    youthGeneral: ''
                }
            ],
            generalMembers: [
                {
                    name: '',
                    age: '',
                    mobileNumber: [],
                    youthGeneral: ''
                }
            ]
        }

        return peopleInformation;
    }

    const upload = (key) => {
        //upload(x.key)
        // New entry party meber
        // 2. Assign Villages
        const updates = {};

        const newPartyPerson = push(child(ref(db), 'peopleInformation')).key;
        updates['/mapping_village_partyPeoples/' + key] = newPartyPerson;
        updates['/partyPeoples/' + newPartyPerson] = getPreapredData();

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {
            // Do Nothing
        }).catch((error) => {
            alert("User Created Without Database | Contact Admin To register Again");
        });

        // assign relational data
    }

    return (
        <>
            <SimpleAppBar props={props} />

            <Container>
                {
                    villageList.map((x) =>
                        <Box
                            key={x.key}
                            mt={2}
                        >

                            <Typography >
                                {x.val}
                            </Typography>

                            <Button
                                type="button"
                                variant="contained"
                                onClick={() => { upload(x.key) }}
                            >
                                Asb
                            </Button>
                        </Box>
                    )
                }
            </Container >
        </>
    );
}

export default ManageVillageMembers;
