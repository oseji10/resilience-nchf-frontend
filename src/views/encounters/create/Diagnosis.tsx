'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

const Diagnosis = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');

  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    diagnosisRight: '',
    diagnosisLeft: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/diagnosis_list`);
        setDiagnosisList(response.data || []);
      } catch (error) {
        console.error('Error fetching diagnosis data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load diagnosis data.',
        });
      }
    };
    fetchData();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      patientId,
      encounterId,
      ...formData,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/diagnosis`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push(
        `/dashboard/encounters/sketch?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`
      );
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting data.',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Page 4: Diagnosis
        </Typography>
        <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Dropdown Fields */}
            {['diagnosisRight', 'diagnosisLeft'].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{`Diagnosis (${field.includes('Right') ? 'Right' : 'Left'})`}</InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                  >
                    {diagnosisList.map((option: any) => (
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
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default Diagnosis;
