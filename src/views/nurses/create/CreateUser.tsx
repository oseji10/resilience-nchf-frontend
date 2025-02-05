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
  
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  assignRole: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  assignRole: ''
}

const CreateUser = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [roles, setRoles] = useState<{ roleId: string; roleName: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch doctor names from the API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/roles`)
        const data = await response.json()
        // const allDoctors = data.flatMap(user => user.doctors)
        setRoles(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }
    fetchRoles()
  }, [])

  // Handle form changes
  const handleFormChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    // Ensure dateOfBirth is a Date object
    const formattedDateOfBirth = new Date(`${formData.dateOfBirth}T00:00:00Z`);

    // Prepare payload with the Date object for dateOfBirth
    const payload = {
      
        
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.assignRole,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/users`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User created successfully!',
        timer: 3000,
        showConfirmButton: false
      })
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
          Create New Patient
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
           
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
         
            
          
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Email"
                value={formData.email}
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign Role</InputLabel>
                <Select
                required
                  value={formData.assignRole}
                  onChange={e => handleFormChange('assignRole', e.target.value)}
                >
                  {roles.map(role => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Submit and Reset Buttons */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save User'}
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

export default CreateUser
