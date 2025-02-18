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
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const HospitalBillingsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  // const [assigning, setAssigning] = useState(false);
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});

  const [error, setError] = useState<string | null>(null);
  const [openAssignDoctorModal, setOpenAssignDoctorModal] = useState(false);
  const [doctors, setDoctors] = useState([]); // Store doctors
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/patients`, {
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
      (patient.cancer?.cancerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (patient.doctor ? `${patient.doctor.firstName} ${patient.doctor.lastName}`.toLowerCase() : '').includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  

  

  // const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});
  
  
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Hospital Patients
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
                <TableCell>Doctor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient?.chfId}</TableCell>
                  <TableCell>{patient?.patient.firstName} {patient.user.lastName}</TableCell>
                  <TableCell>{patient.cancer?.cancerName || 'N/A'}</TableCell>
                  <TableCell>{patient.doctor?.firstName} {patient.doctor?.lastName}</TableCell>
                  <TableCell>{patient.status?.status_details?.label || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton  color="primary">
                      <Visibility />
                    </IconButton>
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

      {/* Assign Doctor Modal */}
      <Dialog open={openAssignDoctorModal} onClose={handleCloseAssignDoctorModal}>
        <DialogTitle>Assign Doctor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Doctor</InputLabel>
            <Select
              value={selectedDoctor || ''}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDoctorModal}>Cancel</Button>
          {/* <Button onClick={handleDoctorAssign} color="primary" variant="contained">
            Assign
          </Button> */}
          {/* <Button variant="contained" color="primary" onClick={handleDoctorAssign} disabled={assigning}>
                        
                        {assigning ? <CircularProgress size={24} color="inherit" /> : "Assign"}
                      </Button> */}

                      <Button
  variant="contained"
  color="primary"
  onClick={handleDoctorAssign}
  disabled={assigning[selectedPatient?.patientId]}
>
  {assigning[selectedPatient?.patientId] ? <CircularProgress size={24} color="inherit" /> : "Assign"}
</Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HospitalBillingsTable;
