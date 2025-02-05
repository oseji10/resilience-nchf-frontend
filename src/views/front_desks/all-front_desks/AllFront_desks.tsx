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




type Front_desk = {
  front_deskId: number;
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


const Front_desksTable = () => {
  const [front_desks, setFront_desks] = useState<Front_desk[]>([]);
  const [filteredFront_desks, setFilteredFront_desks] = useState<Front_desk[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedFront_desk, setSelectedFront_desk] = useState<Front_desk | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchFront_desks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/users/front_desks`);
        setFront_desks(response.data);
        setFilteredFront_desks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load front_desks data.');
        setLoading(false);
      }
    };

    fetchFront_desks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = front_desks.filter(
      (front_desk) =>
        `${front_desk.firstName} ${front_desk.lastName}`.toLowerCase().includes(query)
    );
    setFilteredFront_desks(filtered);
    setPage(0);
  };

  const handleView = (front_desk: Front_desk) => {
    setSelectedFront_desk(front_desk);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedFront_desks = filteredFront_desks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
      <h3>Front Desks</h3>
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
              <TableCell>Front Desk Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedFront_desks.map((front_desk) => (
              <TableRow key={front_desk.id}>
                
                <TableCell>
                  {front_desk?.firstName} {front_desk?.lastName}
                </TableCell>
                <TableCell>{front_desk?.email}</TableCell>
                <TableCell>{front_desk?.phoneNumber}</TableCell>
                <TableCell>{front_desk?.role?.roleName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(front_desk)} color="primary">
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
          count={filteredFront_desks.length}
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
      Front_desk Details
    </Typography>
    {selectedFront_desk && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedFront_desk?.firstName} ${selectedFront_desk?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedFront_desk?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedFront_desk?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Role:</strong> {selectedFront_desk.role?.roleName || 'N/A'}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


    </>
  );
};

export default Front_desksTable;
