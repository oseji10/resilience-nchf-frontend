'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'

const Consulting = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const patientId = searchParams.get('patientId') // Retrieve patientId from the URL
  const patientName = searchParams.get('patientName')

  const [visualAcuityFar, setVisualAcuityFar] = useState<any[]>([])
  const [visualAcuityNear, setVisualAcuityNear] = useState<any[]>([])
  const [formData, setFormData] = useState({
    visualAcuityFarBestCorrectedLeft: '',
    visualAcuityFarBestCorrectedRight: '',
    visualAcuityFarPresentingLeft: '',
    visualAcuityFarPresentingRight: '',
    visualAcuityFarPinholeRight: '',
    visualAcuityFarPinholeLeft: '',
    visualAcuityNearLeft: '',
    visualAcuityNearRight: '',
  })
  const [loading, setLoading] = useState(false) // Spinner state

  // Fetch data for visual acuity options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farResponse, nearResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_far`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/visual_acuity_near`),
        ])

        setVisualAcuityFar(Array.isArray(farResponse.data) ? farResponse.data : [])
        setVisualAcuityNear(Array.isArray(nearResponse.data) ? nearResponse.data : [])
      } catch (error) {
        console.error('Error fetching visual acuity data:', error)
      }
    }
    fetchData()
  }, [])

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // Start spinner

    const payload = {
      patientId, // Include patientId in the payload
      ...formData,
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/consulting`, payload)
      const  encounterId  = response.data.encounterId
      // console.log(response.data.encounterId)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      })
      router.push(`/dashboard/encounters/continue-consulting?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`) // Redirect to another page upon success
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting data.',
        timer: 3000,
        showConfirmButton: false,
      })
    } finally {
      setLoading(false) // Stop spinner
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Page 1: Consulting
        </Typography>
        <Typography variant="h6" gutterBottom>
          Patient Details: {patientName} 
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            {[
              { label: 'Visual Acuity Far Best Corrected Left', field: 'visualAcuityFarBestCorrectedLeft' },
              { label: 'Visual Acuity Far Best Corrected Right', field: 'visualAcuityFarBestCorrectedRight' },
              { label: 'Visual Acuity Far Presenting Left', field: 'visualAcuityFarPresentingLeft' },
              { label: 'Visual Acuity Far Presenting Right', field: 'visualAcuityFarPresentingRight' },
              { label: 'Visual Acuity Far Pinhole Right', field: 'visualAcuityFarPinholeRight' },
              { label: 'Visual Acuity Far Pinhole Left', field: 'visualAcuityFarPinholeLeft' },
              { label: 'Visual Acuity Near Left', field: 'visualAcuityNearLeft' },
              { label: 'Visual Acuity Near Right', field: 'visualAcuityNearRight' },
            ].map(({ label, field }) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                  >
                    {(field.includes('Near') ? visualAcuityNear : visualAcuityFar)?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} className="mt-4">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading} // Disable button during loading
              startIcon={loading && <CircularProgress size={20} />} // Show spinner
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default Consulting
