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

const Refraction = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');

  const [refractionAxis, setRefractionAxis] = useState<any[]>([]);
  const [refractionSphere, setRefractionSphere] = useState<any[]>([]);
  const [refractionCylinder, setRefractionCylinder] = useState<any[]>([]);
  const [refractionPrism, setRefractionPrism] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nearAddRight: '',
    nearAddLeft: '',
    OCTRight: '',
    OCTLeft: '',
    FFARight: '',
    FFALeft: '',
    fundusPhotographyRight: '',
    fundusPhotographyLeft: '',
    pachymetryRight: '',
    pachymetryLeft: '',
    CUFTRight: '',
    CUFTLeft: '',
    CUFTKineticRight: '',
    CUFTKineticLeft: '',
    pupilRight: '',
    pupilLeft: '',
    refractionSphereRight: '',
    refractionSphereLeft: '',
    refractionCylinderRight: '',
    refractionCylinderLeft: '',
    refractionAxisRight: '',
    refractionAxisLeft: '',
    refractionPrismRight: '',
    refractionPrismLeft: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [axisRes, sphereRes, cylinderRes, prismRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_axis`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_sphere`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_cylinder`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/refraction_prism`),
        ]);

        setRefractionAxis(axisRes.data || []);
        setRefractionSphere(sphereRes.data || []);
        setRefractionCylinder(cylinderRes.data || []);
        setRefractionPrism(prismRes.data || []);
      } catch (error) {
        console.error('Error fetching refraction data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load refraction data.',
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
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/refraction`, payload);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push(
        `/dashboard/encounters/diagnosis?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`
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
         Page 3: Refraction
        </Typography>
        <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Text Fields */}
            {[
              'nearAdd',
              'OCT',
              'FFA',
              'fundusPhotography',
              'pachymetry',
              'CUFT',
              'CUFTKinetic',
              'pupil',
            ].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <TextField
                    label={`${field} (${side})`}
                    fullWidth
                    value={formData[`${field}${side}`]}
                    onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                  />
                </Grid>
              ))
            )}

            {/* Dropdown Fields */}
            {['refractionSphere', 'refractionCylinder', 'refractionAxis', 'refractionPrism'].map((field) =>
              ['Right', 'Left'].map((side) => (
                <Grid item xs={12} sm={6} key={`${field}${side}`}>
                  <FormControl fullWidth>
                    <InputLabel>{`${field} (${side})`}</InputLabel>
                    <Select
                      value={formData[`${field}${side}`]}
                      onChange={(e) => handleFormChange(`${field}${side}`, e.target.value)}
                    >
                      {(field === 'refractionSphere'
                        ? refractionSphere
                        : field === 'refractionCylinder'
                        ? refractionCylinder
                        : field === 'refractionAxis'
                        ? refractionAxis
                        : refractionPrism
                      ).map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {/* {option.name} */}
                          <span dangerouslySetInnerHTML={{ __html: option.name }} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


   

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

export default Refraction;
