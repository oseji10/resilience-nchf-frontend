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

const PatientBillingsTable = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [filteredBillings, setFilteredBillings] = useState<Billing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

  const [submitDownloading, setDownloading] = useState(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const router = useRouter();

  const [openPaymentModal, setOpenPaymentModal] = useState(false); // Add state for payment modal
  const [formData, setFormData] = useState({
    paymentMethod: "",
    paymentReference: "",
  });

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/billings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // params: {
          //   startDate,
          //   endDate,
          // },
        });
        setBillings(response.data);
        setFilteredBillings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billings data.');
        setLoading(false);
      }
    };

    fetchBillings();
  }, [startDate, endDate]);  // Fetch billings on date range change

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = billings.filter(
      (billing) =>
        `${billing.patient?.user?.firstName} ${billing.patient?.user?.lastName}`.toLowerCase().includes(query)
    );
    setFilteredBillings(filtered);
    setPage(0);
  };

  const handleView = (billing: Billing) => {
    setSelectedBilling(billing);
    setOpenViewModal(true);
  };

  const handlePaymentsClick = (billing) => {
    setSelectedBilling(billing);
    setOpenPaymentModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const displayedBillings = filteredBillings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        {/* <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        /> */}

{/* <Button variant="contained" color="primary" onClick={() => setOpenInvoiceModal(true)}>
        Generate Invoice
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
              <TableCell>Billing Date</TableCell>
              <TableCell>TRX ID</TableCell>
              {/* <TableCell>Patient Name</TableCell> */}
              <TableCell>Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBillings.map((billing) => (
              <TableRow key={billing.billingId}>
                <TableCell>
                  {billing.created_at &&
                    new Date(billing.created_at).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                </TableCell>
                <TableCell>{billing.transactionId}</TableCell>
                {/* <TableCell>{billing.patient?.user?.firstName} {billing.patient?.user?.lastName}</TableCell> */}
                <TableCell>₦{billing.total_cost ? new Intl.NumberFormat().format(billing.total_cost) : "N/A"}</TableCell>
                <TableCell>
                  <span
                    style={{
                      backgroundColor: billing.paymentStatus === "pending" ? "#FFC107" : "#4CAF50",
                      color: "white",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {billing.paymentStatus === "pending" ? "PENDING" : "COMPLETED"}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(billing)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => billing.paymentStatus === "pending" && handlePaymentsClick(billing)}
                    color={billing.paymentStatus === "pending" ? "warning" : "success"}
                  >
                    {billing.paymentStatus === "pending" ? (
                      <Payments />
                    ) : (
                      <CheckCircle />
                    )}
                  </IconButton>
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

      
      

      {/* View Billing Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Billing Details</Typography>
          {selectedBilling && (
            <>
              <p><strong>Billing Date:</strong> {selectedBilling.createdAt}</p>
              <p><strong>Patient Name:</strong> {selectedBilling.patient?.firstName} {selectedBilling.patient?.lastName}</p>
              <p><strong>Amount:</strong> ₦{new Intl.NumberFormat().format(selectedBilling.total_cost || 0)}</p>
              <p><strong>Payment Status:</strong> {selectedBilling.paymentStatus}</p>
            </>
          )}
          <Button onClick={() => setOpenViewModal(false)} variant="contained" color="primary">Close</Button>
        </Box>
      </Modal>

      
    </>
  );
};

export default PatientBillingsTable;
