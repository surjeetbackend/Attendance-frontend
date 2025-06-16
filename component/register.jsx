import axios from 'axios';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import './register.css';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    dob: '',
    hireDate: new Date().toLocaleDateString(),
  });

  const [status, setStatus] = useState('');
  const [empId, setEmpId] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(croppedImg);
    setImageSrc(null); // Hide crop UI
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    if (!croppedImage) {
      alert('Please upload and crop a photo.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register-form', {
        ...form,
        photo: croppedImage,
      });

      setEmpId(res.data.empId);
      setStatus('Registered successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      setStatus(msg);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Employee Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input type="text" name="phone" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Upload Photo:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

       {imageSrc && (
  <>
    <div className="crop-section">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  

    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <button type="button" className="submit-btn-c" onClick={handleCropSave}>
        Save Cropped Image
      </button>
    </div>
  </>
)}


        {croppedImage && (
          <div className="preview-photo">
            <p>Preview Cropped Photo:</p>
            <img src={croppedImage} alt="Cropped" className="preview-img" />
          </div>
        )}

        <button type="submit" className="submit-btn">Register</button>
      </form>

      {status && <p className="status-msg">{status}</p>}

      {empId && (
        <>
          <p className="success-msg">
            Your Employee ID: <strong>{empId}</strong>
          </p>
          <button className="submit-btn" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </>
      )}
    </div>
  );
}
