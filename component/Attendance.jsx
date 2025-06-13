import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './attendance.css';

export default function Attendance() {
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    empId: localStorage.getItem('empId') || '',
    name: localStorage.getItem('empName') || ''
  });
  const [photo, setPhoto] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    }
    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const imageData = canvasRef.current.toDataURL('image/png');
    setPhoto(imageData);
  };

  const getLocation = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);

          try {
            const apiKey = 'b56b0340a8a34023876b059d5a24b945'; 
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data?.results?.length) {
              resolve(data.results[0].formatted);
            } else {
              resolve(`${lat}, ${lng}`);
            }
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            resolve(`${lat}, ${lng}`);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          reject('Location permission denied or unavailable');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const markAttendance = async (type) => {
    if (!form.empId || !form.name) {
      setStatus('Please enter Employee ID and Name');
      return;
    }

    try {
      const location = await getLocation();
      const res = await axios.post('http://localhost:5000/api/attendanc/mark', {
        ...form,
        type,
        location,
        photo,
      });
      setStatus(res.data.message);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + (err.response?.data?.error || 'Location error'));
    }
  };

  return (
    <div className="attendance-container">
      <h2>📅 Mark Attendance</h2>

      <div className="input-group">
        <label>EMP ID:</label>
        <input
          type="text"
          value={form.empId}
          onChange={(e) => setForm({ ...form, empId: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="input-group">
        <label>NAME:</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label> Capture Photo </label><br />
        <video ref={videoRef} width="320" height="240" autoPlay className="webcam-preview"></video><br />
        <button type="button" onClick={capturePhoto} className="btn">
          Capture
        </button>
        <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
      </div>

      {photo && (
        <div className="photo-preview">
          <p>Selected/Captured Photo:</p>
          <img src={photo} alt="Preview" className="preview-img" />
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => markAttendance('in')} className="btn">Mark In-Time</button>
        <button onClick={() => markAttendance('out')} className="btn">Mark Out-Time</button>
      </div>

      {status && <p className="status">{status}</p>}
    </div>
  );
}
