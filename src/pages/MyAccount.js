import { Container } from '@mui/material';
import SimpleAppBar from '../components/AppBarComponent/SimpleAppBar';

function MyAccount(props) {
    return (
        <>
            <SimpleAppBar props={props} />

            <Container>
                My Account
            </Container>
        </>
    );
}

export default MyAccount;
