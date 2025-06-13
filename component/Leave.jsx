import axios from 'axios';
import { useEffect, useState } from 'react';

const LeaveForm = ({ employeeId, employeeName }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);

  const applyLeave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/leave/apply', {
        employeeId,
        employeeName,
        startDate,
        endDate,
        reason,
      });
      setMessage(res.data.message);
      fetchMyLeaves();
    } catch (error) {
      setMessage('Failed to submit leave.');
    }
  };

  const fetchMyLeaves = async () => {
    try {
      const res = await axios.get(`/api/leaves/my/${employeeId}`);
      setMyLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves');
    }
  };

  useEffect(() => {
    if (employeeId) fetchMyLeaves();
  }, [employeeId]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
      <form onSubmit={applyLeave} className="space-y-3">
        <input
          type="date"
          className="w-full border rounded p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          className="w-full border rounded p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded p-2"
          placeholder="Reason for leave"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Leave
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>

      <h3 className="text-lg font-semibold mt-8">My Leave Requests</h3>
      <ul className="mt-3 space-y-2">
        {myLeaves.map((leave) => (
          <li key={leave._id} className="border p-3 rounded shadow">
            <p><strong>{leave.startDate} to {leave.endDate}</strong></p>
            <p>Reason: {leave.reason}</p>
            <p>Status: <span className={
              leave.status === 'approved' ? 'text-green-600' : 
              leave.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}>
              {leave.status}
            </span></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveForm;
