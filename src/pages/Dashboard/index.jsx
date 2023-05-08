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

function Dashboard(props) {
    const { profile } = useProfile();

    const [partyPeoples, setPartyPeoples] = useState(null);
    const [villageDropDownData, setVillageDropDownData] = useState([]);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');
    const [selectedTabBarIndex, setSelectedTabBarIndex] = useState(0);

    const [isLoadingVillageList, setIsLoadingVillageList] = useState(null);
    const [isLoadingPartyPeoples, setIsLoadingPartyPeoples] = useState(null);

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
                    ? <PartyMembersView members={partyPeoples.partyMembers} />
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
        </>
    );
}

export default Dashboard;
