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
  Modal,
  Box,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const SocialWelfarePendingPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAssignDoctorModal, setOpenAssignDoctorModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [carePlan, setCarePlan] = useState('');
  const [amountRecommended, setAmountRecommended] = useState('');
  const [approved, setApproved] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


const [appearance, setAppearance] = useState('');
    const [bmi, setBmi] = useState('');
    const [commentOnHome, setCommentOnHome] = useState('');
    const [commentOnEnvironment, setCommentOnEnvironment] = useState('');
    const [commentOnFamily, setCommentOnFamily] = useState('');
    const [generalComment, setGeneralComment] = useState('');


  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/social-welfare/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (err) {
        setError('Failed to load patients data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
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
  };

  const handleCloseAssignDoctorModal = () => {
    setOpenAssignDoctorModal(false);
    setCarePlan('');
    setAmountRecommended('');
    setApproved(false);
  };

  
  const handleAssignCarePlan = async () => {
    
    if (!approved) {
      setOpenAssignDoctorModal(false);

      Swal.fire('Warning', 'You must approve the care plan by ticking the checkbox before submitting.', 'warning');
      return;
    }

    setAssigning(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/mdt/assessment`,
        {
          patientId: selectedPatient.patientId,
          
              appearance,
              bmi,
              commentOnHome,
              commentOnFamily,
              commentOnEnvironment,
              generalComment,
          status: 'approved',
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire('Success!', 'Care plan assigned successfully!', 'success');
        handleCloseAssignDoctorModal();
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
    setOpenAssignDoctorModal(false);

    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to disapprove this care plan. This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, disapprove it!',
      customClass: {
        popup: 'swal2-front' // Apply a CSS class
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setAssigning(true);
        try {
          const token = Cookies.get('authToken');
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/patient/mdt/assessment`,
            {
              patientId: selectedPatient.patientId,
              appearance,
              bmi,
              commentOnHome,
              commentOnFamily,
              commentOnEnvironment,
              generalComment,
              status: 'disapproved',
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200 || response.status === 201) {
            Swal.fire('Success!', 'Care plan disapproved.', 'success');
            handleCloseAssignDoctorModal();
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
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
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
  <Box sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, backgroundColor: 'error.light', color: 'error.contrastText' }}>
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
              <DialogTitle>Assign Care Plan</DialogTitle>
              <DialogContent>
                <TextField multiline rows={2}  label="Appearance" fullWidth value={appearance} onChange={(e) => setAppearance(e.target.value)} style={{ marginBottom: '10px' }} />
                <TextField type='number' label="BMI" fullWidth value={bmi} onChange={(e) => setBmi(e.target.value)} style={{ marginBottom: '10px' }} />
                <TextField multiline rows={2}  label="Comment On Home" fullWidth value={commentOnHome} onChange={(e) => setCommentOnHome(e.target.value)} style={{ marginBottom: '10px' }} />
                <TextField multiline rows={2}  label="Comment On Family" fullWidth value={commentOnFamily} onChange={(e) => setCommentOnFamily(e.target.value)} style={{ marginBottom: '10px' }} />
                <TextField multiline rows={2} label="Comment On Environment" fullWidth value={commentOnEnvironment} onChange={(e) => setCommentOnEnvironment(e.target.value)} style={{ marginBottom: '10px' }} />
                <TextField multiline rows={2}  label="General Comment" fullWidth value={generalComment} onChange={(e) => setGeneralComment(e.target.value)} style={{ marginBottom: '10px' }} />
                <FormControlLabel control={<Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} />} label="By clicking on this checkbox I recommend this patient for funding." />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAssignDoctorModal}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleAssignCarePlan} disabled={assigning}>Approve</Button>
                <Button variant="contained" color="error" onClick={handleDisapproveCarePlan} disabled={assigning}>Disapprove</Button>
              </DialogActions>
            </Dialog>
      
      
    </Box>
  );
};

export default SocialWelfarePendingPatientsTable;
