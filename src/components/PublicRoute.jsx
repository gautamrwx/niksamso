import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../context/profile.context';

const PublicRoute = () => {
    const { profile, isLoading } = useProfile();

    if (!profile && isLoading) {
        return; //wait
    }

    if (profile && !isLoading) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PublicRoute;