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
import { Visibility, Payments, CheckCircle, PictureAsPdf } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const modalStyle = {
  position: 'absolute',
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

const BillingsTable = () => {
  const [billings, setBillings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/billings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBillings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billings data.');
        setLoading(false);
      }
    };
    fetchBillings();
  }, []);

  const handleGenerateInvoice = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/generate-invoice`,
        { startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      Swal.fire('Error', 'Failed to generate invoice', 'error');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpenInvoiceModal(true)}>
        Generate Invoice
      </Button>
      
      <Modal open={openInvoiceModal} onClose={() => setOpenInvoiceModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Generate Invoice</Typography>
          <TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <Button variant="contained" color="primary" fullWidth onClick={handleGenerateInvoice} sx={{ mt: 2 }}>
            Download Invoice
          </Button>
        </Box>
      </Modal>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Billing Date</TableCell>
              <TableCell>TRX ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billings.map((billing) => (
              <TableRow key={billing.billingId}>
                <TableCell>{billing.createdAt}</TableCell>
                <TableCell>{billing.transactionId}</TableCell>
                <TableCell>₦{billing.total_cost}</TableCell>
                <TableCell>
                  <span style={{ backgroundColor: billing.paymentStatus === 'pending' ? '#FFC107' : '#4CAF50', color: 'white', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>
                    {billing.paymentStatus === 'pending' ? 'PENDING' : 'PAID'}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton color={billing.paymentStatus === 'pending' ? 'warning' : 'success'}>
                    {billing.paymentStatus === 'pending' ? <Payments /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BillingsTable;
