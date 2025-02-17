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
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Input } from 'postcss';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Patient = {
  patientId: number;
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


const PatientsTable = () => {
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

  const patientType = [
    'Proceedure',
    'Investigation',
    'Diagnosis',
    'Surgery',
  ];

  const drugCategory = [
    'Eye Drop',
    'Ointment',
    'Tablet',
    'Injection',
  ];

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


  // Handle form submission
  // const [loading, setLoading] = useState(true); // For fetching patients
const [submitLoading, setSubmitLoading] = useState(false); // For form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  if (submitLoading) return; // Prevent multiple clicks
  setSubmitLoading(true);

  try {
    const token = Cookies.get("authToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      const newPatient = await response.json(); 

      setPatients((prevPatients) => [newPatient, ...prevPatients]);
      setFilteredPatients((prevFiltered) => [newPatient, ...prevFiltered]);

      setFormData({
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

      // Close modal and stop loading BEFORE showing the alert
      setOpenModal(false);
      setSubmitLoading(false);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Patient added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

    } else {
      throw new Error("Failed to add patient.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Oops!",
      text: "An error occurred while adding the patient.",
      icon: "error",
      confirmButtonText: "Okay",
    });
  } finally {
    setSubmitLoading(false); // Ensure spinner stops in case of success or error
  }
};



  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patients`, {
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
        `${patient.patientName}`.toLowerCase().includes(query)
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
        {/* <Button variant="contained" color="primary" onClick={handleOpenModal}>
          New Patient
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
              <TableCell>Patient Name</TableCell>
              <TableCell>Hospital</TableCell>
              <TableCell>State of Origin</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPatients.map((patient) => (
              <TableRow key={patient.id}>
                
                <TableCell>
                  {patient?.user?.firstName} {patient?.user?.lastName} 
                </TableCell>
                <TableCell>{patient?.hospital?.hospitalShortName}</TableCell>
                <TableCell>{patient?.state_of_origin?.stateName}</TableCell>
                <TableCell>{patient?.user?.phoneNumber}</TableCell>
                <TableCell>{patient?.doctor?.firstName} {patient?.user?.lastName}</TableCell>
                
  


                <TableCell>
                  <IconButton onClick={() => handleView(patient)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(patient)} color="warning">
                    <Edit />
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
           
            <FormControl fullWidth margin="dense">
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
            )}

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
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
      Edit Patient
    </Typography>

    {selectedPatient && (
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission

          if (updateLoading) return; // Prevent multiple clicks
          setUpdateLoading(true);

          try {
            const token = Cookies.get("authToken");

            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/patients/${selectedPatient.patientId}`,
              selectedPatient,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              const updatedPatient = response.data; // ✅ Use response.data with Axios

            // ✅ Ensure patient list updates immediately
      setPatients((prevPatients) => {
        const updated = prevPatients.map((patient) =>
          patient.patientId === updatedPatient.patientId ? updatedPatient : patient
        );
        console.log('Updated Patients:', updated);
        return updated;
      });

      setFilteredPatients((prevFiltered) => {
        const updated = prevFiltered.map((patient) =>
          patient.patientId === updatedPatient.patientId ? updatedPatient : patient
        );
        console.log('Updated Filtered Patients:', updated);
        return updated;
      });

              // ✅ Close modal BEFORE showing success message
              setOpenEditModal(false);
              setUpdateLoading(false);

              Swal.fire({
                title: "Success!",
                text: "Patient updated successfully!",
                icon: "success",
                confirmButtonText: "Okay",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: `Unexpected response: ${response.status}`,
                icon: "error",
                confirmButtonText: "Try Again",
              });
            }
          } catch (error) {
            console.error("Error updating patient:", error);

            Swal.fire({
              title: "Oops!",
              text: error.response?.data?.message || "An error occurred.",
              icon: "error",
              confirmButtonText: "Okay",
            });
          } finally {
            setUpdateLoading(false); 
          }
        }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="Patient Name"
          value={selectedPatient.patientName}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              patientName: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={selectedPatient.patientDescription}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              patientDescription: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Patient Type"
          value={selectedPatient?.patientType || ""}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              patientType: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Cost"
          value={selectedPatient?.patientCost || ""}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              patientCost: e.target.value,
            })
          }
        />

        <Button type="submit" variant="contained" color="primary" disabled={updateLoading}>
          {updateLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
        </Button>
      </form>
    )}
  </Box>
</Modal>

</div>
    </>
  );
};

export default PatientsTable;
