import { useState } from 'react';
import { child, get, ref } from 'firebase/database';
import { db } from '../../misc/firebase';
import TabPanel from './TabPanel';
import BlankTextProcessingDisplay from './BlankTextProcessingDisplay';
import GeneralMembersView from './GeneralMembersView';
import PartyMembersView from './PartyMembersView';
import { Box, Container, Drawer, IconButton, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { Call, Message, WhatsApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import CustomAppBar from '../../components/AppBarComponent/CustomAppBar';

function Dashboard(props) {
    const [partyPeoples, setPartyPeoples] = useState(null);
    const [selectedTabBarIndex, setSelectedTabBarIndex] = useState(0);

    const [isVillageSelected, setIsVillageSelected] = useState(false);
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

    const handleVillageSelectionChange = (partyPeopleKey = null) => {
        if (!partyPeopleKey) {
            setPartyPeoples(null);
            return;
        }

        fetchVillagePartyPeoples(partyPeopleKey);
    };

    // ===< Business Logic [Start] >===

    // Fetch Village Party Peoples  
    const fetchVillagePartyPeoples = (partyPeopleKey) => {

        setIsLoadingPartyPeoples(true) // Start Processing

        get(child(ref(db), "partyPeoples/" + partyPeopleKey)).then((snapshot) => {
            const partyPeoples = snapshot.val();

            if (partyPeoples) {
                setPartyPeoples({ partyPeopleKey, ...partyPeoples });
            } else {
                setPartyPeoples(null);
            }

            setIsLoadingPartyPeoples(false) // Start Processing
        });

    }
    // ===< Business Logic [End] >===

    return (
        <>
            <CustomAppBar
                rightSideComponent="VillageSelector"
                props={props}
                setIsVillageSelected={setIsVillageSelected}
                handleVillageSelectionChange={handleVillageSelectionChange}
                tabSelectionBarVisible
                selectedTabBarIndex={selectedTabBarIndex}
                setSelectedTabBarIndex={setSelectedTabBarIndex}
            />

            <TabPanel value={selectedTabBarIndex} index={0}>
                {(partyPeoples && partyPeoples.partyMembers.length > 0)
                    ? <PartyMembersView
                        partyPeopleKey={partyPeoples.partyPeopleKey}
                        members={partyPeoples.partyMembers}
                        openContactDrawer={openContactDrawer} />
                    : <BlankTextProcessingDisplay
                        isVillageSelected={isVillageSelected}
                        isLoadingPartyPeoples={isLoadingPartyPeoples}
                    />
                }
            </TabPanel>

            <TabPanel value={selectedTabBarIndex} index={1}>
                {(partyPeoples && partyPeoples.generalMembers.length > 0)
                    ? <GeneralMembersView members={partyPeoples.generalMembers}
                        openContactDrawer={openContactDrawer} />
                    : <BlankTextProcessingDisplay
                        isVillageSelected={isVillageSelected}
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
