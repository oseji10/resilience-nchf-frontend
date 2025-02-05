'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Swal from 'sweetalert2'

// Type Definitions
type FormData = {
  hospitalFileNumber: string
  firstName: string
  lastName: string
  otherNames: string
  gender: string
  bloodGroup: string
  occupation: string
  dateOfBirth: string
  email: string
  phoneNumber: string
  address: string
  assignDoctor: string
}

const initialFormData: FormData = {
  hospitalFileNumber: '',
  firstName: '',
  lastName: '',
  otherNames: '',
  gender: '',
  bloodGroup: '',
  occupation: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  address: '',
  assignDoctor: ''
}

const CreateEncounter = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [doctors, setDoctors] = useState<{ id: string; doctorName: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch doctor names from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors/4`)
        const data = await response.json()
        const allDoctors = data.flatMap(user => user.doctors)
        setDoctors(allDoctors)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    fetchDoctors()
  }, [])

  // Handle form changes
  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Prepare payload
    const payload = {
      patientData: {
        hospitalFileNumber: formData.hospitalFileNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        otherNames: formData.otherNames,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        occupation: formData.occupation,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        status: 'Active',
        doctorId: formData.assignDoctor
      },
      userAccountData: {
        email: formData.email,
        password: 'password',
        phoneNumber: formData.phoneNumber
      }
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patients/create`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient created successfully!',
            timer: 3000,
            showConfirmButton: false
          })
      // console.log('Patient created successfully:', response.data)
      setFormData(initialFormData) // Reset form after success
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
        timer: 3000,
        showConfirmButton: false
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Encounter
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hospital File Number"
                value={formData.hospitalFileNumber}
                onChange={e => handleFormChange('hospitalFileNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Other Names"
                value={formData.otherNames}
                onChange={e => handleFormChange('otherNames', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={e => handleFormChange('gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  {/* <MenuItem value="Other">Other</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={formData.bloodGroup}
                  onChange={e => handleFormChange('bloodGroup', e.target.value)}
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={formData.occupation}
                onChange={e => handleFormChange('occupation', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date of Birth"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={e => handleFormChange('dateOfBirth', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={e => handleFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Doctor</InputLabel>
                <Select
                  value={formData.assignDoctor}
                  onChange={e => handleFormChange('assignDoctor', e.target.value)}
                >
                  {doctors.map(doctor => (
                    <MenuItem key={doctor.id} value={doctor.user.userId}>
                      {doctor.doctorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Submit and Reset Buttons */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Patient'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              type="reset"
              className="ml-2"
              onClick={() => setFormData(initialFormData)}
            >
              Reset
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateEncounter
