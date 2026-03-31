import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ReceptionistDashboardPage from './pages/receptionist/ReceptionistDashboardPage.jsx';
import ReceptionistPatientsPage from './pages/receptionist/ReceptionistPatientsPage.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route
          path="/receptionist/dashboard"
          element={<ReceptionistDashboardPage />}
        />
        <Route
          path="/receptionist/patients"
          element={<ReceptionistPatientsPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
