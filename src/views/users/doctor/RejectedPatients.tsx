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

const DoctorRejectedPatientsTable = () => {
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
  const [isHistoryEdit, setIsHistoryEdit] = useState(false); // New state to track if history exists
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');

        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/rejected`, {
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
      `${patient?.user?.firstName} ${patient?.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient?.chfId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient?.cancer?.cancerName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);



  

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Rejected Patients 
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
                {/* <TableCell>CHF ID</TableCell> */}
                <TableCell>Patient Name</TableCell>
                {/* <TableCell>Diagnosis</TableCell> */}
                <TableCell>Phone Number</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                <TableRow key={patient?.patientId}>
                  {/* <TableCell>{patient?.chfId}</TableCell> */}
                  <TableCell>{patient?.user?.firstName} {patient?.user?.lastName}</TableCell>
                  {/* <TableCell>{patient?.cancer?.cancerName || 'N/A'}</TableCell> */}
                  <TableCell>{patient?.user?.phoneNumber || 'N/A'}</TableCell>
                  {/* <TableCell>
                    <IconButton onClick={() => handleOpenHistoryModal(patient)} color="info"><History /></IconButton>
                    <IconButton onClick={() => handleOpenAssignDoctorModal(patient)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDisapproveCarePlan(patient)} color="error"><Cancel /></IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DoctorRejectedPatientsTable;