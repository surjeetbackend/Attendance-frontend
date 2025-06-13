import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import AdminDashboardPage from './component/admin.jsx';
import Attendance from './component/Attendance';
import LeaveRequests from './component/Leave.jsx';
import Login from './component/login';
import Navbar from './component/navbaar.jsx';
import Register from './component/register';
import AdminLogin from './component/AdminLogin.jsx'; 

const DashboardLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave-requests" element={<LeaveRequests />} />
        <Route path="admin" element={<AdminDashboardPage />} />
      </Routes>
    </>
  );
};

// Protected Admin route component
const ProtectedAdmin = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboardPage />
            </ProtectedAdmin>
          }
        />

        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
