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
  MenuItem,
} from '@mui/material';
import { Delete, Edit, EditCalendar, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


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


const OtherStaff = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [createLoading, setCreateLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    phoneNumber: '',
    email: '',
    role: ''
  });
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('authToken');

        // Fetch roles, users, and hospitals in parallel
        const [rolesResponse, usersResponse, hospitalsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/roles/nicrat`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/other-staff`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Set the fetched data
        setRoles(rolesResponse.data);
        setUsers(usersResponse.data);
        setHospitals(hospitalsResponse.data);

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


  const handleOpenModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setCreateLoading(true);
      const token = Cookies.get("authToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/other-staff`,
        newUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", `${response.data.message}`, "success");

      // setUsers((prevUsers) => [...prevUsers, response.data]); // Update local state
      setUsers((prevUsers) => [
        ...prevUsers,
        {
          id: response.data.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          otherNames: response.data.user.otherNames,
          phoneNumber: response.data.user.phoneNumber,
          email: response.data.user.email,
          role: response.data.user.role,
        },
      ]);

      // Clear the form fields
      setNewUser({
        firstName: "",
        lastName: "",
        otherNames: "",
        phoneNumber: "",
        email: "",
        role: "",
      });

      setOpenAddModal(false);
    } catch (error) {
      Swal.fire("Error", "Failed to create user.", "error");
    } finally {
      setCreateLoading(false);
    }
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
        <h3>Other NICRAT Staff</h3>
        <div className="flex gap-2">
          <select
            value={selectedOption}
            onChange={handleSelectionChange}
            className="border rounded px-2 py-1"
          >
            <option value="">Change User Category</option>
            <option value="/dashboard/users/hospital-admins">Hospital Admin</option>
            <option value="/dashboard/users/cmds">CMDs</option>
            <option value="/dashboard/users/other-staff">Other Staff</option>
          </select>
          <Button onClick={handleNavigate}>Go</Button>
        </div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Create New Staff
      </Button>
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
              {/* <TableCell>Hospital</TableCell> */}
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
                {/* <TableCell>{user?.hospital_admins?.hospital?.hospitalName ?? 'N/A'}</TableCell> */}
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

      <Modal
        open={openAddModal}
        onClose={handleCloseModal}
        aria-labelledby="add-user-modal"
        aria-describedby="add-user-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Create New Hospital Admin
          </Typography>
          <TextField
            label="First Name"
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Other Names"
            name="otherNames"
            value={newUser.otherNames}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={newUser.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          {/* <TextField
            select
            label="Hospital"
            name="hospital"
            value={newUser.hospital}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {hospitals.map((hospital) => (
              <MenuItem key={hospital.hospitalId} value={hospital.hospitalId}>
                {hospital.hospitalName}
              </MenuItem>
            ))}
          </TextField> */}


          <TextField
      select
      label="Role"
      name="role"
      value={newUser.role}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    >
      {roles.map((role) => (
        <MenuItem key={role.roleId} value={role.roleId}>
          {role.roleName}
        </MenuItem>
      ))}
    </TextField>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={createLoading}>
              {/* {createLoading ? <CircularProgress size={24} /> : "Create User"} */}
              {createLoading ? <CircularProgress size={24} color="inherit" /> : "Create Admin"}
            </Button>



          </Box>
        </Box>
      </Modal>



    </>
  );
};

export default OtherStaff;
