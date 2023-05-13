import { useState } from 'react';
import { useProfile } from '../../context/profile.context';
import { child, get, ref } from 'firebase/database';
import { db } from '../../misc/firebase';
import { useEffect } from 'react';
import DashboardAppBar from '../../components/AppBarComponent/DashboardAppBar';
import TabPanel from './TabPanel';
import BlankTextProcessingDisplay from './BlankTextProcessingDisplay';
import GeneralMembersView from './GeneralMembersView';
import PartyMembersView from './PartyMembersView';
import { Box, Container, Drawer, IconButton, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { Call, Message, WhatsApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

function Dashboard(props) {
    const { profile } = useProfile();

    //const navigate = useNavigate();

    const [partyPeoples, setPartyPeoples] = useState(null);
    const [villageDropDownData, setVillageDropDownData] = useState([]);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');
    const [selectedTabBarIndex, setSelectedTabBarIndex] = useState(0);

    const [isLoadingVillageList, setIsLoadingVillageList] = useState(null);
    const [isLoadingPartyPeoples, setIsLoadingPartyPeoples] = useState(null);

    const [contactDrawerInfo, setContactDrawerInfo] = useState({
        isOpen: false,
        name: '',
        phoneNumbers: []
    });

    const openContactDrawer = (profileContactData) => {
        setContactDrawerInfo({
            isOpen: true,
            name: profileContactData.name,
            phoneNumbers: profileContactData.phoneNumbers
        });
    }

    const closeContactDrawer = (profileContactData) => {
        setContactDrawerInfo({
            isOpen: false,
            name: '',
            phoneNumbers: []
        });
    }

    const handleContactAction = (contactType, contactNumber) => {
        let isCordovaExitst

        try {
            isCordovaExitst = !!window.cordova;
        } catch {
            isCordovaExitst = false
        }

        switch (contactType) {
            case 'ACTION_SMS':
                isCordovaExitst
                    ? window.plugins.socialsharing.shareViaSMS("", contactNumber, function (msg) { }, function (msg) { })
                    : (() => null)() //navigate('sms:' + contactNumber);
                break;
            case 'ACTION_WHATSAPP':
                isCordovaExitst
                    ? window.plugins.socialsharing.shareViaWhatsAppToPhone(contactNumber, "", null, null, function () { })
                    : (() => null)() //navigate('sms:' + contactNumber);
                break;
            default:
                break;
        }
    }

    const handleVillageSelectionChange = (event) => {
        const villageKey = event.target.value
        setSelctedVillageKey(villageKey);
        setPartyPeoples(null);
        fetchVillagePartyPeoples(villageKey);
    };

    // ===< Business Logic [Start] >===
    // ---- Initializing Dashboard (fetch Village list) ----
    useEffect(() => {
        // Step 1. Fetch User-Vllage Key Mapping
        setIsLoadingVillageList(true); // Show Loading Indicator

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
                        setVillageDropDownData(arrVillList);

                        setIsLoadingVillageList(false);
                    }
                });
            }
        }).catch((error) => {
            setIsLoadingVillageList(false);
        });

    }, [profile]);

    // Fetch Village Party Peoples  
    const fetchVillagePartyPeoples = (villageKey) => {
        setIsLoadingPartyPeoples(true) // Start Processing
        // Step 1 > Get Relation
        get(child(ref(db), "mapping_village_partyPeoples/" + villageKey)).then((snapshot) => {
            const pertyPeopleKey = snapshot.val();
            if (pertyPeopleKey) {
                // Step 2 > Get Data .
                get(child(ref(db), "partyPeoples/" + pertyPeopleKey)).then((snapshot) => {
                    const partyPeoples = snapshot.val();

                    if (partyPeoples) {
                        setPartyPeoples(partyPeoples);
                    } else {
                        setPartyPeoples(null);
                    }

                    setIsLoadingPartyPeoples(false) // Start Processing
                });
            } else {
                setPartyPeoples(null);
                setIsLoadingPartyPeoples(false) // Start Processing
            }
        })
    }
    // ===< Business Logic [End] >===

    return (
        <>
            <DashboardAppBar
                props={props}
                villageDropDownData={villageDropDownData}
                selectedVillageKey={selectedVillageKey}
                isLoadingVillageList={isLoadingVillageList}
                handleVillageSelectionChange={handleVillageSelectionChange}
                selectedTabBarIndex={selectedTabBarIndex}
                setSelectedTabBarIndex={setSelectedTabBarIndex}
            />

            <TabPanel value={selectedTabBarIndex} index={0}>
                {(partyPeoples && partyPeoples.partyMembers.length > 0)
                    ? <PartyMembersView
                        members={partyPeoples.partyMembers}
                        openContactDrawer={openContactDrawer} />
                    : <BlankTextProcessingDisplay
                        selectedVillageKey={selectedVillageKey}
                        isLoadingPartyPeoples={isLoadingPartyPeoples}
                    />
                }
            </TabPanel>

            <TabPanel value={selectedTabBarIndex} index={1}>
                {(partyPeoples && partyPeoples.generalMembers.length > 0)
                    ? <GeneralMembersView members={partyPeoples.generalMembers}
                        openContactDrawer={openContactDrawer} />
                    : <BlankTextProcessingDisplay
                        selectedVillageKey={selectedVillageKey}
                        isLoadingPartyPeoples={isLoadingPartyPeoples}
                    />
                }
            </TabPanel>

            <Drawer
                anchor={'bottom'}
                open={contactDrawerInfo.isOpen}
                onClose={closeContactDrawer}
            >
                <Container maxWidth="xs">
                    <Box>
                        <Typography ml={2} mt={2} fontSize={24}>
                            {contactDrawerInfo.name}
                        </Typography>

                        <List >
                            {contactDrawerInfo.phoneNumbers.map((phone, index) =>
                                <ListItem
                                    key={index}
                                    sx={{ pt: 1.5, pb: 1.5 }}
                                    secondaryAction={
                                        <>
                                            <IconButton component={Link} to={"tel:" + phone} sx={{ color: '#03a995' }} >
                                                <Call />
                                            </IconButton>
                                            <IconButton onClick={() => handleContactAction('ACTION_SMS', phone)} sx={{ color: '#1282a7' }} >
                                                <Message />
                                            </IconButton>
                                            <IconButton onClick={() => handleContactAction('ACTION_WHATSAPP', phone)} sx={{ color: '#0d7b0d' }} >
                                                <WhatsApp />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText primary={phone} />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Container>
            </Drawer>


        </>
    );
}

export default Dashboard;
