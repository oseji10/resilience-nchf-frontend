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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';

const ContinueConsulting = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId'); // Retrieve patientId from the URL
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');
  
  const [formData, setFormData] = useState({
    chiefComplaintRight: '',
    chiefComplaintLeft: '',
    intraOccularPressureRight: '',
    intraOccularPressureLeft: '',
    otherComplaintsRight: '',
    otherComplaintsLeft: '',
    detailedHistoryRight: '',
    detailedHistoryLeft: '',
    findingsRight: '',
    findingsLeft: '',
    eyelidRight: '',
    eyelidLeft: '',
    conjunctivaRight: '',
    conjunctivaLeft: '',
    corneaRight: '',
    corneaLeft: '',
    ACRight: '',
    ACLeft: '',
    irisRight: '',
    irisLeft: '',
    pupilRight: '',
    pupilLeft: '',
    lensRight: '',
    lensLeft: '',
    vitreousRight: '',
    vitreousLeft: '',
    retinaRight: '',
    retinaLeft: '',
    otherFindingsRight: '',
    otherFindingsLeft: '',
  });

  const [chiefComplaintOptions, setChiefComplaintOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch chief complaints from the API
  useEffect(() => {
    const fetchChiefComplaints = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/chief_complaint`);
        setChiefComplaintOptions(response.data);
      } catch (error) {
        console.error('Error fetching chief complaints:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load chief complaints.',
        });
      }
    };

    fetchChiefComplaints();
  }, []);

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
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/continue_consulting`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push(`/dashboard/encounters/refraction?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`) // Redirect to another page upon success
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
         Page 2: Consulting
        </Typography>
        <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Chief Complaint Fields */}
            {['Right', 'Left'].map((side) => (
              <Grid item xs={12} sm={6} key={`chiefComplaint${side}`}>
                <FormControl fullWidth>
                  <InputLabel>Chief Complaint ({side})</InputLabel>
                  <Select
  value={formData[`chiefComplaint${side}`]}
  onChange={(e) => handleFormChange(`chiefComplaint${side}`, e.target.value)}
>
  {chiefComplaintOptions.map((option) => (
    <MenuItem value={option.id} key={option.id}>
      {option.name}
    </MenuItem>
  ))}
</Select>

                </FormControl>
              </Grid>
            ))}

            {/* Other Fields as Textarea */}
            {[
              'intraOccularPressure',
              'otherComplaints',
              'detailedHistory',
              'findings',
              'eyelid',
              'conjunctiva',
              'cornea',
              'AC',
              'iris',
              'pupil',
              'lens',
              'vitreous',
              'retina',
              'otherFindings',
            ].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <TextField
                    label={`${field} (${side})`}
                    multiline
                    rows={3}
                    fullWidth
                    value={formData[`${field}${side}`]}
                    onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                  />
                </Grid>
              ))
            )}
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

export default ContinueConsulting;
