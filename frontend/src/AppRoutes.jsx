import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage.jsx';
import DoctorPatientSummaryPage from './pages/doctor/DoctorPatientSummaryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PharmacyDashboardPage from './pages/pharmacy/PharmacyDashboardPage.jsx';
import PharmacyMedicineMasterPage from './pages/pharmacy/PharmacyMedicineMasterPage.jsx';
import PharmacyMedicineStorePage from './pages/pharmacy/PharmacyMedicineStorePage.jsx';
import PharmacyPatientPrescriptionPage from './pages/pharmacy/PharmacyPatientPrescriptionPage.jsx';
import ReceptionistDashboardPage from './pages/receptionist/ReceptionistDashboardPage.jsx';
import ReceptionistPatientsPage from './pages/receptionist/ReceptionistPatientsPage.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
        <Route
          path="/doctor/patients/:patientId/summary"
          element={<DoctorPatientSummaryPage />}
        />
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboardPage />} />
        <Route
          path="/pharmacy/medicine-master"
          element={<PharmacyMedicineMasterPage />}
        />
        <Route
          path="/pharmacy/medicine-store"
          element={<PharmacyMedicineStorePage />}
        />
        <Route
          path="/pharmacy/patients/:patientId"
          element={<PharmacyPatientPrescriptionPage />}
        />
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
