"use client"

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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie'
const Biodata = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const patientId = searchParams.get('patientId')
  const patientName = searchParams.get('patientName')

const firstName = Cookies.get("firstName");
const lastName = Cookies.get("lastName");
const otherNames = Cookies.get("otherNames");
const phoneNumber = Cookies.get("phoneNumber");

  const [formData, setFormData] = useState({
    patientId: '',
    NIN: '',
    hospitalFileNumber: '',
    hospital: '',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    stateOfResidence: '',
    lgaOfResidence: '',
    
    bloodgroup: '',
    occupation: '',
    dateOfBirth: '',
    address: '',
    nextOfKin: '',
    nextOfKinAddress: '',
    nextOfKinPhoneNumber: '',
    nextOfKinEmail: '',
    nextOfKinRelationship: '',
    nextOfKinOccupation: '',
    nextOfKinGender: '',
    hmoId: '',
    cancerType: '',
  })
  const [loading, setLoading] = useState(false)
  const [hospitals, setHospitals] = useState([])
  const [cancerTypes, setCancerTypes] = useState([])
  const [states, setStates] = useState([])
  const [lgas, setLgas] = useState([])
  const [step, setStep] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hospitalsRes, cancerRes, statesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/cancer_types`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/states`)
        ])
        setHospitals(hospitalsRes.data)
        setCancerTypes(cancerRes.data)
        setStates(statesRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (formData.stateOfResidence) {
      axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/lgas?state=${formData.stateOfResidence}`)
        .then(response => setLgas(response.data))
        .catch(error => console.error('Error fetching LGAs:', error))
    }
  }, [formData.stateOfResidence])

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/biodata`, formData)
      Swal.fire({ icon: 'success', title: 'Success', text: 'Data submitted successfully!', timer: 3000, showConfirmButton: false })
      router.push(`/dashboard/summary?patientId=${patientId}`)
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred while submitting data.', timer: 3000, showConfirmButton: false })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cancer Health Fund Application
        </Typography>
        {/* <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography> */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {step === 1 && (
              <> 
              <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Identity Verification
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}><TextField type='number' fullWidth label="NIN" value={formData.NIN} onChange={(e) => handleFormChange('NIN', e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => handleFormChange('phoneNumber', e.target.value)} InputLabelProps={{ shrink: !!phoneNumber }} aria-readonly/></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={firstName} onChange={(e) => handleFormChange('firstName', e.target.value)}     InputLabelProps={{ shrink: !!firstName }} aria-readonly/></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={lastName} onChange={(e) => handleFormChange('lastName', e.target.value)}    InputLabelProps={{ shrink: !!lastName }} aria-readonly/></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Other Names" value={otherNames} onChange={(e) => handleFormChange('otherNames', e.target.value)}     InputLabelProps={{ shrink: !!otherNames }} aria-readonly/></Grid>
                <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Gender</InputLabel><Select value={formData.gender} onChange={(e) => handleFormChange('gender', e.target.value)}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select></FormControl></Grid>
              </>
            )}
            {step === 2 && (
              <> 
               <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Hospital Details
                  </Typography>
                </Grid>
              <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Hospital</InputLabel><Select value={formData.hospital} onChange={(e) => handleFormChange('hospital', e.target.value)}>{hospitals.map(hospital => <MenuItem key={hospital.id} value={hospital.id}>{hospital.name}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="Hospital File Number" value={formData.hospitalFileNumber} onChange={(e) => handleFormChange('hospitalFileNumber', e.target.value)} /></Grid>
              </>
            )}
            {step === 3 && (
              <> 
                <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Hospital</InputLabel><Select value={formData.hospital} onChange={(e) => handleFormChange('hospital', e.target.value)}>{hospitals.map(hospital => <MenuItem key={hospital.id} value={hospital.id}>{hospital.name}</MenuItem>)}</Select></FormControl></Grid>
                <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Cancer Type</InputLabel><Select value={formData.cancerType} onChange={(e) => handleFormChange('cancerType', e.target.value)}>{cancerTypes.map(cancer => <MenuItem key={cancer.id} value={cancer.id}>{cancer.name}</MenuItem>)}</Select></FormControl></Grid>
              </>
            )}
          </Grid>
          <Grid item xs={12} className="mt-4">
            {step > 1 && <Button variant="contained" onClick={prevStep}>Previous</Button>} &nbsp;
            {step < 3 ? <Button variant="contained" color="primary" onClick={nextStep}>Next</Button> : <Button variant="contained" color="primary" type="submit" disabled={loading} startIcon={loading && <CircularProgress size={20} />}>{loading ? 'Submitting...' : 'Submit'}</Button>}
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
// 'hospitalFileNumber',
//         'hospital',
//         'stateOfOrigin',
//         'lgaOfOrigin',
//         'stateOfResidence',
//         'lgaOfResidence',
        
//         'gender',
//         'bloodgroup',
//         'occupation',
//         'dateOfBirth',
//         'address',
//         'nextOfKin',
//         'nextOfKinAddress',
//         'nextOfKinPhoneNumber',
//         'nextOfKinEmail',
//         'nextOfKinRelationship',
//         'nextOfKinOccupation',
//         'nextOfKinGender',
//         'hmoId',

export default Biodata
