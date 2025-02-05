'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Bed, CalendarMonth, Delete, Edit, MoneyOutlined, ShoppingCart, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: string;
  bloodGroup: string;
  phoneNumber?: string;
  email?: string;
  hospitalFileNumber: string;
  hmoId: string;
  doctor: string;
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

const PatientsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hmos, setHmos] = useState<HMO[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0); // Initialize with 0 as the first page
  const [totalPages, setTotalPages] = useState(0); // Define totalPages state
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genderOptions = ['Male', 'Female', ];

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Get role from cookies
  const role = Cookies.get('role')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, hmosResponse] = await Promise.all([
          
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hmos`),
        ]);

        setDoctors(doctorsResponse.data);
        setHmos(hmosResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const fetchPatients = async (currentPage: number, query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/patients?page=${currentPage + 1}&limit=${rowsPerPage}&query=${query}`
      );
      const { data, total, current_page, last_page } = response.data;
      setPatients(data);
      setTotalPatients(total);
      setCurrentPage(current_page - 1);
      setTotalPages(last_page);
    } catch (err) {
      setError('Failed to load patients data.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPatients(page);
  }, [page, rowsPerPage]);  

  
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Clear the previous debounce timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Start a new debounce timer
    debounceTimer.current = setTimeout(() => {
      // Trigger the loader and fetch patients after debounce delay
      fetchPatients(0, query);
    }, 500); // Adjust debounce delay as needed (500ms in this case)
  
  

  // Client-side filtering (optional)
  const filtered = patients.filter((patient) => {
    const fullName = `${patient.firstName || ''} ${patient.lastName || ''} ${patient.otherNames || ''}`.toLowerCase();
    const phone = (patient.phoneNumber || '').toLowerCase();
    const email = (patient.email || '').toLowerCase();
    const patientId = String(patient.patientId || '').toLowerCase();
    const hospitalFileNumber = String(patient.hospitalFileNumber || '').toLowerCase();
    const firstName = (patient.firstName || '').toLowerCase();
    const otherNames = (patient.otherNames || '').toLowerCase();
    const lastName = (patient.lastName || '').toLowerCase();
    return (
      fullName.includes(query) ||
      phone.includes(query) ||
      email.includes(query) ||
      patientId.includes(query) ||
      firstName.includes(query) ||
      otherNames.includes(query) ||
      lastName.includes(query) ||
      hospitalFileNumber.includes(query)
    );
  });

  setFilteredPatients(filtered);
  setPage(0); // Reset to the first page after search
};


  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenViewModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenEditModal(true);
  };

  const handleEditSave = () => {
    // Handle save logic (e.g., API call to update the patient)
    setOpenEditModal(false);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
    setPage(newPage);
    fetchPatients(newPage, searchQuery);
  };

  
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchPatients(0, searchQuery);
  };

  const router = useRouter();
  const handleAppointment = (patient) => {
    const { patientId, firstName, lastName } = patient; 
    const patientName = firstName + ' ' + lastName; // Extract patientName correctly
    router.push(`/dashboard/appointments/create-appointment?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };
  
  const handleBilling = (patient) => {
    const { patientId, firstName, lastName } = patient; 
    const patientName = firstName + ' ' + lastName; // Extract patientName correctly
    router.push(`/dashboard/billings/create-billing?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
  };
  
  const handleEncounter = (patient) => {
    const { patientId, firstName, lastName } = patient; 
    const patientName = firstName + ' ' + lastName; // Extract patientName correctly
    router.push(`/dashboard/encounters/consulting?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`);
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

  // const displayedPatients = searchQuery
  //   ? filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //   : patients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const displayedPatients = patients;

    const handleInputChange = (field: keyof Patient, value: string) => {
      if (selectedPatient) {
        setSelectedPatient({
          ...selectedPatient,
          [field]: value,
        });
      }
    };


    const handleDelete = (patient) => {
      setOpenViewModal(false);
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this patient?',
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
            .delete(`${process.env.NEXT_PUBLIC_APP_URL}/patient/${patient.patientId}`)
            .then((response) => {
              Swal.fire('Deleted!', 'The patient has been deleted.', 'success');
              window.location.reload();
            })
            .catch((error) => {
              Swal.fire('Error!', 'Failed to delete the patient.', 'error');
            });
        }
      });
    };
    
  return (
    <>
      <TextField
        placeholder="Search by name, date of birth, Hospital ID, phone number, or email"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
        autoFocus="true"
      />

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.patientId}>
                <TableCell>{patient.patientId}</TableCell>
                <TableCell>
                  {patient.firstName} {patient.lastName} {patient.otherNames}
                </TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(patient)} color="primary">
                    <Visibility />
                  </IconButton>
                  {/* <IconButton onClick={() => handleEdit(patient)} color="warning">
                    <Edit />
                  </IconButton> */}

                  {/* {!['3', '8'].includes(role) && ( */}
                  {(role === '3' || role ==='8') && (
                    
  <IconButton onClick={() => handleEdit(patient)} color="warning">
    <Edit />
  </IconButton>
)}

                  {/* {!['2' || '3', '5', '8'].includes(role) && ( */}
                  {(role === '2' || role === '3' || role === '5' || role ==='8') && (
                       
  <IconButton onClick={() => handleEncounter(patient)} color="success">
    <Bed />
  </IconButton>
)}

                  
                  <IconButton onClick={() => handleAppointment(patient)} color="success">
                   <CalendarMonth />
                  </IconButton>

                  <IconButton color="info"  onClick={() => handleBilling(patient)}>
                    <ShoppingCart />
                  </IconButton>

                  <IconButton onClick={() => handleDelete(patient)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}  // Allow different row per page options
          component="div"
          count={totalPatients}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modals */}
      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={{ ...modalStyle, padding: '2rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            Patient Details
          </Typography>

          {selectedPatient && (
            <Box>
              {/* Patient Details */}
              <Typography variant="body1">
                Patient ID/Hospital File Number: {selectedPatient?.patientId}
              </Typography>
              <Typography variant="body1">
                Full Name: {`${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
              </Typography>
              <Typography variant="body1">
                Gender: {selectedPatient?.gender}
              </Typography>
              <Typography variant="body1">
                Blood Group: {selectedPatient?.bloodGroup}
              </Typography>
              <Typography variant="body1">
                HMO/Insurance: {selectedPatient?.hmo?.hmoName}
              </Typography>
              <Typography variant="body1">
                Doctor: {selectedPatient?.doctor?.doctorName}
              </Typography>
              <Typography variant="body1">
                Phone: {selectedPatient?.phoneNumber}
              </Typography>
              <Typography variant="body1">
                Email: {selectedPatient?.email}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Edit Modal */}
   {/* Edit Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
      Edit Patient
    </Typography>

    {selectedPatient && (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/patient/${selectedPatient.patientId}`,
              selectedPatient
            );
            console.log('Update successful:', response.data);
            setOpenEditModal(false);
            fetchPatients(page); // Refresh data
          } catch (error) {
            console.error('Error updating patient:', error);
          }
        }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="First Name"
          value={selectedPatient.firstName}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, firstName: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Last Name"
          value={selectedPatient.lastName}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, lastName: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Other Names"
          value={selectedPatient.otherNames || ''}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, otherNames: e.target.value })}
        />
        {/* <TextField
          fullWidth
          margin="normal"
          label="Gender"
          value={selectedPatient.gender}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, gender: e.target.value })}
        /> */}

<FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={selectedPatient.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  {genderOptions.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


       <FormControl fullWidth margin="normal">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={selectedPatient.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                >
                  {bloodGroupOptions.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          value={selectedPatient.phoneNumber || ''}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, phoneNumber: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={selectedPatient.email || ''}
          onChange={(e) => setSelectedPatient({ ...selectedPatient, email: e.target.value })}
        />



<FormControl fullWidth margin="normal">
                <InputLabel>HMO/Insurance</InputLabel>
                <Select
                  value={selectedPatient.hmoId}
                  onChange={(e) => handleInputChange('hmoId', e.target.value)}
                >
                  {hmos.map(hmo => (
                    <MenuItem key={hmo.hmoId} value={hmo.hmoId}>
                      {hmo.hmoName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            

              <FormControl fullWidth margin="normal">
                <InputLabel>Doctor</InputLabel>
                <Select
                  value={selectedPatient.doctor}
                  onChange={(e) => handleInputChange('doctor', e.target.value)}
                >
                  {doctors.map(doctor => (
                    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.doctorName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
         


        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </form>
    )}
  </Box>
</Modal>

    </>
  );
};

export default PatientsTable;
