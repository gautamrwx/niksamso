import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../context/profile.context';

const PrivateRoute = () => {
    const { profile, isLoading } = useProfile();

    if (!profile && isLoading) {
        return; //wait
    }

    if (!profile && !isLoading) {
        return <Navigate to="/SignIn" />;
    }

    return <Outlet />;
}

export default PrivateRoute;