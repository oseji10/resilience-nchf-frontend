'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

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
  MenuItem,
} from '@mui/material';
import { Delete, Edit, EditCalendar, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';



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


const PatientTransfers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [referrals, setReferrals] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('authToken');

        // Fetch roles, users, and hospitals in parallel
        const [referralResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/transfer`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          
        ]);

        
        setReferrals(referralResponse.data);

      } catch (error) {
        // Handle error
        setError('Failed to fetch data.');
        Swal.fire('Error', 'Failed to fetch data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchQuery)
    );
    
    setFilteredUsers(filtered);
  }, [users, searchQuery]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    
    setSearchQuery(query);
    
    const filtered = users.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedUsers = (filteredUsers || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNavigate = () => {
    if (selectedOption) {
      router.push(selectedOption);
    }
  };



  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Patient Transfers</h3>
        <div className="flex gap-2">
          <select
            value={selectedOption}
            onChange={handleSelectionChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Switch Category</option>
            <option value="/dashboard/users/doctor/transfers">Transfers</option>
            <option value="/dashboard/users/doctor/referrals">Referrals</option>
            
          </select>
          <Button variant='contained' color='primary' onClick={handleNavigate}>Go</Button>
        </div>
      {/* <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Create New Admin
      </Button> */}
      </div>

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
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Hospital Referred</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral?.referralId}>

                <TableCell>
                  {referral?.user?.firstName} {referral?.user?.lastName}
                </TableCell>
                <TableCell>{referral?.user?.email}</TableCell>
                <TableCell>{referral?.user?.phoneNumber}</TableCell>
                <TableCell>{referral?.transferred_hospital?.hospitalName ?? 'N/A'}</TableCell>
                <TableCell>{referral?.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(referral)} color="primary">
                    <Visibility />
                  </IconButton>
                  {/* <IconButton onClick={() => handleEdit(user)} color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user)} color="error">
                    <Delete />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

    </>
  );
};

export default PatientTransfers;
