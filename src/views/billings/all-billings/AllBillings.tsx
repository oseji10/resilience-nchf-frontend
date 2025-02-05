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
import { Cancel, ChangeCircleOutlined, ChangeHistoryOutlined, CheckCircle, Delete, Edit, Payment, Payments, StartOutlined, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};




type Billing = {
  billingId: number;
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


const BillingsTable = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [filteredBillings, setFilteredBillings] = useState<Billing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
const router = useRouter();

const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: "",
    paymentReference: "",
  });


    // Open modal when Payments icon is clicked
    const handlePaymentsClick = (billing) => {
      setSelectedBilling(billing);  // Set the correct billing information
      setOpen(true);  // Open the modal
    };
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    // Handle form submission
    const [isUpdating, setIsUpdating] = useState(false); // State for spinner

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsUpdating(true); // Show spinner on button

  try {
    const token = Cookies.get('authToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/confirm-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        transactionId: selectedBilling.transactionId,
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference,
      }),
    });

    if (response.ok) {
      setOpen(false); // Close the modal
      Swal.fire({
        icon: 'success',
        title: 'Payment confirmed successfully!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        // setOpen(false); // Close the modal after the alert
      });

      // Refresh the table by fetching updated billings
      const updatedBillings = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBillings(updatedBillings.data);
      setFilteredBillings(updatedBillings.data);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to confirm payment!',
        text: 'There was an issue confirming the payment.',
      });
    }
  } catch (error) {
    console.error("Error submitting payment:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'An error occurred while processing the payment.',
    });
  } finally {
    setIsUpdating(false); // Hide spinner
  }
};


    

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
          
        );
        setBillings(response.data);
        setFilteredBillings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billings data.');
        setLoading(false);
      }
    };

    fetchBillings();
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
    const filtered = billings.filter(
      (billing) =>
        `${billing.patient.firstName} ${billing.patient.lastName}`.toLowerCase().includes(query)
    );
    setFilteredBillings(filtered);
    setPage(0);
  };

  const handleView = (billing: Billing) => {
    setSelectedBilling(billing);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


 

 

  const displayedBillings = filteredBillings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedBilling((prev) =>
        prev ? { ...prev, [name]: value } : null
    );
};


  const handleUpdate = async () => {
    if (selectedBilling) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_APP_URL}/billings/${selectedBilling.billingId}`,
          selectedBilling // Send updated billing data
        );
        Swal.fire('Updated!', 'The billing has been updated.', 'success');
        setOpenEditModal(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to update the billing.', 'error');
      }
    }
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
      <h3>Billings</h3>
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
              <TableCell>Billing Date</TableCell>
              <TableCell>TRX ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBillings.map((billing) => (
              <TableRow key={billing.id}>
                
                <TableCell>
  {billing?.created_at &&
    new Date(`${billing?.created_at}`).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })}
</TableCell>
<TableCell>{billing?.transactionId}</TableCell>

                <TableCell>
                  {billing?.patient?.firstName} {billing?.patient?.lastName}
                </TableCell>
                <TableCell>₦{billing?.total_cost ? new Intl.NumberFormat().format(billing.total_cost) : "N/A"}</TableCell>
                <TableCell>{billing?.paymentMethod}</TableCell>
                <TableCell>
  <span
    style={{
      backgroundColor: billing?.paymentStatus === "pending" ? "#FFC107" : "#4CAF50",
      color: "white",
      fontWeight: "bold",
      padding: "4px 8px",
      borderRadius: "4px",
    }}
  >
    {billing?.paymentStatus === "pending" ? "PENDING" : "PAID"}
  </span>
</TableCell>

                <TableCell>
                  <IconButton onClick={() => handleView(billing)} color="primary">
                    <Visibility />
                  </IconButton>

                  
                  <IconButton
  onClick={() => billing?.paymentStatus === "pending" && handlePaymentsClick(billing)}  // Only trigger the handler for 'pending' status
  color={billing?.paymentStatus === "pending" ? "warning" : "success"}
>
  {billing?.paymentStatus === "pending" ? (
    <Payments />
  ) : (
    <CheckCircle />
  )}
</IconButton>






                  {/* <IconButton onClick={() => handleDelete(billing)} color="error">
        <Cancel />
      </IconButton> */}

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBillings.length}
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
      Billing Details
    </Typography>
    {selectedBilling && (
      <>
        <Typography variant="body1">
          <strong>Full Name:</strong> {`${selectedBilling?.patient?.firstName} ${selectedBilling?.patient?.lastName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {selectedBilling?.patient?.email}
        </Typography>
        <Typography variant="body1">
          <strong>Phone Number:</strong> {selectedBilling?.patient?.phoneNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Doctor:</strong> {selectedBilling?.patient?.doctor?.doctorName || 'N/A'}
        </Typography>

        <Typography variant="body1">
          <strong>Billing Date:</strong> {selectedBilling?.created_at &&
            new Date(`${selectedBilling?.created_at}`).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
        </Typography>

       {/* Item List Table */}
<Typography variant="h6" gutterBottom>
  Items
</Typography>
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Item Name</TableCell>
      <TableCell>Quantity</TableCell>
      <TableCell>Price</TableCell>
      <TableCell>Total</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {selectedBilling?.relatedTransactions?.map((transaction, index) => (
      <React.Fragment key={index}>
        <TableRow>
          {/* Display item name, for example categoryType or billingType */}
          <TableCell>{transaction.categoryType || transaction.billingType}</TableCell>
          <TableCell>{transaction.quantity}</TableCell>
          <TableCell>₦{transaction.cost ? new Intl.NumberFormat().format(transaction.cost) : "N/A"}</TableCell>
          <TableCell>₦{transaction.cost && transaction.quantity ? new Intl.NumberFormat().format(transaction.cost * transaction.quantity) : "N/A"}</TableCell>
        </TableRow>
      </React.Fragment>
    ))}
  </TableBody>
</Table>

      </>
    )}
  </Box>
</Modal>





<Modal open={openEditModal}  onClose={() => setOpenEditModal(false)}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit Billing
        </Typography>
        <form onSubmit={handleUpdate}>
          <Grid container spacing={4}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
              name="billingDate"
                type="date"
                fullWidth
                label="Billing Date"
                value={selectedBilling?.billingDate || ''}
                // onChange={handleFormChange}
                onChange={handleFormChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="billingTime"
                type="time"
                fullWidth
                label="Billing Time"
                value={selectedBilling?.billingTime || ''}
                // onChange={e => handleFormChange('billingTime', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
              name="comment"
                fullWidth
                label="Comment"
                value={selectedBilling?.comment || ''}
                // onChange={e => handleFormChange('comment', e.target.value)}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
  <InputLabel>Doctor</InputLabel>
  <Select
  name="doctor" // Add name attribute
  value={selectedBilling?.doctor || ''}
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


    <Modal open={open} onClose={() => setOpen(false)}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography variant="h5" gutterBottom>
      Confirm Payment
    </Typography>
    <form onSubmit={handleSubmit}>
      {/* Payment Method Dropdown */}
      <InputLabel id="payment-method-label">Payment Method</InputLabel>
      <Select
        labelId="payment-method-label"
          label="Payment Method"
        fullWidth
        value={formData.paymentMethod}
        onChange={handleChange}
        name="paymentMethod"
        required
        margin="normal"
      >
        <MenuItem value="cash">Cash</MenuItem>
        <MenuItem value="POS">POS</MenuItem>
        <MenuItem value="transfer">Transfer</MenuItem>
      </Select>

      {/* Payment Reference */}
      <TextField
        label="Payment Reference"
        fullWidth
        margin="normal"
        value={formData.paymentReference}
        onChange={handleChange}
        name="paymentReference"
        
      />

      {/* Submit Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
      <Button
  variant="contained"
  color="primary"
  onClick={handleSubmit}
  disabled={isUpdating}
  startIcon={isUpdating ? <CircularProgress size={20} /> : null}
>
  {isUpdating ? "Updating..." : "Update Payment"}
</Button>

      </Box>
    </form>
  </Box>
</Modal>
    </>
  );
};

export default BillingsTable;
