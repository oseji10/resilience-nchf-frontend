'use client';

import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Typography, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit, Visibility, LocalPharmacy, Delete } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const DoctorPatientsTable = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prescription Modal State
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]); // Stores selected products and services
  const [prescribing, setPrescribing] = useState(false);

  const [comments, setComments] = useState('');
  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/doctor/all`, {
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

  // Fetch Products and Services when Modal Opens
  const handleOpenPrescriptionModal = async (patient) => {
    setSelectedPatient(patient);
    setOpenPrescriptionModal(true);
    setCart([]); // Clear cart when opening modal

    try {
      const token = Cookies.get('authToken');
      const productsResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const servicesResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(productsResponse.data);
      setServices(servicesResponse.data);
    } catch (error) {
      console.error('Error fetching prescription data:', error);
    }
  };

  // Close Prescription Modal
  const handleClosePrescriptionModal = () => {
    setOpenPrescriptionModal(false);
    setSelectedProduct('');
    setSelectedService('');
    setQuantity(1);
  };

  // Add Product to Cart
  const handleAddProductToCart = () => {
    if (!selectedProduct || quantity < 1) return;
    const productDetails = products.find(p => p.productId === selectedProduct);
    setCart([...cart, { type: 'product', id: selectedProduct, name: productDetails.productName, quantity }]);
    setSelectedProduct('');
    setQuantity(1);
  };

  // Add Service to Cart
  const handleAddServiceToCart = () => {
    if (!selectedService) return;
    const serviceDetails = services.find(s => s.serviceId === selectedService);
    setCart([...cart, { type: 'service', id: selectedService, name: serviceDetails.serviceName }]);
    setSelectedService('');
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Handle Prescription Submission
  const handleSubmitPrescription = async () => {
    if (!selectedPatient || cart.length === 0) {
      Swal.fire('Error!', 'Please add at least one product or service.', 'error');
      return;
    }
    setPrescribing(true);
    try {
      const token = Cookies.get('authToken');
      const payload = {
        patientId: selectedPatient.patientId,
        prescriptions: cart.map(item => ({
          type: item.type, // "product" or "service"
          productId: item.type === 'product' ? item.id : null, // Only for products
          serviceId: item.type === 'service' ? item.id : null, // Only for services
          quantity: item.type === 'product' ? item.quantity : null, // Only for products
        })),
        comments: comments || null, // Include doctor's comments
      };
  
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/prescriptions`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      Swal.fire('Success!', 'Prescription submitted successfully.', 'success');
      handleClosePrescriptionModal();
    } catch (error) {
      Swal.fire('Error!', 'Failed to submit prescription.', 'error');
    }
    setPrescribing(false);
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
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.chfId}</TableCell>
                  <TableCell>{patient.user.firstName} {patient.user.lastName}</TableCell>
                  <TableCell>{patient.cancer?.cancerName || 'N/A'}</TableCell>
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
        <DialogTitle>Prescribe Treatment for {selectedPatient?.user.firstName} {selectedPatient?.user.lastName}</DialogTitle>
        <DialogContent>
  {/* Product Selection & Quantity (Inline) */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <FormControl style={{ flex: 1 }}>
      <InputLabel>Product</InputLabel>
      <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} fullWidth>
        {products.map((product) => (
          <MenuItem key={product.productId} value={product.productId}>
            {product.productName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      type="number"
      label="Qty"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      style={{ width: '80px' }} // Smaller width for quantity
    />
    <Button variant="contained" color="primary" onClick={handleAddProductToCart}>
      Add
    </Button>
  </div>

  {/* Service Selection (Separate Line) */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
    <FormControl fullWidth>
      <InputLabel>Service</InputLabel>
      <Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
        {services.map((service) => (
          <MenuItem key={service.serviceId} value={service.serviceId}>
            {service.serviceName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <Button variant="contained" color="primary" onClick={handleAddServiceToCart}>
      Add
    </Button>
  </div>

  {/* Cart Table */}
  <Table>
    <TableBody>
      {cart.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.type === 'product' ? item.quantity : 'N/A'}</TableCell>
          <TableCell>
            <IconButton onClick={() => handleRemoveFromCart(index)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

  {/* Comment Box */}
  <TextField
    label="Doctor's Comments"
    multiline
    rows={3}
    variant="outlined"
    fullWidth
    value={comments}
    onChange={(e) => setComments(e.target.value)}
    style={{ marginTop: '15px' }}
  />
</DialogContent>

        <DialogActions>
          <Button onClick={handleClosePrescriptionModal}>Cancel</Button>
          {/* <Button variant="contained" color="primary" onClick={handleSubmitPrescription}>Submit</Button> */}
          <Button variant="contained" color="primary" onClick={handleSubmitPrescription} disabled={prescribing}>
                    {prescribing ? <CircularProgress size={24} color="inherit" /> : "Prescribe"}
                    </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorPatientsTable;
