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
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Clinic_receptionist = {
  clinic_receptionistId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const Clinic_receptionistsTable = () => {
  const [clinic_receptionists, setClinic_receptionists] = useState<Clinic_receptionist[]>([]);
  const [filteredClinic_receptionists, setFilteredClinic_receptionists] = useState<Clinic_receptionist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedClinic_receptionist, setSelectedClinic_receptionist] = useState<Clinic_receptionist | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchClinic_receptionists = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/users/clinic_receptionists`);
        setClinic_receptionists(response.data);
        setFilteredClinic_receptionists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load clinic_receptionists data.');
        setLoading(false);
      }
    };

    fetchClinic_receptionists();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = clinic_receptionists.filter(
      (clinic_receptionist) =>
        `${clinic_receptionist.firstName} ${clinic_receptionist.lastName}`.toLowerCase().includes(query)
    );
    setFilteredClinic_receptionists(filtered);
    setPage(0);
  };

  const handleView = (clinic_receptionist: Clinic_receptionist) => {
    setSelectedClinic_receptionist(clinic_receptionist);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedClinic_receptionists = filteredClinic_receptionists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <h3>Clinic Receptionists</h3>
      <TextField
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clinic Receptionist Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedClinic_receptionists.map((clinic_receptionist) => (
              <TableRow key={clinic_receptionist.id}>
                
                <TableCell>
                  {clinic_receptionist?.firstName} {clinic_receptionist?.lastName}
                </TableCell>
                <TableCell>{clinic_receptionist?.email}</TableCell>
                <TableCell>{clinic_receptionist?.phoneNumber}</TableCell>
                <TableCell>{clinic_receptionist?.role?.roleName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(clinic_receptionist)} color="primary">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredClinic_receptionists.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Modal */}
    
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" gutterBottom>
      Clinic_receptionist Details
    </Typography>
    {selectedClinic_receptionist && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedClinic_receptionist?.firstName} ${selectedClinic_receptionist?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedClinic_receptionist?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedClinic_receptionist?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {selectedClinic_receptionist.role?.roleName || 'N/A'}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


    </>
  );
};

export default Clinic_receptionistsTable;
