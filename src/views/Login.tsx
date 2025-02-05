'use client'

// React Imports
import { useState } from 'react'
import type { FormEvent } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import Logo from '@/components/layout/shared/Logo'

// Config Imports
import themeConfig from '@/configs/themeConfig'

// Axios Import
import axios from 'axios'
import Cookies from 'js-cookie';
import api, { initializeCsrf } from '../app/utils/api';


type FormData = {
  email: string
  password: string
}

const initialFormData: FormData = {
  email: '',
  password: ''
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const router = useRouter()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    const payload = {
      email: formData.email,
      password: formData.password,
    };
    await initializeCsrf();
    try {
      // Use axios for the POST request
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/login`, payload);
  
      // Process response data
      const data = response.data;
  
      if (data) {
        // Set cookies
        Cookies.set('authToken', data.token, { secure: true, sameSite: 'strict' });
        Cookies.set('role', data.user.role, { secure: true, sameSite: 'strict' });
        Cookies.set('name', response.data.user.firstName + ' ' + response.data.user.lastName)
        Cookies.set('firstName', response.data.user.firstName);
        Cookies.set('lastName', response.data.user.lastName);
        Cookies.set('phoneNumber', response.data.user.phoneNumber);
        
        // Set success message and redirect
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center '>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h5'>{`This is the National Cancer Health Fund Portal!👋🏻`}</Typography>
              <Typography className='mbs-1'>Please sign-in to your account with your email or phone number and password</Typography>
            </div>
            {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
            {successMessage && <Typography color='success'>{successMessage}</Typography>}
            <form noValidate autoComplete='off' onSubmit={handleLogin} className='flex flex-col gap-5'>
              <TextField 
                autoFocus 
                fullWidth 
                label='Email'
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
              />
              <TextField
                fullWidth
                label='Password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleFormChange('password', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  Forgot password?
                </Typography>
              </div>
              <Button 
                fullWidth 
                variant='contained' 
                type='submit' 
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={20} />}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
