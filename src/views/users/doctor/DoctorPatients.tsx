'use client';

import React, { useEffect, useState } from 'react';
import {
  Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  CircularProgress, Typography, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {Edit, Visibility, LocalPharmacy, Delete, TransferWithinAStation, MedicalServices } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
// import Tooltip from '@mui/material';

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

  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");

  const [comments, setComments] = useState('');
  // const [comments, setComments] = useState('');
  const [referring, setReferring] = useState(false);

  const [referralCart, setReferralCart] = useState([]); // Stores selected referral services

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


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.warn("No auth token found.");
          return;
        }
  
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (Array.isArray(response.data)) {
          setHospitals(response.data);
        } else {
          console.warn("Unexpected response format:", response.data);
          setHospitals([]);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
  
    if (openTransferModal || openReferralModal) {
      fetchHospitals();
    }
  
    // Optional cleanup function (not needed in this case, but good practice)
    return () => {
      setHospitals([]); // Reset if needed when modals close
    };
  }, [openTransferModal, openReferralModal]);
  
   // Open modals
   const handleOpenTransferModal = (patient) => {
    setSelectedPatient(patient);
    setOpenTransferModal(true);
  };

  const handleOpenReferralModal = (patient) => {
    setSelectedPatient(patient);
    setOpenReferralModal(true);
  };

  // Close modals
  const handleCloseTransferModal = () => {
    setOpenTransferModal(false);
  };

  const handleCloseReferralModal = () => {
    setOpenReferralModal(false);
  };

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

  // const handleAddReferralServiceToCart = () => {
  //   if (!selectedService) return;
  //   const serviceDetails = services.find(s => s.serviceId === selectedService);
  //   setReferralCart([...referralCart, { id: selectedService, name: serviceDetails.serviceName }]);
  //   setSelectedService('');
  // };
  

  const handleAddReferralServiceToCart = () => {
    if (!selectedService) {
      alert("Please select a service first!");
      return;
    }
  
    // Find the selected service object
    const service = services.find(s => s.serviceId === selectedService);
    if (!service) {
      alert("Invalid service selected!");
      return;
    }
  
    // Add to cart with both serviceId and serviceName
    setReferralCart(prevCart => [...prevCart, { serviceId: service.serviceId, serviceName: service.serviceName, cost: service.serviceCost }]);
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


  // Fetch Services When Hospital is Selected
  const handleHospitalChange = async (hospitalId) => {
    setSelectedHospital(hospitalId);
    setSelectedService('');
    setReferralCart([]);

    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/${hospitalId}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Submit Referral
  const handleSubmitReferral = async () => {
    if (!selectedPatient || !selectedHospital || referralCart.length === 0) {
      Swal.fire('Error!', 'Please select a hospital and at least one service.', 'error');
      setOpenReferralModal(false);
      return;
    }
    setReferring(true);

    try {
      const token = Cookies.get('authToken');
      const payload = {
        patientId: selectedPatient.userId,
        hospitalId: selectedHospital,
        services: referralCart.map(service => service.serviceId),
        comment: comments,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/referral`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire('Success!', 'Referral submitted successfully.', 'success');
       // Clear form fields after submission
    setSelectedPatient(null);
    setSelectedHospital('');
    setSelectedService('');
    setReferralCart([]);
    setComments('');

      setOpenReferralModal(false);
    } catch (error) {
      Swal.fire('Error!', 'Failed to submit referral.', 'error');
    }
    setReferring(false);
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
                <TableCell>Hospital File Number</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.patientId}>
                  <TableCell>{patient.chfId}</TableCell>
                  <TableCell>{patient.hospitalFileNumber}</TableCell>
                  <TableCell>{patient.user.firstName} {patient.user.lastName}</TableCell>
                  <TableCell>{patient.cancer?.cancerName || 'N/A'}</TableCell>
                  <TableCell>{patient.user?.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                  

<Tooltip title="Prescribe Medication">
  <IconButton color="primary" onClick={() => handleOpenPrescriptionModal(patient)}>
    <LocalPharmacy />
  </IconButton>
</Tooltip>

<Tooltip title="Refer Patient">
  <IconButton color="info" onClick={() => handleOpenReferralModal(patient)}>
    <MedicalServices />
  </IconButton>
</Tooltip>

<Tooltip title="Transfer Patient">
  <IconButton color="error" onClick={() => handleOpenTransferModal(patient)}>
    <TransferWithinAStation />
  </IconButton>
</Tooltip>


                    

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




      {/* Transfer Modal */}
      {/* <Dialog open={openTransferModal} onClose={handleCloseTransferModal} maxWidth="sm" fullWidth>
        <DialogTitle>Transfer Patient</DialogTitle>
        <DialogContent>
          <Typography>Transfer {selectedPatient?.user.firstName} {selectedPatient?.user.lastName} to another hospital.</Typography>
          <FormControl fullWidth style={{ marginTop: '15px' }}>
            <InputLabel>Hospital</InputLabel>
            <Select>
              <MenuItem value="Oncology">Oncology</MenuItem>
              <MenuItem value="Cardiology">Cardiology</MenuItem>
              <MenuItem value="Neurology">Neurology</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTransferModal}>Cancel</Button>
          <Button variant="contained" color="primary">Transfer</Button>
        </DialogActions>
      </Dialog> */}
      <Dialog open={openTransferModal} onClose={handleCloseTransferModal} maxWidth="sm" fullWidth>
      <DialogTitle>Recommend Patient for Transfer</DialogTitle>
      <DialogContent>
        <Typography>
          Recommend {selectedPatient?.user.firstName}{" "}
          {selectedPatient?.user.lastName} for transfer to another hospital.
        </Typography>

        <FormControl fullWidth style={{ marginTop: "15px" }}>
          <InputLabel>Hospital</InputLabel>
          <Select
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            {hospitals.length > 0 ? (
              hospitals.map((hospital) => (
                <MenuItem key={hospital.hospitalId} value={hospital.hospitalId}>
                  {hospital.hospitalName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hospitals available</MenuItem>
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTransferModal}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedHospital}
        >
          Recommend Transfer
        </Button>
      </DialogActions>
    </Dialog>

      {/* Referral Modal */}
      {/* <Dialog open={openReferralModal} onClose={handleCloseReferralModal} maxWidth="sm" fullWidth>
        <DialogTitle>Refer Patient</DialogTitle>
        <DialogContent>
          <Typography>Refer {selectedPatient?.user.firstName} {selectedPatient?.user.lastName} to a specialist.</Typography>
          <FormControl fullWidth style={{ marginTop: '15px' }}>
            <InputLabel>Specialist</InputLabel>
            <Select>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              <MenuItem value="Endocrinologist">Endocrinologist</MenuItem>
              <MenuItem value="Orthopedic">Orthopedic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReferralModal}>Cancel</Button>
          <Button variant="contained" color="secondary">Refer</Button>
        </DialogActions>
      </Dialog> */}
 
 {/* Referral Modal */}
 <Dialog open={openReferralModal} onClose={() => setOpenReferralModal(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Refer Patient</DialogTitle>
  <DialogContent>
    {/* Select Hospital */}
    <FormControl fullWidth>
      <InputLabel>Select Hospital</InputLabel>
      <Select value={selectedHospital} onChange={(e) => handleHospitalChange(e.target.value)}>
        {hospitals.length > 0 ? (
          hospitals.map((hospital) => (
            <MenuItem key={hospital.hospitalId} value={hospital.hospitalId}>
              {hospital.hospitalName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No hospitals available</MenuItem>
        )}
      </Select>
    </FormControl>

    <TextField
    label="Doctor's Comments"
    multiline
    rows={2}
    variant="outlined"
    fullWidth
    value={comments}
    onChange={(e) => setComments(e.target.value)}
    style={{ marginTop: '15px' }}
  />

    {/* Select Service */}
    <FormControl fullWidth style={{ marginTop: 15 }}>
      <InputLabel>Select Service</InputLabel>
      <Select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
        {services.map((service) => (
          <MenuItem key={service.serviceId} value={service.serviceId}>
            {service.serviceName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Add Service to Cart Button */}
    <Button variant="contained" color="primary" onClick={handleAddReferralServiceToCart} style={{ marginTop: 15 }}>
      Add Referral Service
    </Button>

    {/* 🛒 Cart Table: Shows Added Services */}
    {referralCart.length > 0 ? (
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Service</b></TableCell>
              <TableCell><b>Cost</b></TableCell>
              <TableCell align="right"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {referralCart.map((item, index) => (
    <TableRow key={index}>
      <TableCell>{item.serviceName ? item.serviceName : "Unknown Service"}</TableCell>
      <TableCell>₦{Number(item.cost || 0).toLocaleString('en-NG')}</TableCell>

      <TableCell align="right">
        <Button color="secondary" onClick={() => handleRemoveFromCart(index)}>
          Remove
        </Button>
      </TableCell>
    </TableRow>
    
  ))}
</TableBody>
<Typography variant="h6" style={{ marginTop: 15, textAlign: "right" }}>
  Total: ₦{referralCart.reduce((total, item) => total + Number(item.cost || 0), 0).toLocaleString('en-NG')}
</Typography>





        </Table>
      </TableContainer>
    ) : (
      <p style={{ textAlign: "center", marginTop: 15, fontStyle: "italic" }}>No services added.</p>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenReferralModal(false)}>Cancel</Button>
    <Button variant="contained" color="primary" onClick={handleSubmitReferral} disabled={referring}>
      {referring ? <CircularProgress size={24} /> : "Refer"}
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default DoctorPatientsTable;
