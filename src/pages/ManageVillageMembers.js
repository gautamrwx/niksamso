import { Container } from '@mui/material';
import SimpleAppBar from '../components/AppBarComponent/SimpleAppBar';

function ManageVillageMembers(props) {
    return (
        <>
            <SimpleAppBar props={props} />

            <Container>
                Manage Village Member
            </Container>
        </>
    );
}

export default ManageVillageMembers;
