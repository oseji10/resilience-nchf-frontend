'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation'
// SweetAlert2 Import
import Swal from 'sweetalert2'
import Logo from '@/@core/svg/Logo'
import themeConfig from '@/configs/themeConfig'
// Register Component
const Register = () => {
  // Form state
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    languageId: '',
  })

  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState([])

  const router = useRouter();
  // Fetch languages on component mount
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/languages`)
        const data = await response.json()
        setLanguages(data)
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }

    fetchLanguages()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Successful!',
          text: 'Your data has been submitted successfully. Please check your phone or email for further instructions.',
        })

        setFormData({ phoneNumber: '', email: '', firstName: '', lastName: '', otherNames: '', languageId: '' })
        setTimeout(() => router.push('/login'), 1500);
      } else {
        let errorMessage = result.message || 'Something went wrong. Please try again.'

        if (result.errors) {
          if (result.errors.email) {
            errorMessage = result.errors.email[0]
          } else if (result.errors.phoneNumber) {
            errorMessage = result.errors.phoneNumber[0]
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Registration Failed!',
          text: errorMessage,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-6 bg-gray-50'>
      <Card className='shadow-lg w-full max-w-lg rounded-lg'>
        <CardContent className='p-8'>
          {/* Logo Section */}
          {/* <div className='flex justify-center mb-6'> */}
          <Link href='/' className='flex justify-center items-center'>
  <Logo style={{ width: '100px', height: '50px !important' }} />
</Link>

          {/* </div> */}

          {/* Title */}
          <Typography variant='h6' className='text-center font-semibold text-gray-800 mb-2'>
            Your Cancer Health Fund application starts here 🚀
          </Typography>
          <Typography className='text-center text-gray-600 mb-6'>Fill in this form to start the process</Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField name='phoneNumber' label='Phone Number' fullWidth required value={formData.phoneNumber} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name='email' label='Email (Optional)' fullWidth value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name='firstName' label='First Name' fullWidth required value={formData.firstName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name='lastName' label='Last Name' fullWidth required value={formData.lastName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name='otherNames' label='Other Names (Optional)' fullWidth value={formData.otherNames} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Language</InputLabel>
                  <Select name='languageId' value={formData.languageId} onChange={handleChange} required>
                    {languages.map((language) => (
                      <MenuItem key={language.languageId} value={language.languageId}>
                        {language.languageName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button fullWidth variant='contained' color='secondary'  type='submit' disabled={loading} className='mt-4'>
              {loading ? 'Submitting...' : 'Start Application'}
            </Button>


            <div className='flex justify-center items-center flex-wrap gap-2 mt-4'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href='/login' color='secondary' className='font-semibold'>
                Sign in instead
              </Typography>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
