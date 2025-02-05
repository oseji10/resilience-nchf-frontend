'use client'

import { useState } from 'react'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const SearchPatient = () => {
  const [query, setQuery] = useState<string>('')
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
  
    if (!searchQuery.trim()) {
      setPatient(null);
      setError('');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/patients/search`,
        {
          params: { queryParameter: searchQuery }, // Include query parameter in the URL
        }
      );
  
      if (response.status === 200 && response.data.length > 0) {
        setPatient(response.data[0]); // Assuming you want the first patient
        setError('');
      } else {
        setPatient(null);
        setError('No patient found');
      }
    } catch (err: any) {
      setPatient(null);
      setError('No patient found');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleContinue = () => {
    if (patient) {
      window.location.href = `/appointments/create-appointment?patientId=${patient.patientId}&patientName=${patient.firstName}%20${patient.lastName}` // Adjust the next-page URL as needed
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
          padding: 3,
          bgcolor: '#ffffff',
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            textAlign="center"
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            Search for Patient
          </Typography>
          <TextField
            placeholder="Enter patient ID"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : patient ? (
            <Box textAlign="center" mt={3}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {patient.firstName} {patient.lastName} {patient.otherNames}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Date Of Birth:</strong> {patient.dateOfBirth}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Gender:</strong> {patient.gender}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleContinue}
                sx={{ fontWeight: 'bold', mt: 2 }}
              >
                Continue
              </Button>
            </Box>
          ) : error ? (
            <Typography color="error" textAlign="center" mt={2}>
              {error}
            </Typography>
          ) : null}
        </CardContent>
      </Card>
    </Box>
  )
}

export default SearchPatient
