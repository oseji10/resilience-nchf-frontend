'use client';

import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Typography, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button
} from '@mui/material';
import { LocalPharmacy, Delete } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const PrescriptionsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prescription Modal State
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]); // Doctor's prescriptions
  const [dispensing, setDispensing] = useState(false);

  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/prescriptions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (err) {
        setError('Failed to load patients data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch Doctor's Prescriptions when Modal Opens
  const handleOpenPrescriptionModal = async (patient) => {
    setSelectedPatient(patient);
    setOpenPrescriptionModal(true);
  
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/prescriptions/${patient.prescriptionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Include accurate stock availability in prescriptions
      const prescriptionsWithStock = response.data.map((item) => ({
        ...item,
        dispensedQuantity: item.stock_available > 0 ? item.quantity : 0, // Default to full prescription quantity if in stock, otherwise 0
      }));
  
      setPrescriptions(prescriptionsWithStock);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };
   
  // Close Modal
  const handleClosePrescriptionModal = () => {
    setOpenPrescriptionModal(false);
    setPrescriptions([]);
  };

  // Update Dispensed Quantity
  const handleDispenseChange = (index, value) => {
    setPrescriptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, dispensedQuantity: value } : item))
    );
  };

  // Submit Dispensed Prescriptions
  const handleDispensePrescription = async () => {
    // console.log("Dispense button clicked!"); // Debugging
    setDispensing(true);
  
    try {
      const token = Cookies.get('authToken');
      const payload = {
        patientId: selectedPatient?.patient?.patientId,
        prescriptions: prescriptions.map((item) => ({
          inventoryId: item?.product?.stock?.inventoryId,
          prescriptionId: item.prescriptionId,
          dispensedQuantity: item.dispensedQuantity, 
        })),
      };
  
      // console.log("Payload to send:", payload); // Debugging
  
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/dispense`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", },
      });
  
      Swal.fire('Success!', 'Prescription dispensed successfully.', 'success');
      handleClosePrescriptionModal();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire('Error!', 'Failed to dispense prescription.', 'error');
    }
  
    setDispensing(false);
  };
  
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        My Patients
      </Typography>
      <TextField
        label="Search Patients"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>CHF ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient?.patient?.patientId}>
                  <TableCell>{patient?.patient?.chfId}</TableCell>
                  <TableCell>{patient?.patient?.user.firstName} {patient?.patient?.user.lastName}</TableCell>
                  <TableCell>{patient?.patient?.cancer?.cancerName || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleOpenPrescriptionModal(patient)}>
                      <LocalPharmacy />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Prescription Modal */}
      <Dialog open={openPrescriptionModal} onClose={handleClosePrescriptionModal} maxWidth="sm" fullWidth>
        <DialogTitle>Dispense Prescription for {selectedPatient?.patient?.user?.firstName} {selectedPatient?.patient?.user?.lastName}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Prescribed Qty</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Dispense</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {prescriptions.map((item, index) => (
    <TableRow key={item.prescriptionId}>
      <TableCell>{item?.product?.productName || item.serviceName}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>
        {item.stock_available > 0 ? item.stock_available : (
          <Typography color="error">Out of Stock</Typography>
        )}
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          value={item.dispensedQuantity}
          onChange={(e) => handleDispenseChange(index, e.target.value)}
          inputProps={{
            min: 0,
            max: item.stock_available > 0 ? item.quantity : 0, // Prevent dispensing if out of stock
          }}
          style={{ width: '60px' }}
          disabled={item.stock_available <= 0} // Disable input if out of stock
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrescriptionModal}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDispensePrescription}
            disabled={dispensing}
          >
            {dispensing ? <CircularProgress size={24} color="inherit" /> : "Dispense"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PrescriptionsTable;
