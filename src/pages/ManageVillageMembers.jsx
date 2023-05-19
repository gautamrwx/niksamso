import { Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, IconButton, LinearProgress, Typography } from '@mui/material';
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
    const [isDataLoading, setIsDataLoading] = useState(false);


    const toggleProgressIndicator = (index, progressType, condition) => {
        setVillageList((prevArray) => {
            switch (progressType) {
                case 'UPLOAD':
                    prevArray[index].progressStatus.uploadInProgress = condition;
                    break;
                case 'DELETE':
                    prevArray[index].progressStatus.deleteInProgress = condition;
                    break;
                default:
                    break;
            }
            return [...prevArray]
        });
    }

    const resetMemberMappingStatus = (index, condition) => {
        setVillageList((prevArray) => {
            prevArray[index].mappingSatus = condition;
            return [...prevArray];
        });
    }

    const setErrorMessage = (index, errorMessage = null) => {
        setVillageList((prevArray) => {
            prevArray[index].errorMessage = errorMessage;
            return [...prevArray];
        });
    }

    // ---- Start | Firebase Business Logic ---- //
    // Get Village List
    useEffect(() => {
        setIsDataLoading(true);
        // Step 1. Fetch User-VillGroupKey Mapping
        (function () {
            get(child(ref(db), 'mapping_users_villageGroupList/' + profile.uid)).then((snapshot) => {
                const villageGroupListKey = snapshot.val();

                // Step 2. Fetch Vllage-PartyPeoples Key Mapping
                if (villageGroupListKey) {
                    get(child(ref(db), "villageGroupList/" + villageGroupListKey)).then((snapshot) => {
                        setIsDataLoading(false);

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
                                    'errorMessage': null,
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
            }).catch((error) => { setIsDataLoading(false) });
        })();
    }, [profile]);


    const uploadData = (jsonArr, { villageGroupListKey, villageKey }, selectedIndex) => {
        const peopleInformation = getPreapredData(jsonArr);

        const updates = {};
        const newPartyPersonKey = push(child(ref(db), 'partyPeoples')).key;
        updates['/mapping_village_partyPeoples/' + villageKey] = newPartyPersonKey;
        updates['/partyPeoples/' + newPartyPersonKey] = peopleInformation;
        updates['/villageGroupList/' + villageGroupListKey + '/' + villageKey + '/mappingSatus'] = true;

        // <==== | Update All Data In Single Shot | ====>
        update(ref(db), updates).then(x => {
            toggleProgressIndicator(selectedIndex, 'UPLOAD', false);
            resetMemberMappingStatus(selectedIndex, true);
        }).catch((error) => {
            toggleProgressIndicator(selectedIndex, 'UPLOAD', false);
            alert("Error  Update");
        });
    }

    const handleDeleteVillageMembers = ({ villageGroupListKey, villageKey }, selectedIndex) => {
        toggleProgressIndicator(selectedIndex, 'DELETE', true);

        // Get Key Of PartyPeople For Current Village
        get(child(ref(db), 'mapping_village_partyPeoples/' + villageKey)).then((snapshot) => {
            const partyPeopleKey = snapshot.val();

            const updates = {};
            if (partyPeopleKey) {
                // [1] Delete Uploaded Party Peoples
                updates['/partyPeoples/' + partyPeopleKey] = null;
            }

            // [2] Delete Village->PartyPeople Mapping
            updates['/mapping_village_partyPeoples/' + villageKey] = null;
            updates['/villageGroupList/' + villageGroupListKey + '/' + villageKey + '/mappingSatus'] = false;

            // <==== | Update All Data In Single Shot | ====>
            update(ref(db), updates).then(x => {
                toggleProgressIndicator(selectedIndex, 'DELETE', false);
                resetMemberMappingStatus(selectedIndex, false);
            }).catch((error) => {
                toggleProgressIndicator(selectedIndex, 'DELETE', false);
                alert("Error  Delete");
            });
        }).catch((error) => { });
    }
    // ---- End | Firebase Business Logic ---- //

    // ---- Start | Helper Functions ---- //
    const verifyData = (jsonArr, villageName) => {
        const verificationStatus = {
            isValidData: true,
            message: null
        }

        if (jsonArr.length <= 1) {
            // Check Number of Rows
            verificationStatus.isValidData = false;
            verificationStatus.message = 'Uploaded CSV Does not Have Data';
        } else if (jsonArr[0].length !== 10) {
            // Check Number of Columns
            verificationStatus.isValidData = false;
            verificationStatus.message = 'Uploaded CSV File Must Have 10 Column';
        } else if (String(jsonArr[1][0]).toUpperCase() !== String(villageName).toUpperCase()) {
            // Match Village Name with CSV Village Name
            verificationStatus.isValidData = false;
            verificationStatus.message = 'Village Name Not Matching For Uploaed CSV ';
        }

        return verificationStatus;
    }

    const getPreapredData = (jsonArr) => {
        const arrPartyMem = [];
        const arrGenMem = [];

        jsonArr = jsonArr.slice(1); // Delete First Index

        const partyMembersJsonArr = jsonArr.filter(x => x[1] !== 'Members');
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

    const handleVillageMembersCSVUpload = ({ target }, villageData, selectedIndex) => {
        toggleProgressIndicator(selectedIndex, 'UPLOAD', true);

        const fr = new FileReader();

        fr.onload = function () {
            csv({
                noheader: true,
                output: "csv",
            })
                .fromString(fr.result)
                .then((csvRow) => {
                    const { isValidData, message } = verifyData(csvRow, villageData.villageName);
                    if (!isValidData) {
                        setErrorMessage(selectedIndex, message);
                        toggleProgressIndicator(selectedIndex, 'UPLOAD', false);
                        return;
                    }

                    uploadData(csvRow, villageData, selectedIndex);
                });
        };

        fr.readAsText(target.files[0]);
    };
    // ---- End | Helper Functions ---- //

    return (
        <>
            <SimpleAppBar props={props} />

            {isDataLoading && <Box
                display="grid"
                justifyContent="center"
                alignItems="center"
                minWidth="100%"
                minHeight="60vh"
            >
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                    <Typography
                        fontWeight='bold'
                        fontFamily={"sans-serif"}
                        color='#686868'
                    >
                        Loading
                    </Typography>
                </Box>
            </Box>}

            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
                {Array.from(villageList).map((villageData, index) => (
                    <Grid item xs={1} sm={1} md={1} lg={1} key={index}>
                        <Card sx={{ minHeight: 120 }}>
                            <CardContent >
                                <Box display={"flex"}>
                                    <Typography color={'#415468'} fontWeight='bold'>
                                        {villageData.villageName}
                                    </Typography>
                                </Box>
                                <Box height='2rem'>
                                    <Typography sx={{ color: '#d81f10', fontSize: 13 }}>
                                        {villageData.errorMessage}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Box display="flex" flex='1' >
                                    <Box
                                        display="flex"
                                        flexDirection={'column'}
                                        flex='1'
                                        justifyContent={'center'}
                                    >
                                        {
                                            villageData.progressStatus.uploadInProgress
                                                ? <LinearProgress />
                                                : <Button
                                                    disabled={villageData.mappingSatus}
                                                    variant="outlined"
                                                    component="label"
                                                >
                                                    <Typography display={{ xs: 'none', sm: 'block' }}>Upload</Typography> <Upload />
                                                    <input
                                                        onChange={(event) => handleVillageMembersCSVUpload(event, villageData, index)}
                                                        type="file"
                                                        hidden
                                                    />
                                                </Button>
                                        }
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection={'column'}
                                        justifyContent='center'
                                        pl={2}
                                        pr={2}
                                    >
                                        {
                                            villageData.progressStatus.deleteInProgress
                                                ? <CircularProgress color="error" />
                                                : <IconButton
                                                    disabled={!villageData.mappingSatus}
                                                    color='error'
                                                    type="button"
                                                    variant="contained"
                                                    onClick={() => handleDeleteVillageMembers(villageData, index)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                        }
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
