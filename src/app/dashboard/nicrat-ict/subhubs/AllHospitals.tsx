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
import { Add, Delete, Edit, PlusOne, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Input } from 'postcss';
import Link from '@/components/Link';
import { useSearchParams } from 'next/navigation';



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


const NICRATSubHubsTable = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [openModal, setOpenModal] = useState(false);
const router = useRouter();
const [states, setStates] = useState([]);


const [openAssignAdminModal, setOpenAssignAdminModal] = useState(false);
const [openAssignCMDModal, setOpenAssignCMDModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const searchParams = useSearchParams();
const hospitalId = searchParams.get('hospitalId');
const hospitalName = searchParams.get('hospital');


const [formData, setFormData] = useState({
  hospitalName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  stateId: "",
  hospitalShortName: "",
  hubHospitalId: hospitalId,
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


  // Handle form submission
  // const [loading, setLoading] = useState(true); // For fetching hospitals
const [submitLoading, setSubmitLoading] = useState(false); // For form submission

const handleSubmit = async (event) => {
  event.preventDefault();

  if (submitLoading) return; // Prevent multiple clicks
  setSubmitLoading(true);

  const token = Cookies.get("authToken");
  if (!token) {
    Swal.fire({
      title: "Unauthorized",
      text: "You must be logged in to perform this action.",
      icon: "error",
      confirmButtonText: "Okay",
    });
    setSubmitLoading(false);
    return;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals/hubs/subhubs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      const newHospital = await response.json();

      setHospitals((prevHospitals) => [
        {
          hospitalId: newHospital.hospitalId,
          hospitalName: newHospital.hospitalName,
          zone: newHospital.state?.zone?.zoneName || "N/A",
          state: newHospital.state?.stateNames || "N/A",
        },
        ...prevHospitals,
      ]);

      setFilteredHospitals((prevFiltered) => [newHospital, ...prevFiltered]);

      setFormData({
        hospitalName: "",
        hospitalShortName: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        stateId: "",
        hubHospitalId: "",
      });

      setOpenModal(false);

      Swal.fire({
        title: "Success!",
        text: "Hospital added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    } else {
      throw new Error("Failed to add hospital.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Oops!",
      text: "An error occurred while adding the hospital.",
      icon: "error",
      confirmButtonText: "Okay",
    });
  } finally {
    setSubmitLoading(false); // Ensures spinner stops in all cases
  }
};

// Fetch states from API
useEffect(() => {
  const fetchStates = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/states`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Update with your API endpoint
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  fetchStates();
}, []);


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals/hubs/subhubs?hospitalId=${hospitalId}`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setHospitals(response.data);
        setFilteredHospitals(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load hospitals data.');
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);


  

// Fetch states from API


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = hospitals.filter(
      (hospital) =>
        `${hospital.hospitalName}`.toLowerCase().includes(query)
    );
    setFilteredHospitals(filtered);
    setPage(0);
  };

  const handleView = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setOpenViewModal(true);
  };

  const handleEdit = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setOpenEditModal(true);
  };


  const handleDelete = async (hospital) => {
    setOpenViewModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this hospital?",
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
            `${process.env.NEXT_PUBLIC_APP_URL}/hospitals/${hospital.hospitalId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          // Remove deleted hospital from state
          setHospitals((prevHospitals) => prevHospitals.filter((p) => p.hospitalId !== hospital.hospitalId));

          // setHospitals((prevHospitals) => [
          //   ...prevHospitals,
          //   {
          //     hospitalId: response.data.hospitalId,
          //     hospitalName: response.data.hospitalName,
          //     zone: response.data.state.zone.zoneName,
          //     state: response.data.state.stateNames,
          //     // cmd: response.data.user.phoneNumber,
          //     // hospitalAdmin: response.data.user.email,
              
          //   },
          // ]);

          setFilteredHospitals((prevFilteredHospitals) => prevFilteredHospitals.filter((p) => p.hospitalId !== hospital.hospitalId));
  
          Swal.fire("Deleted!", "The hospital has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the hospital.", "error");
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
  


  

  const handleADDCloseModal = () => {
    setOpenModal(false);
  };

 
  const displayedHospitals = filteredHospitals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h3>SUBHUBS: {hospitalName}</h3>

  <div style={{ display: "flex", gap: "10px" }}>
    <Button onClick={() => router.push(`/dashboard/nicrat-ict/hospitals`)}>
      Back
    </Button>
    <Button variant="contained" color="primary" onClick={handleOpenModal}>
      New SubHub
    </Button>
  </div>
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
              <TableCell>Hospital Name</TableCell>
              {/* <TableCell>Zone</TableCell> */}
              {/* <TableCell>State</TableCell> */}
              <TableCell>Clusters</TableCell>
              {/* <TableCell>Wallet Balance</TableCell> */}
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedHospitals.map((hospital) => (
              <TableRow key={hospital.hospitalId}>
                
                <TableCell>
                  {hospital?.hospital?.hospitalName} 
                </TableCell>
                {/* <TableCell>{hospital?.state?.zone?.zoneName}</TableCell>
                <TableCell>{hospital?.state?.stateName}</TableCell> */}
                <TableCell>
 <Button onClick={() => router.push(`/dashboard/nicrat-ict/clusters?hospitalId=${hospital?.hospital?.hospitalId}&hospital=${hospital?.hospital?.hospitalName}`)}>
         Clusters
       </Button>
</TableCell>
                {/* <TableCell>{hospital?.wallet_balance ? `₦${hospital.wallet_balance}` : 'N/A'}</TableCell> */}

  


{/* 
                <TableCell>
                  <IconButton onClick={() => handleView(hospital)} color="primary">
                    <Visibility />
                  </IconButton>

                 

                  <IconButton onClick={() => handleEdit(hospital)} color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(hospital)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredHospitals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>


{/* Modal for New Hospital */}
<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Add New SubHub</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => handleSubmit(e, formData)}>
          <TextField
            fullWidth
            margin="dense"
            label="Hospital Name"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleInputChange}
            required
          />


<TextField
            fullWidth
            margin="dense"
            label="Hospital Short Name"
            name="hospitalShortName"
            value={formData.hospitalShortName}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="dense"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            
          />
          <TextField
            fullWidth
            margin="dense"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            
          />
          <TextField
            fullWidth
            margin="dense"
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>State</InputLabel>
            <Select name="stateId" value={formData.stateId} onChange={handleInputChange} required>
              {states.map((state) => (
                <MenuItem key={state.stateId} value={state.stateId}>
                  {state.stateName}
                </MenuItem>
              ))}
            </Select>
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
      Hospital Details
    </Typography>
    {selectedHospital && (
      <>
        <Typography variant="body1">
          <strong>Hospital Name:</strong> {`${selectedHospital?.hospitalName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {selectedHospital?.hospitalDescription}
        </Typography>
        <Typography variant="body1">
          <strong>Hospital Type:</strong> {selectedHospital?.hospitalType}
        </Typography>
        <Typography variant="body1">
          <strong>Cost:</strong> ₦{selectedHospital?.hospitalCost ? new Intl.NumberFormat().format(selectedHospital.hospitalCost) : "N/A"}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


{/* Edit Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
      Edit Hospital
    </Typography>

    {selectedHospital && (
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission

          if (updateLoading) return; // Prevent multiple clicks
          setUpdateLoading(true);

          try {
            const token = Cookies.get("authToken");

            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/hospitals/${selectedHospital.hospitalId}`,
              selectedHospital,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              const updatedHospital = response.data; // ✅ Use response.data with Axios

            // ✅ Ensure hospital list updates immediately
      setHospitals((prevHospitals) => {
        const updated = prevHospitals.map((hospital) =>
          hospital.hospitalId === updatedHospital.hospitalId ? updatedHospital : hospital
        );
        console.log('Updated Hospitals:', updated);
        return updated;
      });

      setFilteredHospitals((prevFiltered) => {
        const updated = prevFiltered.map((hospital) =>
          hospital.hospitalId === updatedHospital.hospitalId ? updatedHospital : hospital
        );
        console.log('Updated Filtered Hospitals:', updated);
        return updated;
      });

              // ✅ Close modal BEFORE showing success message
              setOpenEditModal(false);
              setUpdateLoading(false);

              Swal.fire({
                title: "Success!",
                text: "Hospital updated successfully!",
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
            console.error("Error updating hospital:", error);

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
          label="Hospital Name"
          value={selectedHospital.hospitalName}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              hospitalName: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={selectedHospital.hospitalDescription}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              hospitalDescription: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Hospital Type"
          value={selectedHospital?.hospitalType || ""}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              hospitalType: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Cost"
          value={selectedHospital?.hospitalCost || ""}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              hospitalCost: e.target.value,
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

export default NICRATSubHubsTable;
