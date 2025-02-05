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
import { useRouter, useSearchParams } from 'next/navigation'
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';



// Type Definitions
type FormData = {
  
  appointmentDate: string
  appointmentTime: string
  comment: string
  assignDoctor: string
  patientId: string
}

const initialFormData: FormData = {
  appointmentDate: '',
  appointmentTime: '',
  comment: '',
  assignDoctor: '',
  patientId: ''
}



const CreateEncounterAppointment = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [doctors, setDoctors] = useState<{ doctorId: string; doctorName: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)


  const searchParams = useSearchParams();
const router = useRouter();
const patientId = searchParams.get('patientId');
const patientName = searchParams.get('patientName');
const encounterId = searchParams.get('encounterId');

const [value, setValue] = useState(new Date()); // Set initial time to current time

  // Handle time change
  const handleTimeChange = (newTime) => {
    setValue(newTime);
    // Format the time into HH:mm format and update formData
    const formattedTime = `${newTime.getHours()}:${newTime.getMinutes() < 10 ? '0' : ''}${newTime.getMinutes()}`;
    handleFormChange('appointmentTime', formattedTime);
  };
  
  // Fetch doctor names from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`)
        const data = await response.json()
        setDoctors(data)
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
  
    // Ensure dateOfBirth is a Date object
    const formattedDateOfBirth = new Date(`${formData.dateOfBirth}T00:00:00Z`);

    // Prepare payload with the Date object for dateOfBirth
    const payload = {
      
        
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        comment: formData.comment,
        doctor: formData.assignDoctor,
        patientId: patientId,
        encounterId: encounterId
      
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/encounter-appointment`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      )
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appoitment created successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      setFormData(initialFormData)
      router.push(
        `/encounters`
      );
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
          Creating Appointment for <b>{patientName}</b>
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
           
            <Grid item xs={12} sm={6}>
  <TextField
    type="date"
    fullWidth
    label="Appointment Date"
    value={formData.appointmentDate}
    onChange={e => handleFormChange('appointmentDate', e.target.value)}
    InputLabelProps={{
      shrink: true, // Ensures the label stays visible when the input is focused
    }}
    inputProps={{
      min: new Date().toISOString().split('T')[0], // Disables previous dates
    }}
  />
</Grid>


<Grid item xs={12} sm={6}>
  <TextField
    type="time"
    fullWidth
    label="Appointment Time"
    value={formData.appointmentTime}
    onChange={e => handleFormChange('appointmentTime', e.target.value)}
  />
</Grid>

         
            <Grid item xs={12} sm={6}>
              <TextField
              required
                fullWidth
                label="Comment"
                value={formData.comment}
                onChange={e => handleFormChange('comment', e.target.value)}
              />
            </Grid>


        

          
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Doctor</InputLabel>
                <Select
                required
                  value={formData.assignDoctor}
                  onChange={e => handleFormChange('assignDoctor', e.target.value)}
                >
                  {doctors.map(doctor => (
                    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
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
              {loading ? 'Saving...' : 'Save Appointment'}
            </Button>
            <a href='/encounters'><Button
              variant="outlined"
              color="error"
              type="reset"
              className="ml-2"
              
            >
              Don't Fix Appointment
            </Button></a>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateEncounterAppointment
