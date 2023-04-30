import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn'
import SetPassword from './pages/SetPassword';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Routes >
      {/* Public Routes  */}
      <Route element={<PublicRoute />}>
        <Route path="/SignIn" element={<SignIn />} exact />
        <Route path="/SetPassword" element={<SetPassword />} exact/>
      </Route>
      
      {/* Secure Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes >
  );
}

export default App;
