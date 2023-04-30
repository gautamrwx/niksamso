import { Navigate,Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const profile = false;
    const isLoading = false;

    if (!profile && isLoading) {
        return; //wait
    }

    if (profile && !isLoading) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PublicRoute;