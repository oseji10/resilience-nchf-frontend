'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// SweetAlert2 Import
import Swal from 'sweetalert2'

// Register Component
const Register = () => {
  // Form state
  const [formData, setFormData] = useState(
    {
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    otherNames: '',
  })

  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Successful!',
          text: 'Your data has been submitted successfully. Please check your phone or email for further instructions.',
        });
        setFormData({ phoneNumber: '', email: '', firstName: '', lastName: '', otherNames: '' });
      } else {
        let errorMessage = result.message || 'Something went wrong. Please try again.';
  
        // Handle validation errors
        if (result.errors) {
          if (result.errors.email) {
            errorMessage = result.errors.email[0]; // "The email has already been taken."
          } else if (result.errors.phoneNumber) {
            errorMessage = result.errors.phoneNumber[0]; // "The phone number has already been taken."
          }
        }
  
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed!',
          text: errorMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/about' className='flex justify-center items-start mbe-6'>
            <Typography variant='h5'>CHF Application starts here 🚀</Typography>
          </Link>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>Fill in this form to start the process</Typography>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField name='phoneNumber' label='Phone Number' fullWidth required value={formData.phoneNumber} onChange={handleChange} />
              <TextField name='email' label='Email (Optional)' fullWidth value={formData.email} onChange={handleChange} />
              <TextField name='firstName' label='First Name' fullWidth required value={formData.firstName} onChange={handleChange} />
              <TextField name='lastName' label='Last Name' fullWidth required value={formData.lastName} onChange={handleChange} />
              <TextField name='otherNames' label='Other Names (Optional)' fullWidth value={formData.otherNames} onChange={handleChange} />

              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                {loading ? 'Submitting...' : 'Start Application'}
              </Button>

              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Already have an account?</Typography>
                <Typography component={Link} href='/login' color='primary'>
                  Sign in instead
                </Typography>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
