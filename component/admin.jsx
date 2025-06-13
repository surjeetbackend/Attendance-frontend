import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(null); // 'employee' | 'attendance' | null
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000'; // Update with your actual backend URL

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const name = localStorage.getItem('adminName') || 'Admin';

    if (isLoggedIn !== 'true') {
      navigate('/admin-login');
      return;
    }

    setAdminName(name);

    const fetchData = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin/user`),
          axios.get(`${BASE_URL}/api/admin/attendances`)
        ]);
        setEmployees(empRes.data || []);
        setAttendance(attRes.data || []);
      } catch (err) {
        console.error('❌ Failed to fetch data:', err);
        setEmployees([]);
        setAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="loading-screen">Loading data...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Welcome, {adminName} 🎉</h2>
        <button
          className="btn-secondary"
          style={{ float: 'right' }}
          onClick={() => {
            localStorage.removeItem('isAdminLoggedIn');
            navigate('/login');
          }}
        >
          🚪 Logout
        </button>
      </div>

      {!view && (
        <div className="card-container">
          <div className="admin-card" onClick={() => setView('employee')}>
            👥 Employee Registration
          </div>
          <div className="admin-card" onClick={() => setView('attendance')}>
            🕒 Attendance Records
          </div>
        </div>
      )}

      {view === 'employee' && (
        
        <div className="section-box">
          <button className="btn-secondary back-btn" onClick={() => setView(null)}>
      🔙 Back to Dashboard
    </button>
          <div className="section-header">
            <h1>📋 Employee List</h1>
            <CSVLink
              data={employees.map(e => ({
                empId: e.empId,
                name: e.name,
                phone: e.phone,
                email: e.email,
                hireDate: e.hireDate,
              }))}
              headers={[
                { label: "Employee ID", key: "empId" },
                { label: "Name", key: "name" },
                { label: "Phone", key: "phone" },
                { label: "Email", key: "email" },
                { label: "Join Date", key: "hireDate" }
              ]}
              filename="employees.csv"
            >
              <button className="btn-primary">Download Employees</button>
            </CSVLink>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e._id || e.empId}>
                    <td>{e.empId}</td>
                    <td className="name-cell">
                      <img
                        src={e.photo || '/default-avatar.png'}
                        alt="avatar"
                        className="avatar"
                      />
                      <span>{e.name}</span>
                    </td>
                    <td>{e.email || '-'}</td>
                    <td>{e.phone || '-'}</td>
                    <td>{e.hireDate || '-'}</td>
                    <td className="actions-cell">
                      <button className="edit-btn"><FaEdit /></button>
                      <button className="delete-btn"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'attendance' && (
        <div className="section-box">
          <button className="btn-secondary back-btn" onClick={() => setView(null)}>
      🔙 Back to Dashboard
    </button>
          <div className="section-header">
            <h1>🕒 Attendance Records</h1>
            <CSVLink
              data={attendance.map(a => ({
                name: a.name,
                empId: a.empId,
                date: a.date,
                inTime: a.inTime || '-',
                outTime: a.outTime || '-',
                inLocation: a.inLocation?.location || '-',
                outLocation: a.outLocation?.location || '-'
              }))}
              headers={[
                { label: "Name", key: "name" },
                { label: "Employee ID", key: "empId" },
                { label: "Date", key: "date" },
                { label: "In Time", key: "inTime" },
                { label: "Out Time", key: "outTime" },
                { label: "In-Time Location", key: "inLocation" },
                { label: "Out-Time Location", key: "outLocation" }
              ]}
              filename="attendance.csv"
            >
              <button className="btn-primary">Download Attendance</button>
            </CSVLink>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>Out Time</th>
                  <th>In-Time Location</th>
                  <th>Out-Time Location</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a._id}>
                    <td>{a.name}</td>
                    <td>
                      <img
                        src={a.photo || '/default-avatar.png'}
                        alt="attendance"
                        className="avatar"
                      />
                    </td>
                    <td>{a.date}</td>
                    <td>{a.inTime || '-'}</td>
                    <td>{a.outTime || '-'}</td>
                    <td>{a.inLocation || '-'}</td>
                    <td>{a.outLocation || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
