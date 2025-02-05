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




type Nurse = {
  nurseId: number;
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


const NursesTable = () => {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [filteredNurses, setFilteredNurses] = useState<Nurse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/users/nurses`);
        setNurses(response.data);
        setFilteredNurses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load nurses data.');
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = nurses.filter(
      (nurse) =>
        `${nurse.firstName} ${nurse.lastName}`.toLowerCase().includes(query)
    );
    setFilteredNurses(filtered);
    setPage(0);
  };

  const handleView = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedNurses = filteredNurses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <h3>Nurses</h3>
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
              <TableCell>Nurse Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedNurses.map((nurse) => (
              <TableRow key={nurse.id}>
                
                <TableCell>
                  {nurse?.firstName} {nurse?.lastName}
                </TableCell>
                <TableCell>{nurse?.email}</TableCell>
                <TableCell>{nurse?.phoneNumber}</TableCell>
                <TableCell>{nurse?.role?.roleName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(nurse)} color="primary">
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
          count={filteredNurses.length}
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
      Nurse Details
    </Typography>
    {selectedNurse && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedNurse?.firstName} ${selectedNurse?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedNurse?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedNurse?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {selectedNurse.role?.roleName || 'N/A'}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


    </>
  );
};

export default NursesTable;
