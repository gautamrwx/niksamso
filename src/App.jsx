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
import { useEffect } from 'react';

function App() {

  // ===[ Cordova Operations ]== 
  useEffect(() => {
    // Logic to prevent Back Button Press On Cordova
    document.addEventListener("backbutton", (event) => {
      const urlLocationHash = window.location.hash;
      if (urlLocationHash === '#/' || urlLocationHash === '#/SignIn' || urlLocationHash === '') {
        event.preventDefault();
        try { navigator.app.exitApp(); }
        catch (e) { /* Nothing to do*/ }
      }
      else {
        window.history.go(-1);
      }
    }, false);

    // 1. Hide App Splash Screen
    // 2. Set Statusbar Background Color
    document.addEventListener("deviceready", (event) => {
      navigator.splashscreen.hide();

      setTimeout(() => {
        window.StatusBar.backgroundColorByHexString('#1976D2');
      }, 1500);

    }, false);
  }, []);

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
