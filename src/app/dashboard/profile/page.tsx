'use client';

// React Imports
import { useState } from 'react';

// MUI Imports
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Axios Import
import axios from 'axios';
import Cookies from 'js-cookie';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  currentPassword: string;
            newPassword: string;
            newPasswordConfirmation: string;
};

const initialFormData: FormData = {
  firstName: Cookies.get('firstName') || '',
  lastName: Cookies.get('lastName') || '',
  email: Cookies.get('email') || '',
  phoneNumber: Cookies.get('phoneNumber') || '',
  currentPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
};

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [password_loading, setPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password_error, setPasswordError] = useState('');
  const [password_success, setPasswordSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const token = Cookies.get('authToken');

  const handleToggleVisibility = (field: string) => {
    if (field === 'current') setShowCurrentPassword((prev) => !prev);
    if (field === 'new') setShowNewPassword((prev) => !prev);
    if (field === 'confirm') setShowConfirmPassword((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setSuccess('');
  
  //   if (formData.newPassword && formData.newPassword !== formData.newPasswordConfirmation) {
  //     setError('New password and confirm password do not match.');
  //     return;
  //   }
  
  //   setLoading(true);
  //   try {
  //     const payload = {
  //       first_name: formData.firstName,
  //       last_name: formData.lastName,
  //       email: formData.email,
  //       phone_number: formData.phoneNumber,
  //       currentPassword: formData.currentPassword,
  //       newPassword: formData.newPassword,
  //       newPasswordConfirmation: formData.newPasswordConfirmation,
  //     };
  
  //     await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/change-password`, payload, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     setSuccess('Profile and password updated successfully!');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'An error occurred. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

   

    setLoading(true);
    try {
      const payload = {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
            };
      await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/update-profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

     

      setSuccess('Profile and password updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword && newPassword !== newPasswordConfirmation) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const payload = {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
              newPasswordConfirmation: formData.newPasswordConfirmation,
            };
     
        await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/change-password`,
            payload,
          
          { headers: { Authorization: `Bearer ${token}` } }
        );
      

      setPasswordSuccess('Password updated successfully!');
    } catch (err) {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-100">
      <Card className="max-w-md w-full">
        <CardContent>
          <Typography variant="h3" className="mb-4">
            Update Profile
          </Typography>

          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              type="text"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              type="text"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              type="text"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
<br/>

<hr/>

<br/>
          <Typography variant="h3" className="mb-4">
           Change Password
          </Typography>

          {password_error && <Alert severity="error" className="mb-4">{password_error}</Alert>}
          {password_success && <Alert severity="success" className="mb-4">{password_success}</Alert>}

          <form onSubmit={changePassword} className="flex flex-col gap-4">
       
            <TextField
              fullWidth
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              name="currentPassword"
              // value={currentPassword}
              // onChange={(e) => setCurrentPassword(e.target.value)}
              value={formData.currentPassword}
  onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('current')}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              name="newPassword"
              // value={newPassword}
              // onChange={(e) => setNewPassword(e.target.value)}
              value={formData.newPassword}
  onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('new')}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              name="newPasswordConfirmation"
              // value={newPasswordConfirmation}
              // onChange={(e) => setConfirmPassword(e.target.value)}
              value={formData.newPasswordConfirmation}
  onChange={handleInputChange}

              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleToggleVisibility('confirm')}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={password_loading}
              startIcon={password_loading && <CircularProgress size={20} />}
            >
              {loading ? 'Changing...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
