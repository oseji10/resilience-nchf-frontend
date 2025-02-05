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
import { Delete, Edit, EditCalendar, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Consulting = {
  consultingId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  visualAcuityFarPresentingLeft?: VisualAcuity | null;
  visualAcuityFarPresentingRight?: VisualAcuity | null;
  visualAcuityFarPinholeRight?: VisualAcuity | null;
  visualAcuityFarPinholeLeft?: VisualAcuity | null;
  visualAcuityFarBestCorrectedLeft?: VisualAcuity | null;
  visualAcuityFarBestCorrectedRight?: VisualAcuity | null;
  visualAcuityNearLeft?: VisualAcuity | null;
  visualAcuityNearRight?: VisualAcuity | null;
};

type ContinueConsulting = {
  intraOccularPressureRight: string | null;
  intraOccularPressureLeft: string | null;
  otherComplaintsRight: string | null;
  otherComplaintsLeft: string | null;
  detailedHistoryRight: string | null;
  detailedHistoryLeft: string | null;
  findingsRight: string | null;
  findingsLeft: string | null;
  eyelidRight: string | null;
  eyelidLeft: string | null;
  conjunctivaRight: string | null;
  conjunctivaLeft: string | null;
  corneaRight: string | null;
  corneaLeft: string | null;
  ACRight: string | null;
  ACLeft: string | null;
  irisRight: string | null;
  irisLeft: string | null;
  pupilRight: string | null;
  pupilLeft: string | null;
  lensRight: string | null;
  lensLeft: string | null;
  vitreousRight: string | null;
  vitreousLeft: string | null;
  retinaRight: string | null;
  retinaLeft: string | null;
  otherFindingsRight: string | null;
  otherFindingsLeft: string | null;
  chiefComplaintRight: VisualAcuity | null;
  chiefComplaintLeft: VisualAcuity | null;
  
};



// type User = {
//   id: number;
//   patientId: string;
//   hospitalFileNumber: string;
//   firstName: string;
//   lastName: string;
//   otherNames?: string | null;
//   gender: string;
//   bloodGroup: string;
//   occupation?: string | null;
//   dateOfBirth: string;
//   address?: string | null;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt?: string | null;
// };

type User = {
  userId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // patient: Patient;
  // consulting?: Consulting | null;
  // continueConsulting?: ContinueConsulting | null;
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


const EditProfile = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState(false);
const [editUser, setEditUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/users`);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users data.');
        setLoading(false);
      }
    };
  
    fetchUsers();
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

 
  const handleDelete = (user) => {
    setOpenViewModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Make API request to delete the appointment
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/appointments`);
        axios
          .delete(`${process.env.NEXT_PUBLIC_APP_URL}/user/${user.id}`)
          .then((response) => {
            Swal.fire('Deleted!', 'The User has been deleted.', 'success');
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire('Error!', 'Failed to delete the user.', 'error');
          });
      }
    });
  };




// Function to handle Edit button click
const handleEdit = (user: User) => {
  setEditUser(user);
  setOpenEditModal(true);
};

// Function to handle field changes in the modal
const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (editUser) {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  }
};

// Function to submit the edited data
const handleEditSubmit = async () => {
  if (editUser) {
    try {
      const payload = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phoneNumber: editUser.phoneNumber,
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/user/${editUser.id}`,
        payload // Send as an object
      );
      Swal.fire('Success', 'User details updated successfully.', 'success');
      setOpenEditModal(false);
      // Optionally, refresh the users list or update the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === editUser.userId ? { ...user, ...payload } : user
        )
      );
    } catch (err) {
      Swal.fire('Error', 'Failed to update user details.', 'error');
    }
  }
};



  return (
    <>
      <h3>Users</h3>
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
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user) => (
              <TableRow key={user?.id}>
                
                <TableCell>
                  {user?.firstName} {user?.lastName}
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.phoneNumber}</TableCell>
                <TableCell>{user?.role?.roleName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(user)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(user)} color="secondary">
    <Edit />
  </IconButton>
                  <IconButton onClick={() => handleDelete(user)} color="error">
                    <Delete />
                  </IconButton>
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

      {/* View Modal */}




    </>
  );
};

export default EditProfile;
