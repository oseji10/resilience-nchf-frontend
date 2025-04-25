'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Box,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SESCalculator = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [openAssignDoctorModal, setOpenAssignDoctorModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [step, setStep] = useState(1);
  const [parent1Edu, setParent1Edu] = useState('');
  const [parent1Occ, setParent1Occ] = useState('');
  const [parent2Edu, setParent2Edu] = useState('');
  const [parent2Occ, setParent2Occ] = useState('');
  const [useSecondParent, setUseSecondParent] = useState(true);
  const [sesResult, setSesResult] = useState(null);
  const [appearance, setAppearance] = useState('');
  const [bmi, setBmi] = useState('');
  const [commentOnHome, setCommentOnHome] = useState('');
  const [commentOnEnvironment, setCommentOnEnvironment] = useState('');
  const [commentOnFamily, setCommentOnFamily] = useState('');
  const [generalComment, setGeneralComment] = useState('');
  const [approved, setApproved] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [educationOptions, setEducationOptions] = useState([]);
  const [occupationOptions, setOccupationOptions] = useState([]);

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/social-welfare/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
      setFilteredPatients(response.data);
      setPage(0); // Reset to first page
    } catch (err) {
      setError('Failed to refresh patient data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch SES options from two endpoints
  useEffect(() => {
    const fetchOptions = async () => {
      let qualificationError = null;
      let occupationError = null;

      try {
        const token = Cookies.get('authToken');

        // Fetch qualifications
        let educationResponse;
        try {
          educationResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/social-welfare/qualification`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error('Qualification fetch error:', err.response?.status, err.message);
          qualificationError = `Failed to load qualifications: ${err.message}`;
        }

        // Fetch occupations
        let occupationResponse;
        try {
          occupationResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/social-welfare/occupation`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error('Occupation fetch error:', err.response?.status, err.message);
          occupationError = `Failed to load occupations: ${err.message}`;
        }

        // Set error if both failed
        if (qualificationError && occupationError) {
          setOptionsError('Failed to load both qualification and occupation options.');
          return;
        }
        // Set error if only one failed
        if (qualificationError) {
          setOptionsError(qualificationError);
          return;
        }
        if (occupationError) {
          setOptionsError(occupationError);
          return;
        }

        // Map education options
        setEducationOptions(educationResponse.data.map((opt) => ({
          value: opt.qualificationId,
          label: opt.qualificationName,
          displayLabel: opt.qualificationName,
        })));

        // Map occupation options with sesScore
        const sesScoreMap = {
          1: 1, 2: 1, // sesScore: 1
          3: 2, 4: 2, // sesScore: 2
          5: 3, 6: 3, // sesScore: 3
          7: 4, 8: 4, // sesScore: 4
          9: 5, 10: 5, // sesScore: 5
          11: 6, 12: 6, // sesScore: 6
        };
        setOccupationOptions(occupationResponse.data.map((opt) => ({
          value: opt.occupationId.toString(),
          sesScore: sesScoreMap[opt.occupationId] || 6, // Default to 6 if not mapped
          label: opt.occupationName,
          displayLabel: opt.occupationName,
        })));
      } catch (err) {
        console.error('Unexpected error in fetchOptions:', err);
        setOptionsError('Unexpected error loading options. Please try again.');
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const filtered = patients.filter((patient) =>
      `${patient.user.firstName} ${patient.user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.chfId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.cancer?.cancerName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  const handleOpenAssignDoctorModal = (patient) => {
    setSelectedPatient(patient);
    setOpenAssignDoctorModal(true);
    setStep(1);
  };

  const handleCloseAssignDoctorModal = () => {
    setOpenAssignDoctorModal(false);
    setStep(1);
    setParent1Edu('');
    setParent1Occ('');
    setParent2Edu('');
    setParent2Occ('');
    setUseSecondParent(true);
    setSesResult(null);
    setAppearance('');
    setBmi('');
    setCommentOnHome('');
    setCommentOnEnvironment('');
    setCommentOnFamily('');
    setGeneralComment('');
    setApproved(false);
  };

  const calculateSES = () => {
    const scores = [];
    if (parent1Edu) scores.push(parseInt(parent1Edu));
    if (parent1Occ) {
      const occ = occupationOptions.find((opt) => opt.value === parent1Occ);
      if (occ) scores.push(occ.sesScore);
    }
    if (useSecondParent && parent2Edu) scores.push(parseInt(parent2Edu));
    if (useSecondParent && parent2Occ) {
      const occ = occupationOptions.find((opt) => opt.value === parent2Occ);
      if (occ) scores.push(occ.sesScore);
    }

    if (scores.length < 2) {
      return 'Please provide at least one parent\'s education and occupation.';
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const divisor = useSecondParent && scores.length === 4 ? 4 : 2;
    const finalScore = Math.round(sum / divisor);

    let sesClass = '';
    let subClass = '';
    if (finalScore <= 2) {
      sesClass = 'Upper';
      subClass = finalScore === 1 ? 'High' : 'Low';
    } else if (finalScore <= 4) {
      sesClass = 'Middle';
      subClass = finalScore === 3 ? 'High' : 'Low';
    } else {
      sesClass = 'Lower';
      subClass = finalScore === 5 ? 'High' : 'Low';
    }

    return `SES Classification: ${sesClass} (${subClass}) - Score: ${finalScore}`;
  };

  const handleNextStep = () => {
    const result = calculateSES();
    if (result.startsWith('Please provide')) {
      Swal.fire('Warning', result, 'warning');
      return;
    }
    setSesResult(result);
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleAssignCarePlan = async () => {
    if (!approved) {
      Swal.fire('Warning', 'You must confirm by clicking on the checkbox before submitting.', 'warning');
      return;
    }

    setAssigning(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/social-welfare/assessment`,
        {
          patientId: selectedPatient.patientId,
          appearance,
          bmi,
          commentOnHome,
          commentOnFamily,
          commentOnEnvironment,
          generalComment,
          parent1Edu,
          parent1Occ,
          parent2Edu: useSecondParent ? parent2Edu : null,
          parent2Occ: useSecondParent ? parent2Occ : null,
          useSecondParent,
          sesResult,
          status: 'approved',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire('Success!', 'Assessment recorded successfully!', 'success');
        handleCloseAssignDoctorModal();
        await fetchPatients(); // Refresh table
      } else {
        Swal.fire('Error!', `Unexpected response: ${response.status}`, 'error');
      }
    } catch (error) {
      Swal.fire('Oops!', 'An error occurred.', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleDisapproveCarePlan = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to disapprove this care plan. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disapprove it!',
      customClass: {
        popup: 'swal2-front',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setAssigning(true);
        try {
          const token = Cookies.get('authToken');
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/patient/social-welfare/assessment`,
            {
              patientId: selectedPatient.patientId,
              appearance,
              bmi,
              commentOnHome,
              commentOnFamily,
              commentOnEnvironment,
              generalComment,
              parent1Edu,
              parent1Occ,
              parent2Edu: useSecondParent ? parent2Edu : null,
              parent2Occ: useSecondParent ? parent2Occ : null,
              useSecondParent,
              sesResult,
              status: 'disapproved',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200 || response.status === 201) {
            Swal.fire('Success!', 'Care plan disapproved.', 'success');
            handleCloseAssignDoctorModal();
            await fetchPatients(); // Refresh table
          } else {
            Swal.fire('Error!', `Unexpected response: ${response.status}`, 'error');
          }
        } catch (error) {
          Swal.fire('Oops!', 'An error occurred.', 'error');
        } finally {
          setAssigning(false);
        }
      }
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Patients Pending Social Welfare Review
      </Typography>
      <TextField
        label="Search Patients"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      {loading || optionsLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : optionsError ? (
        <Typography color="error">{optionsError}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CHF ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.chfId}</TableCell>
                  <TableCell>{patient.user.firstName} {patient.user.lastName}</TableCell>
                  <TableCell>{patient.cancer?.cancerName || 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: '4px', backgroundColor: 'error.light', color: 'error.contrastText' }}>
                      PENDING REVIEW
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenAssignDoctorModal(patient)} color="primary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredPatients.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </TableContainer>
      )}

      {/* Assign Care Plan Modal */}
      <Dialog open={openAssignDoctorModal} onClose={handleCloseAssignDoctorModal}>
        <DialogTitle>{step === 1 ? 'Socio-Economic Status Assessment' : 'Other Information'}</DialogTitle>
        <DialogContent>
          {optionsError ? (
            <Typography color="error">{optionsError}</Typography>
          ) : step === 1 && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Parent/Caregiver 1
              </Typography>
              <FormControl fullWidth style={{ marginBottom: '10px' }} required>
                <InputLabel>Education</InputLabel>
                <Select
                  value={parent1Edu}
                  onChange={(e) => setParent1Edu(e.target.value)}
                  label="Education"
                >
                  <MenuItem value="">Select Education</MenuItem>
                  {educationOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.displayLabel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: '10px' }} required>
                <FormLabel component="legend">Occupation</FormLabel>
                <RadioGroup
                  value={parent1Occ}
                  onChange={(e) => setParent1Occ(e.target.value)}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      maxWidth: '300px',
                    },
                    '& .MuiFormControlLabel-root': {
                      marginBottom: '8px',
                    },
                  }}
                >
                  {occupationOptions.map((opt, index) => (
                    <FormControlLabel
                      key={index}
                      value={opt.value}
                      control={<Radio />}
                      label={opt.displayLabel}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useSecondParent}
                    onChange={() => setUseSecondParent(!useSecondParent)}
                  />
                }
                label="Include Second Parent/Caregiver"
                style={{ marginBottom: '10px' }}
              />
              {useSecondParent && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Parent/Caregiver 2
                  </Typography>
                  <FormControl fullWidth style={{ marginBottom: '10px' }} required>
                    <InputLabel>Education</InputLabel>
                    <Select
                      value={parent2Edu}
                      onChange={(e) => setParent2Edu(e.target.value)}
                      label="Education"
                    >
                      <MenuItem value="">Select Education</MenuItem>
                      {educationOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.displayLabel}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth style={{ marginBottom: '10px' }} required>
                    <FormLabel component="legend">Occupation</FormLabel>
                    <RadioGroup
                      value={parent2Occ}
                      onChange={(e) => setParent2Occ(e.target.value)}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          maxWidth: '300px',
                        },
                        '& .MuiFormControlLabel-root': {
                          marginBottom: '8px',
                        },
                      }}
                    >
                      {occupationOptions.map((opt, index) => (
                        <FormControlLabel
                          key={index}
                          value={opt.value}
                          control={<Radio />}
                          label={opt.displayLabel}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <TextField
                multiline
                rows={2}
                label="Appearance"
                fullWidth
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                type="number"
                label="BMI"
                fullWidth
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                multiline
                rows={2}
                label="Comment On Home"
                fullWidth
                value={commentOnHome}
                onChange={(e) => setCommentOnHome(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                multiline
                rows={2}
                label="Comment On Family"
                fullWidth
                value={commentOnFamily}
                onChange={(e) => setCommentOnFamily(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                multiline
                rows={2}
                label="Comment On Environment"
                fullWidth
                value={commentOnEnvironment}
                onChange={(e) => setCommentOnEnvironment(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <TextField
                multiline
                rows={2}
                label="General Comment"
                fullWidth
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <FormControlLabel
                control={<Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} />}
                label="By clicking on this checkbox I recommend this patient for funding."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDoctorModal}>Cancel</Button>
          {step === 1 && (
            <Button variant="contained" color="primary" onClick={handleNextStep} disabled={!!optionsError}>
              Next
            </Button>
          )}
          {step === 2 && (
            <>
              <Button onClick={handlePrevStep}>Back</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignCarePlan}
                disabled={assigning}
              >
                Submit
              </Button>
              {/* <Button
                variant="contained"
                color="error"
                onClick={handleDisapproveCarePlan}
                disabled={assigning}
              >
                Disapprove
              </Button> */}
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SESCalculator;