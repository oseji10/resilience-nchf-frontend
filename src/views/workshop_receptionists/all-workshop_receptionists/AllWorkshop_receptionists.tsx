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




type Workshop_receptionist = {
  workshop_receptionistId: number;
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


const Workshop_receptionistsTable = () => {
  const [workshop_receptionists, setWorkshop_receptionists] = useState<Workshop_receptionist[]>([]);
  const [filteredWorkshop_receptionists, setFilteredWorkshop_receptionists] = useState<Workshop_receptionist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedWorkshop_receptionist, setSelectedWorkshop_receptionist] = useState<Workshop_receptionist | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchWorkshop_receptionists = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/users/workshop_receptionists`);
        setWorkshop_receptionists(response.data);
        setFilteredWorkshop_receptionists(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load workshop_receptionists data.');
        setLoading(false);
      }
    };

    fetchWorkshop_receptionists();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = workshop_receptionists.filter(
      (workshop_receptionist) =>
        `${workshop_receptionist.firstName} ${workshop_receptionist.lastName}`.toLowerCase().includes(query)
    );
    setFilteredWorkshop_receptionists(filtered);
    setPage(0);
  };

  const handleView = (workshop_receptionist: Workshop_receptionist) => {
    setSelectedWorkshop_receptionist(workshop_receptionist);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedWorkshop_receptionists = filteredWorkshop_receptionists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <h3>Workshop Receptionists</h3>
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
              <TableCell>Workshop Receptionist Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedWorkshop_receptionists.map((workshop_receptionist) => (
              <TableRow key={workshop_receptionist.id}>
                
                <TableCell>
                  {workshop_receptionist?.firstName} {workshop_receptionist?.lastName}
                </TableCell>
                <TableCell>{workshop_receptionist?.email}</TableCell>
                <TableCell>{workshop_receptionist?.phoneNumber}</TableCell>
                <TableCell>{workshop_receptionist?.role?.roleName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(workshop_receptionist)} color="primary">
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
          count={filteredWorkshop_receptionists.length}
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
      Workshop_receptionist Details
    </Typography>
    {selectedWorkshop_receptionist && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedWorkshop_receptionist?.firstName} ${selectedWorkshop_receptionist?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedWorkshop_receptionist?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedWorkshop_receptionist?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {selectedWorkshop_receptionist.role?.roleName || 'N/A'}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


    </>
  );
};

export default Workshop_receptionistsTable;
