import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const profile = false;
    const isLoading = false;

    if (!profile && isLoading) {
        return; //wait
    }

    if (!profile && !isLoading) {
        return <Navigate to="/SignIn" />;
    }

    return <Outlet />;
}

export default PrivateRoute;