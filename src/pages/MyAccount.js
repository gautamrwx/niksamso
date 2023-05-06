import { Container } from '@mui/material';
import SimpleAppBar from '../components/AppBarComponent/SimpleAppBar';

function MyAccount(props) {
    return (
        <>
            <SimpleAppBar props={props} />

           <Container>
            Hi
           </Container>
        </>
    );
}

export default MyAccount;
