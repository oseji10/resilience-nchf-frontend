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
} from '@mui/material';
import { Delete, DocumentScanner, Edit, FileCopy, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Input } from 'postcss';



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


const HospitalPatientsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openModal, setOpenModal] = useState(false);
const router = useRouter();

  const [formData, setFormData] = useState({
    patientName: "",
    patientDescription: "",
    patientType: "",
    patientCategory: "",
    patientQuantity: "",
    patientCost: "",
    patientPrice: "",
    patientStatus: "available",
    patientImage: "",
    patientManufacturer: "",
    uploadedBy: "",
  });

 

   // Open modal
   const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);


  // Handle form submission
  // const [loading, setLoading] = useState(true); // For fetching patients
const [submitLoading, setSubmitLoading] = useState(false); // For form submission
// const handleSubmit = async (event) => {
//   event.preventDefault();

//   if (submitLoading) return; // Prevent multiple clicks
//   setSubmitLoading(true);

//   try {
//     const token = Cookies.get("authToken");
//     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/patients`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.status === 201) {
//       const newPatient = await response.json(); 

//       setPatients((prevPatients) => [newPatient, ...prevPatients]);
//       setFilteredPatients((prevFiltered) => [newPatient, ...prevFiltered]);

//       setFormData({
//         patientName: "",
//         patientDescription: "",
//         patientType: "",
//         patientCategory: "",
//         patientQuantity: "",
//         patientCost: "",
//         patientPrice: "",
//         patientStatus: "available",
//         patientImage: "",
//         patientManufacturer: "",
//         uploadedBy: "",
//       });

//       // Close modal and stop loading BEFORE showing the alert
//       setOpenModal(false);
//       setSubmitLoading(false);

//       // Show success message
//       Swal.fire({
//         title: "Success!",
//         text: "Patient added successfully!",
//         icon: "success",
//         confirmButtonText: "Okay",
//       });

//     } else {
//       throw new Error("Failed to add patient.");
//     }
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     Swal.fire({
//       title: "Oops!",
//       text: "An error occurred while adding the patient.",
//       icon: "error",
//       confirmButtonText: "Okay",
//     });
//   } finally {
//     setSubmitLoading(false); // Ensure spinner stops in case of success or error
//   }
// };



  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/patients`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setPatients(response.data);
        setFilteredPatients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients data.');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = patients.filter(
      (patient) =>
        patient?.user?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        patient?.user?.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        patient?.chfId?.toLowerCase().includes(query.toLowerCase()) ||
        patient?.cancer.canceerName?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredPatients(filtered);
    setPage(0);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenViewModal(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenEditModal(true);
  };


  useEffect(() => {
    // Fetch doctors from the API when the modal opens
    if (open) {
      const fetchDoctors = async () => {
        try {
          const token = Cookies.get("authToken");
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors(response.data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };
      fetchDoctors();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      Swal.fire({ title: "Error!", text: "Please select a doctor.", icon: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("authToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/patient/doctor/assign`,
        {
          patientId: selectedPatient.patientId,
          doctorId: selectedDoctor,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        Swal.fire({ title: "Success!", text: "Doctor assigned successfully!", icon: "success" });
        onClose(); // Close the modal after success
      } else {
        Swal.fire({ title: "Error!", text: `Unexpected response: ${response.status}`, icon: "error" });
      }
    } catch (error) {
      console.error("Error assigning doctor:", error);
      Swal.fire({ title: "Oops!", text: "An error occurred.", icon: "error" });
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (patient) => {
    setOpenViewModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get("authToken");
          await axios.delete(
            `${process.env.NEXT_PUBLIC_APP_URL}/patients/${patient.patientId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          // Remove deleted patient from state
          setPatients((prevPatients) => prevPatients.filter((p) => p.patientId !== patient.patientId));
          setFilteredPatients((prevFilteredPatients) => prevFilteredPatients.filter((p) => p.patientId !== patient.patientId));
  
          Swal.fire("Deleted!", "The patient has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the patient.", "error");
        }
      }
    });
  };
  

  const [doctors, setDoctors] = useState([]);
  

  useEffect(() => {
    // Fetch doctors from the API when the modal opens
    if (open) {
      const fetchDoctors = async () => {
        try {
          const token = Cookies.get("authToken");
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctors(response.data);
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };
      fetchDoctors();
    }
  }, [open]);


  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  useEffect(() => {
    setUpdateLoading(false); // Reset update loading when modal opens
  }, [openEditModal]);
  
  const displayedPatients = filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
       <div>
      {/* Header with aligned button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Patients</h3>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          New Patient
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
              <TableCell>CHF ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Cancer Type</TableCell>
              <TableCell>Phone Number</TableCell>
              
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                
                <TableCell>{patient?.chfId}</TableCell>
                <TableCell>
                  {patient?.user?.firstName} {patient?.user?.lastName} 
                </TableCell>
                <TableCell>{patient?.cancer?.cancerName}</TableCell>
                <TableCell>{patient?.user?.phoneNumber}</TableCell>
                <TableCell>{patient?.status.status_details.label}</TableCell>
                {/* <TableCell></TableCell> */}
                
  


                <TableCell>
                  <IconButton onClick={() => handleView(patient)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(patient)} color="warning">
                    <Edit />
                  </IconButton>
                  {/* <IconButton onClick={() => handleDelete(patient)} color="error">
                    <FileCopy />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>


{/* Modal for New Patient */}
<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="dense"
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="patientDescription"
              value={formData.patientDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
           
            {/* <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select name="patientType" value={formData.patientType} onChange={handleInputChange} required>
                {patientType.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {formData.patientType === 'Medicine' && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select name="patientCategory" value={formData.patientCategory} onChange={handleInputChange} required>
                  {drugCategory.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} */}

           <FormControl fullWidth margin="dense">
            
            <TextField
              type="number"
              name="patientCost"
              label="Cost"
              value={formData.patientCost}
              onChange={handleInputChange}
              required
            />
          </FormControl>

            <DialogActions>
              <Button onClick={handleCloseModal} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
  {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
</Button>


            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>


      {/* View Modal */}
    
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    <Typography variant="h5" gutterBottom>
      Patient Details
    </Typography>
    {selectedPatient && (
      <>
        <Typography variant="body1">
          <strong>Patient Name:</strong> {`${selectedPatient?.patientName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {selectedPatient?.patientDescription}
        </Typography>
        <Typography variant="body1">
          <strong>Patient Type:</strong> {selectedPatient?.patientType}
        </Typography>
        <Typography variant="body1">
          <strong>Cost:</strong> ₦{selectedPatient?.patientCost ? new Intl.NumberFormat().format(selectedPatient.patientCost) : "N/A"}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


{/* Edit Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  {/* <Box sx={{ ...modalStyle }}> */}
  {/* <Modal open={open} onClose={onClose}> */}
      <Box sx={{ width: 400, padding: 3, backgroundColor: "white", margin: "auto", mt: 10, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Assign Doctor
        </Typography>

        {selectedPatient && (
          <form onSubmit={handleSubmit}>
            {/* <TextField
              select
              fullWidth
              margin="normal"
              label="Assign Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.firstName}
                </MenuItem>
              ))}
            </TextField> */}

<FormControl fullWidth>
  <InputLabel>Select Doctor</InputLabel>
  <Select
    value={selectedDoctor}
    onChange={(e) => setSelectedDoctor(e.target.value)}
  >
    {doctors.map((doctor) => (
      <MenuItem key={doctor.id} value={doctor.id}>
        {doctor.firstName} {doctor.lastName}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<br/><br/>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Assign"}
            </Button>
          </form>
        )}
      </Box>
    </Modal>

</div>
    </>
  );
};

export default HospitalPatientsTable;
