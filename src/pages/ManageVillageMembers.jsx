import { Box, Button, Card, CardActions, CardContent, Container, Grid, IconButton, Typography } from '@mui/material';
import SimpleAppBar from '../components/AppBarComponent/SimpleAppBar';
import { useProfile } from '../context/profile.context';
import { useEffect, useState } from 'react';
import { child, get, push, ref, update } from 'firebase/database';
import { db } from '../misc/firebase';
import { Delete, Upload } from '@mui/icons-material';
import csv from 'csvtojson';
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
                                    villageGroupListKey,
                                    'villageKey': key,
                                    'villageName': villListObject[key].villageName,
                                    'mappingSatus': villListObject[key].mappingSatus,
                                    'progressStatus': {
                                        deleteInProgress: false,
                                        uploadInProgress: false
                                    }
                                });
                            });

                            // Short Villages By Name
                            arrVillList.sort((a, b) => {
                                return (function (a, b) {
                                    a = a.toLowerCase();
                                    b = b.toLowerCase();
                                    return (a < b) ? -1 : (a > b) ? 1 : 0;
                                })(a.villageName, b.villageName);
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


    const verifyData = (jsonArr) => {
        return true;
    }

    const getPreapredData = (jsonArr) => {
        const arrPartyMem = [];
        const arrGenMem = [];

        jsonArr = jsonArr.slice(1); // Delete First Index

        const partyMembersJsonArr = jsonArr.filter(x => x[1] != 'Members');
        const generalMembersJsonArr = jsonArr.filter(x => x[1] === 'Members');

        partyMembersJsonArr.forEach(x => {
            arrPartyMem.push({
                post: x[1],
                name: x[2],
                age: x[3],
                mobileNumber: [x[4], x[5], x[6], x[7], x[8]],
                youthGeneral: x[9]
            })
        });

        generalMembersJsonArr.forEach(x => {
            arrGenMem.push({
                name: x[2],
                age: x[3],
                mobileNumber: [x[4], x[5], x[6], x[7], x[8]],
                youthGeneral: x[9]
            })
        })

        return {
            partyMembers: arrPartyMem,
            generalMembers: arrGenMem
        }
    }

    const uploadData = (jsonArr, { villageGroupListKey, villageKey }) => {
        const isDataVerified = verifyData(jsonArr);
        if (!isDataVerified) return;

        const peopleInformation = getPreapredData(jsonArr);

        const updates = {};
        const newPartyPersonKey = push(child(ref(db), 'partyPeoples')).key;
        updates['/mapping_village_partyPeoples/' + villageKey] = newPartyPersonKey;
        updates['/partyPeoples/' + newPartyPersonKey] = peopleInformation;
        updates['/villageGroupList/' + villageGroupListKey + '/' + villageKey + '/mappingSatus'] = true;

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {
        }).catch((error) => {
            alert("Error  Update");
        });
    }

    const readFile = ({ target }, x) => {
        const fr = new FileReader();

        fr.onload = function () {
            csv({
                noheader: true,
                output: "csv",
            })
                .fromString(fr.result)
                .then((csvRow) => {
                    uploadData(csvRow, x);
                });
        };

        fr.readAsText(target.files[0]);
    };

    return (
        <>
            <SimpleAppBar props={props} />

            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                {Array.from(villageList).map((villageData, index) => (
                    <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                        <Card sx={{ minHeight: 120 }}>
                            <CardContent >
                                <Box display={"flex"}>
                                    <Typography >
                                        {villageData.villageName}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Box display="flex" flex='1' >
                                    <Box
                                        display="flex"
                                        flexDirection={'column'}
                                        flex='1'
                                    >
                                        <Button
                                            disabled={villageData.mappingSatus}
                                            variant="outlined"
                                            component="label"
                                        >
                                            Upload <Upload />
                                            <input
                                                onChange={(event) => readFile(event, villageData)}
                                                type="file"
                                                hidden
                                            />
                                        </Button>
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection={'column'}
                                        justifyContent='center'
                                        pl={2}
                                        pr={2}
                                    >
                                        <IconButton
                                            disabled={!villageData.mappingSatus}
                                            color='error'
                                            type="button"
                                            variant="contained"
                                            onClick={() => { }}
                                        >
                                            <Delete />
                                        </IconButton>

                                        
                                    </Box>
                                </Box>
                            </CardActions>
                        </Card >
                    </Grid>
                ))
                }
            </Grid >
        </>
    );
}

export default ManageVillageMembers;
