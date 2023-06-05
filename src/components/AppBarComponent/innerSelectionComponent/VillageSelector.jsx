import { Autocomplete, Box, Popper, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useVillages } from '../../../context/Villages.context';

export default function VillageSelector({
    handleVillageSelectionChange,
    setIsVillageSelected
}) {
    const { villages } = useVillages();
    const [selectedDDVillage, setSelectedDDVillage] = useState(null);

    // On DD change Event
    const onVillageSelectionChange = (event, value, reason) => {
        switch (reason) {
            case 'clear':
                setSelectedDDVillage(null);
                handleVillageSelectionChange();
                setIsVillageSelected(false);
                break;
            case 'selectOption':
                setSelectedDDVillage(value);
                handleVillageSelectionChange(value.mappedPartyPeoplesKey,value.villageName);
                setIsVillageSelected(true);
                break;
            default:
                break;
        }
    }

    // User Dropdown Data Configuration
    const [userDropdownListOption, setUserDropdownListOption] = useState([]);
    useEffect(() => {
        // Set Users Data in dropDown 
        setUserDropdownListOption(villages.map((option) => {
            const firstLetter = option.villageName[0].toUpperCase();
            return {
                firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
                ...option,
            };
        }));

    }, [villages]);


    /**----- UI Component [Start]---- */
    const styles = (theme) => ({
        popper: {
            width: "fit-content"
        }
    });

    const PopperMy = function (props) {
        return <Popper {...props} style={styles.popper} placement="bottom-start" />;
    };
    /**----- UI Component [END]---- */

    return (
        <Box display='flex' flexDirection='row' sx={{ width: { xs: 1, sm: 2 / 5, md: 300, lg: 350 }, ml: 1 }}>
            <Autocomplete
                fullWidth
                PopperComponent={PopperMy}
                size='small'
                className='selectItemOnAppBar'
                blurOnSelect={true}
                value={selectedDDVillage}
                onChange={onVillageSelectionChange}
                options={userDropdownListOption.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                groupBy={(option) => option.firstLetter}
                getOptionLabel={(option) => option.villageName}
                renderInput={(params) => <TextField {...params} label="Village" />}
            />
        </Box >
    )
}