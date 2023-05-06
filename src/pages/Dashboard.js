import { useState } from 'react';
import { useProfile } from '../context/profile.context';
import { child, get, ref } from 'firebase/database';
import { db } from '../misc/firebase';
import { useEffect } from 'react';
import DashboardAppBar from '../components/AppBarComponent/DashboardAppBar';
import TabPanel from '../components/TabPanel';

function Dashboard(props) {
    const { profile } = useProfile();

    const [partyMembersInfo, setPartyMembersInfo] = useState(null);
    const [villageDropDownData, setVillageDropDownData] = useState([]);
    const [selectedVillageKey, setSelctedVillageKey] = useState('');
    const [selectedTabBarIndex, setSelectedTabBarIndex] = useState(0);

    const handleVillageSelectionChange = (event) => {
        const villageKey = event.target.value
        setSelctedVillageKey(villageKey);
        fetchVillagePartyMembers(villageKey);
    };

    // ===< Business Logic [Start] >===
    // ---- Initializing Dashboard (fetch Village list) ----
    useEffect(() => {
        // Step 1. Fetch User-Vllage Key Mapping
        (function () {
            get(child(ref(db), 'mapping-User-villageListData/' + profile.uid)).then((snapshot) => {
                const villageListDataKey = snapshot.val();

                // Step 2. Fetch User-Vllage Key Mapping
                if (villageListDataKey) {
                    get(child(ref(db), "villageListData/" + villageListDataKey)).then((snapshot) => {
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
                        }
                    });
                }
            }).catch((error) => {
                console.log(error);
            });
        })();
    }, [profile]);

    // Fetch Village Party Members  
    const fetchVillagePartyMembers = (villageKey) => {
        // Step 1 > Get Village-PartyMember Relation
        get(child(ref(db), "map-vill-patyMem/" + villageKey)).then((snapshot) => {
            const partyMemberDbKey = snapshot.val();
            if (partyMemberDbKey) {

                // Step 2 > Get PartMember Data .
                get(child(ref(db), "partyMember/" + partyMemberDbKey)).then((snapshot) => {
                    const partyMember = snapshot.val();

                    if (partyMember) {
                        setPartyMembersInfo(partyMember);
                    } else {
                        setPartyMembersInfo(null)
                    }
                });
            } else {
                setPartyMembersInfo(null)
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
                handleVillageSelectionChange={handleVillageSelectionChange}
                selectedTabBarIndex={selectedTabBarIndex}
                setSelectedTabBarIndex={setSelectedTabBarIndex}
            />

            <TabPanel value={selectedTabBarIndex} index={0}>
                {partyMembersInfo ? JSON.stringify(partyMembersInfo.vip) : "PW Not Uploaded"}
            </TabPanel>
            <TabPanel value={selectedTabBarIndex} index={1}>
                {partyMembersInfo ? JSON.stringify(partyMembersInfo.member) : "PM Not Uploaded"}
            </TabPanel>
        </>
    );
}

export default Dashboard;
