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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Cancel, Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Appointment = {
  appointmentId: number;
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


const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/appointments`);
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments data.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);



  const [doctors, setDoctors] = useState<{ doctorId: string; doctorName: string }[]>([])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`)
        const data = await response.json()
        setDoctors(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    fetchDoctors()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = appointments.filter(
      (appointment) =>
        `${appointment.patients.firstName} ${appointment.patients.lastName}`.toLowerCase().includes(query)
    );
    setFilteredAppointments(filtered);
    setPage(0);
  };

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment); // Store the full appointment object if needed for editing
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    // Handle save logic (e.g., API call to update the patient)
    setOpenEditModal(false);
  };

 

  const displayedAppointments = filteredAppointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // const handleUpdate =  (appointment) => {
  //   // e.preventDefault()
  //   // setLoading(true)

  //   try {
  //     await axios.put(
  //       `${process.env.NEXT_PUBLIC_APP_URL}/appointments/${appointmentId}`,
  //       formData,
  //       { headers: { 'Content-Type': 'application/json' } }
  //     )

  //     // Show success message
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Success',
  //       text: 'Appointment updated successfully!',
  //       timer: 3000,
  //       showConfirmButton: false
  //     })

  //     // onClose() // Close the modal
  //     router.push('/appointments') // Redirect after successful update
  //   } catch (error) {
  //     console.error('Error updating appointment:', error.response?.data || error.message)
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: error.response?.data?.message || 'An error occurred. Please try again.',
  //       timer: 3000,
  //       showConfirmButton: false
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedAppointment((prev) =>
        prev ? { ...prev, [name]: value } : null
    );
};


  const handleUpdate = async () => {
    if (selectedAppointment) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_APP_URL}/appointments/${selectedAppointment.appointmentId}`,
          selectedAppointment // Send updated appointment data
        );
        Swal.fire('Updated!', 'The appointment has been updated.', 'success');
        setOpenEditModal(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to update the appointment.', 'error');
      }
    }
  };
  



  const handleDelete = (appointment) => {
    setOpenViewModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Make API request to delete the appointment
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/appointments`);
        axios
          .delete(`${process.env.NEXT_PUBLIC_APP_URL}/appointments/${appointmentId}`)
          .then((response) => {
            Swal.fire('Deleted!', 'The appointment has been canceled.', 'success');
            // Optionally, refresh the table or update state here
          })
          .catch((error) => {
            Swal.fire('Error!', 'Failed to cancel the appointment.', 'error');
          });
      }
    });
  };


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
      <h3>Appointments</h3>
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
              <TableCell>Appointment Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Doctor To See</TableCell>
              {/* <TableCell>Role</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                
                <TableCell>
  {appointment?.appointmentDate &&
    new Date(`${appointment?.appointmentDate}T${appointment?.appointmentTime}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
</TableCell>

                <TableCell>
                  {appointment?.patients?.firstName} {appointment?.patients?.lastName}
                </TableCell>
                <TableCell>{appointment?.doctors.doctorName}</TableCell>
                {/* <TableCell>{appointment?.role?.roleName}</TableCell> */}
                <TableCell>
                  <IconButton onClick={() => handleView(appointment)} color="primary">
                    <Visibility />
                  </IconButton>

                  <IconButton onClick={() => handleEdit(appointment)}  color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment)} color="error">
        <Cancel />
      </IconButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredAppointments.length}
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
      Appointment Details
    </Typography>
    {selectedAppointment && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedAppointment?.patients?.firstName} ${selectedAppointment?.patients?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedAppointment?.patients?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedAppointment?.patients?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Doctor:</strong> {selectedAppointment.doctors?.doctorName || 'N/A'}
        </Typography>

        {/* <Typography variant="body1">
          <strong>Appointment Date:</strong> {selectedAppointment.appointmentDate || 'N/A'}
        </Typography> */}

        <Typography variant="body1">
          <strong>Appointment Date:</strong> {selectedAppointment?.appointmentDate &&
    new Date(`${selectedAppointment?.appointmentDate}T${selectedAppointment?.appointmentTime}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
        </Typography>
</>
       
    )}
  </Box>
</Modal>





<Modal open={openEditModal}  onClose={() => setOpenEditModal(false)}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit Appointment
        </Typography>
        <form onSubmit={handleUpdate}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
              name="appointmentDate"
                type="date"
                fullWidth
                label="Appointment Date"
                value={selectedAppointment?.appointmentDate || ''}
                // onChange={handleFormChange}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="appointmentTime"
                type="time"
                fullWidth
                label="Appointment Time"
                value={selectedAppointment?.appointmentTime || ''}
                // onChange={e => handleFormChange('appointmentTime', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="comment"
                fullWidth
                label="Comment"
                value={selectedAppointment?.comment || ''}
                // onChange={e => handleFormChange('comment', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
  <InputLabel>Doctor</InputLabel>
  <Select
  name="doctor" // Add name attribute
  value={selectedAppointment?.doctor || ''}
  onChange={handleFormChange}
>
  {doctors.map(doctor => (
    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
      {doctor.doctorName}
    </MenuItem>
  ))}
</Select>

</FormControl>

            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} className="mt-4">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Grid>
        </form>
      </Box>
    </Modal>
    </>
  );
};

export default AppointmentsTable;
