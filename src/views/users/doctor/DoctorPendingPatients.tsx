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
  Grid,
} from '@mui/material';
import { Edit, Visibility, History, Cancel } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const DoctorPendingPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAssignDoctorModal, setOpenAssignDoctorModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [carePlan, setCarePlan] = useState('');
  const [cancerStage, setCancerStage] = useState('');
  const [amountRecommended, setAmountRecommended] = useState('');
  const [approved, setApproved] = useState(false);
  const [patientHistory, setPatientHistory] = useState('');
  const [isHistoryEdit, setIsHistoryEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const cancerStages = [
    'Stage 0 - Carcinoma in Situ',
    'Stage 1 - Early Stage',
    'Stage 2 - Localized',
    'Stage 3 - Regional Spread',
    'Stage 4 - Metastatic',
  ];

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/doctor/pending`, {
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

  useEffect(() => {
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

  const handleOpenHistoryModal = async (patient) => {
    setSelectedPatient(patient);
    setPatientHistory('');
    setIsHistoryEdit(false);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient-medical-history/${patient.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.history) {
        setPatientHistory(response.data.history);
        setIsHistoryEdit(true);
      }
    } catch (error) {
      setPatientHistory('');
      setIsHistoryEdit(false);
    }
    setOpenHistoryModal(true);
  };

  const handleCloseAssignDoctorModal = () => {
    setOpenAssignDoctorModal(false);
    setCarePlan('');
    setAmountRecommended('');
    setCancerStage('');
    setApproved(false);
  };

  const handleCloseHistoryModal = () => {
    setOpenHistoryModal(false);
    setPatientHistory('');
    setIsHistoryEdit(false);
  };

  const handleAssignCarePlan = async () => {
    if (!approved) {
      setOpenAssignDoctorModal(false);
      Swal.fire({
        title: 'Warning',
        text: 'You must approve the care plan by ticking the checkbox before submitting.',
        icon: 'warning',
        zIndex: 9999,
      });
      return;
    }

    setAssigning(true);
    
    try {
      const token = Cookies.get('authToken');
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/doctor/careplan`,
        {
          patientId: selectedPatient.patientId,
          carePlan,
          amountRecommended,
          status: 'approved',
          cancerStage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Success!',
          text: 'Care plan assigned successfully!',
          icon: 'success',
          zIndex: 9999,
        });
        handleCloseAssignDoctorModal();
        await fetchPatients(); // Reload the table
      } else {
        Swal.fire({
          title: 'Error!',
          text: `Unexpected response: ${response.status}`,
          icon: 'error',
          zIndex: 9999,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'An error occurred.',
        icon: 'error',
        zIndex: 9999,
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleDisapproveCarePlan = async (patient) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to remove this patient. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove them!',
      zIndex: 9999,
      input: 'textarea',
      inputLabel: 'Reason for Removal',
      inputPlaceholder: 'Please provide the reason for removing this patient...',
      inputAttributes: {
        'aria-label': 'Reason for disapproval',
        style: 'resize: vertical; min-height: 100px;',
      },
      preConfirm: (reason) => {
        if (!reason) {
          Swal.showValidationMessage('Reason for removing is required');
          return false;
        }
        return reason;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get('authToken');
          
          await axios.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/patient/rejected`,
            {
              patientUserId: patient.userId,
              hospitalId: patient.hospital,
              status: 'disapproved',
              reason: result.value,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire({
            title: 'Success!',
            text: 'Patient disapproved.',
            icon: 'success',
            zIndex: 9999,
          });
          await fetchPatients();
        } catch (error) {
          Swal.fire({
            title: 'Oops!',
            text: 'An error occurred.',
            icon: 'error',
            zIndex: 9999,
          });
        }
      }
    });
  };

  const handleSubmitHistory = async () => {
    try {
      const token = Cookies.get('authToken');
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient-medical-history`,
        {
          patientUserId: selectedPatient.userId,
          hospitalId: selectedPatient.hospital,
          history: patientHistory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: 'Success!',
        text: 'Patient history updated successfully!',
        icon: 'success',
        zIndex: 9999,
      });
      handleCloseHistoryModal();
    } catch (error) {
      Swal.fire({
        title: 'Oops!',
        text: 'An error occurred while saving history.',
        icon: 'error',
        zIndex: 9999,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Patients Pending Review
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
                <TableCell>Phone Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.chfId}</TableCell>
                  <TableCell>{patient.user.firstName} {patient.user.lastName}</TableCell>
                  <TableCell>{patient.cancer?.cancerName || 'N/A'}</TableCell>
                  <TableCell>{patient.user?.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenHistoryModal(patient)} color="info"><History /></IconButton>
                    <IconButton onClick={() => handleOpenAssignDoctorModal(patient)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDisapproveCarePlan(patient)} color="error"><Cancel /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog fullWidth maxWidth="md" open={openHistoryModal} onClose={handleCloseHistoryModal}>
        <DialogTitle>Patient History</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              multiline
              rows={4}
              value={patientHistory}
              onChange={(e) => setPatientHistory(e.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryModal}>Cancel</Button>
          <Button onClick={handleSubmitHistory} variant="contained" color="primary">
            {isHistoryEdit ? 'Modify' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="md" open={openAssignDoctorModal} onClose={handleCloseAssignDoctorModal}>
        <DialogTitle>Design A Care Plan</DialogTitle>
        <DialogContent>
          <TextField
            label="Care Plan"
            fullWidth
            multiline
            rows={4}
            value={carePlan}
            onChange={(e) => setCarePlan(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Amount Recommended"
            fullWidth
            type="number"
            value={amountRecommended}
            onChange={(e) => setAmountRecommended(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Grid item xs={12} mt={4}>
            <FormControl fullWidth>
              <InputLabel>Stages of Cancer</InputLabel>
              <Select value={cancerStage} onChange={(e) => setCancerStage(e.target.value)}>
                <MenuItem value="Stage 0">Stage 0 - Carcinoma in Situ</MenuItem>
                <MenuItem value="Stage 1">Stage 1 - Early Stage</MenuItem>
                <MenuItem value="Stage 2">Stage 2 - Localized</MenuItem>
                <MenuItem value="Stage 3">Stage 3 - Regional Spread</MenuItem>
                <MenuItem value="Stage 4">Stage 4 - Metastatic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <FormControlLabel
            control={<Checkbox checked={approved} onChange={(e) => setApproved(e.target.checked)} />}
            label="By clicking on this checkbox I affirm the authenticity of the information provided."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDoctorModal}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAssignCarePlan}>Submit Careplan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorPendingPatientsTable;