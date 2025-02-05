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
import TextField from '@mui/material/TextField';

const Investigation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');

  const [investigationList, setInvestigationList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    investigationRight: '',
    investigationLeft: '',
    investigationsRequired: '',
    externalInvestigationsRequired: '',
    investigationsDone: '',
    HBP: false,
    diabetes: false,
    pregnancy: false,
    food: '',
    drugAllergy: '',
    currentMedication: '',
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/investigation_list`);
  //       setInvestigationList(response.data || []);
  //     } catch (error) {
  //       console.error('Error fetching investigation data:', error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'Failed to load investigation data.',
  //       });
  //     }
  //   };
  //   fetchData();
  // }, []);

  const [loading, setLoading] = useState(false);

  const handleFormChange = (field: string, value: any) => {
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
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/investigations`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push(
        `/dashboard/encounters/treatment?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`
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
          Page 7: Investigation
        </Typography>
        <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Dropdown Fields
            {['investigationRight', 'investigationLeft'].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <FormControl fullWidth>
                  <InputLabel>{`Investigation (${field.includes('Right') ? 'Right' : 'Left'})`}</InputLabel>
                  <Select
                    value={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                  >
                    {investigationList.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))} */}

            {/* New TextArea Fields Using TextField */}
            {[
              { field: 'investigationsRequired', label: 'Investigations Required' },
              { field: 'externalInvestigationsRequired', label: 'External Investigations Required' },
              { field: 'investigationsDone', label: 'Investigations Done' },
            ].map(({ field, label }) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={label}
                  multiline
                  rows={3}
                  fullWidth
                  value={formData[field]}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                />
              </Grid>
            ))}

            {/* Physical Information Section */}
            <Grid item xs={12}>
              <Typography variant="h6">Physical Information</Typography>
            </Grid>

            {[
              { label: 'HBP', field: 'HBP' },
              { label: 'Diabetes', field: 'diabetes' },
              { label: 'Pregnancy', field: 'pregnancy' },
            ].map(({ label, field }) => (
              <Grid item xs={4} sm={2} key={field}>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={formData[field]}
                    onChange={(e) => handleFormChange(field, e.target.checked)}
                  />
                  <Typography variant="body2">{label}</Typography>
                </FormControl>
              </Grid>
            ))}

            {/* Textarea Fields for Food, Drug Allergy, and Current Medication */}
            {[
              { label: 'Food', field: 'food' },
              { label: 'Drug Allergy', field: 'drugAllergy' },
              { label: 'Current Medication', field: 'currentMedication' },
            ].map(({ label, field }) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={label}
                  multiline
                  rows={3}
                  fullWidth
                  value={formData[field]}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                />
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

export default Investigation;
