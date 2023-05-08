import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn'
import AccountSetup from './pages/AccountSetup';
import Dashboard from './pages/Dashboard';
import ManageVillageMembers from './pages/ManageVillageMembers';
import MyAccount from './pages/MyAccount';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';
import './styles/style.css'

function App() {
  return (
    <ProfileProvider>
      <Routes >
        {/* Public Routes  */}
        <Route element={<PublicRoute />}>
          <Route path="/SignIn" element={<SignIn />} exact />
          <Route path="/AccountSetup" element={<AccountSetup />} exact />
        </Route>

        {/* Secure Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ManageVillageMembers" element={<ManageVillageMembers />} />
          <Route path="/MyAccount" element={<MyAccount />} />
        </Route>
      </Routes >
    </ProfileProvider>
  );
}

export default App;
