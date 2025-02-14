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
import { AccountBalanceWallet, Add, Delete, Edit, PlusOne, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Input } from 'postcss';
import Link from '@/components/Link';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Hospital = {
  hospitalId: number;
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


const NICRATHospitalsTable = () => {
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

  const [openTopUpModal, setOpenTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

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
  
const [formData, setFormData] = useState({
  hospitalName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  stateId: "",
  hospitalShortName: "",
  // wallet_balance: ""
});



  const hospitalType = [
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


 




  const [poolBalance, setPoolBalance] = useState<number | null>(null); // State for pool balance


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`, {
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

    const fetchPoolBalance = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/pool/balance`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
        setPoolBalance(response.data.balance); // Assuming the balance is returned in the response body as `balance`
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    fetchHospitals();
    fetchPoolBalance(); // Fetch the pool balance on component mount
  }, []);



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
  

  const handleAssignAdminModal = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setOpenAssignAdminModal(true);
    fetchUsers(hospitalId);  // Fetch users when modal is opened
  };

  
  const handleAssignCMDModal = (hospitalId) => {
    setSelectedHospital(hospitalId);
    setOpenAssignCMDModal(true);
    fetchUsers(hospitalId);  // Fetch users when modal is opened
  };
  

  const handleADDCloseModal = () => {
    setOpenModal(false);
  };

  const fetchUsers = async (hospitalId) => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`/hospital_users/${hospitalId}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };


  const handleTopUpModalOpen = () => {
    setOpenTopUpModal(true);
  };

  const handleTopUpModalClose = () => {
    setOpenTopUpModal(false);
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount) {
      Swal.fire('Error', 'Please enter a valid amount', 'error');
      return;
    }

    setUpdateLoading(true);

    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/pool/credit`, 
        { amount: topUpAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setPoolBalance(response.data.newBalance); // Update the pool balance instantly
        Swal.fire('Success', 'Pool account credited successfully!', 'success');
        setOpenTopUpModal(false);
      } else {
        Swal.fire('Error', 'Failed to credit the pool account. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error crediting pool account:', error);
      Swal.fire('Error', 'An error occurred. Please try again.', 'error');
    } finally {
      setUpdateLoading(false);
    }
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
       {/* Header with pool balance and hospital list */}
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Hospitals Ewallet</h3>
        {poolBalance !== null ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">
              Pool Account Balance: ₦{new Intl.NumberFormat().format(poolBalance)}
            </Typography>
            <IconButton onClick={handleTopUpModalOpen} color="primary">
              <Add />
            </IconButton>
          </div>
        ) : (
          <CircularProgress size={24} />
        )}
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
              <TableCell>SN</TableCell>
              <TableCell>Hospital Name</TableCell>
              {/* <TableCell>State</TableCell> */}
              {/* <TableCell>Subhubs</TableCell> */}
              <TableCell>Wallet Balance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedHospitals.map((hospital, index) => (
              <TableRow key={hospital.id}>
                        <TableCell>{index + 1}</TableCell> 
                <TableCell>
                  {hospital?.hospitalName} 
                </TableCell>
                <TableCell>
  {hospital?.wallet_balance ? `₦${new Intl.NumberFormat().format(hospital.wallet_balance.balance)}` : "N/A"}
</TableCell>




                <TableCell>
                  <IconButton onClick={() => handleView(hospital)} color="primary">
                    <Visibility />
                  </IconButton>

                 

                  <IconButton onClick={() => handleEdit(hospital)} color="warning">
                    <AccountBalanceWallet />
                  </IconButton>
                  
                </TableCell>
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
          <strong>Wallet Balance:</strong> ₦{selectedHospital?.wallet_balance?.balance}
        </Typography>
        {/* <Typography variant="body1">
          <strong>Hospital Type:</strong> {selectedHospital?.hospitalType}
        </Typography>
        <Typography variant="body1">
          <strong>Cost:</strong> ₦{selectedHospital?.hospitalCost ? new Intl.NumberFormat().format(selectedHospital.hospitalCost) : "N/A"}
        </Typography> */}
</>
       
    )}
  </Box>
</Modal>


{/* Ewallet Topup Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
      Topup Hospital Ewallet
    </Typography>

    {selectedHospital && (
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission

          if (updateLoading) return; // Prevent multiple clicks
          setUpdateLoading(true);

          try {
            const token = Cookies.get("authToken");
            const formData = {amount: selectedHospital.amount, comments: selectedHospital.comments, hospitalId: selectedHospital.hospitalId}
            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/hospitals/${selectedHospital.hospitalId}/ewallet`,
              formData,
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
                text: "Hospital ewallet updated successfully!",
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
            console.error("Error updating hospital ewallet:", error);

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
        <h4>Hospital: {selectedHospital?.hospitalName}</h4>
        <h4>Current Balance: ₦{selectedHospital?.wallet_balance?.balance}</h4>
        <TextField
          fullWidth
          type='number'
          margin="normal"
          label="Topup Amount"
          value={selectedHospital?.amount || ""}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              amount: e.target.value,
            })
          }
        />


<TextField
          fullWidth
          multiline
          rows={2}
          margin="normal"
          label="Comments"
          value={selectedHospital?.comments || ""}
          onChange={(e) =>
            setSelectedHospital({
              ...selectedHospital,
              comments: e.target.value,
            })
          }
        />

        <Button type="submit" variant="contained" color="primary" disabled={updateLoading}>
          {updateLoading ? <CircularProgress size={24} color="inherit" /> : "Topup"}
        </Button>
      </form>
    )}
  </Box>
</Modal>

 {/* Pool Balance Top-Up Modal */}
 <Modal open={openTopUpModal} onClose={handleTopUpModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            Credit Pool Account
          </Typography>
          <form onSubmit={handleTopUpSubmit}>
            <TextField
              fullWidth
              label="Top-up Amount"
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" disabled={updateLoading}>
              {updateLoading ? <CircularProgress size={24} color="inherit" /> : 'Top-up'}
            </Button>
          </form>
        </Box>
      </Modal>


</div>
    </>
  );
};

export default NICRATHospitalsTable;
