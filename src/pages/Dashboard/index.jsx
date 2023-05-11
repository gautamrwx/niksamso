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
import { Box, Button, Container, Drawer, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Call, InsertChartOutlined, Message, WhatsApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Dashboard(props) {
    const { profile } = useProfile();

    const [partyPeoples, setPartyPeoples] = useState(null);
    const [villageDropDownData, setVillageDropDownData] = useState([]);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');
    const [selectedTabBarIndex, setSelectedTabBarIndex] = useState(0);

    const [isLoadingVillageList, setIsLoadingVillageList] = useState(null);
    const [isLoadingPartyPeoples, setIsLoadingPartyPeoples] = useState(null);

    const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

    const openContactDrawer = (profileContactData) => {
        setIsContactDrawerOpen(true);
    }

    const handleContactAction = (contactType, contactNumber) => {
        switch (contactType) {
            case 'ACTION_CALL':

                break;
            case 'ACTION_WHATSAPP':

                break;
            case 'ACTION_MESSAGE':

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
                    ? <GeneralMembersView members={partyPeoples.generalMembers} />
                    : <BlankTextProcessingDisplay
                        selectedVillageKey={selectedVillageKey}
                        isLoadingPartyPeoples={isLoadingPartyPeoples}
                    />
                }
            </TabPanel>



            <Drawer
                anchor={'bottom'}
                open={isContactDrawerOpen}
                onClose={() => setIsContactDrawerOpen(false)}
            >
                <Container maxWidth="xs">
                    <Box>
                        <Typography ml={2} mt={2} fontSize={24}>
                            Ram Shayam
                        </Typography>

                        <List >
                            {[1, 2, 3].map((x) =>
                                <ListItem
                                    sx={{ pt: 1.5, pb: 1.5 }}
                                    secondaryAction={
                                        <>
                                            <IconButton onClick={handleContactAction('ACTION_', '+9122222')} sx={{ color: 'blue' }} >
                                                <Call />
                                            </IconButton>
                                            <IconButton sx={{ color: 'green' }} >
                                                <WhatsApp />
                                            </IconButton>
                                            <IconButton  component={Link} to="tel:5551234567"  sx={{ color: 'pink' }} >
                                                <Message />
                                            </IconButton>
                                        </>
                                    }
                                >
                                    <ListItemText primary="+91987875745" />
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
