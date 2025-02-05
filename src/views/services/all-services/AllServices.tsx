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




type Service = {
  serviceId: number;
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


const ServicesTable = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [openModal, setOpenModal] = useState(false);
const router = useRouter();

  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    serviceType: "",
    serviceCategory: "",
    serviceQuantity: "",
    serviceCost: "",
    servicePrice: "",
    serviceStatus: "available",
    serviceImage: "",
    serviceManufacturer: "",
    uploadedBy: "",
  });

  const serviceType = [
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
  // const [loading, setLoading] = useState(true); // For fetching services
const [submitLoading, setSubmitLoading] = useState(false); // For form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  if (submitLoading) return; // Prevent multiple clicks
  setSubmitLoading(true);

  try {
    const token = Cookies.get("authToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      const newService = await response.json(); 

      setServices((prevServices) => [newService, ...prevServices]);
      setFilteredServices((prevFiltered) => [newService, ...prevFiltered]);

      setFormData({
        serviceName: "",
        serviceDescription: "",
        serviceType: "",
        serviceCategory: "",
        serviceQuantity: "",
        serviceCost: "",
        servicePrice: "",
        serviceStatus: "available",
        serviceImage: "",
        serviceManufacturer: "",
        uploadedBy: "",
      });

      // Close modal and stop loading BEFORE showing the alert
      setOpenModal(false);
      setSubmitLoading(false);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Service added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

    } else {
      throw new Error("Failed to add service.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Oops!",
      text: "An error occurred while adding the service.",
      icon: "error",
      confirmButtonText: "Okay",
    });
  } finally {
    setSubmitLoading(false); // Ensure spinner stops in case of success or error
  }
};



  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/services`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setServices(response.data);
        setFilteredServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services data.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = services.filter(
      (service) =>
        `${service.serviceName}`.toLowerCase().includes(query)
    );
    setFilteredServices(filtered);
    setPage(0);
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setOpenViewModal(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setOpenEditModal(true);
  };


  const handleDelete = async (service) => {
    setOpenViewModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this service?",
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
            `${process.env.NEXT_PUBLIC_APP_URL}/services/${service.serviceId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          // Remove deleted service from state
          setServices((prevServices) => prevServices.filter((p) => p.serviceId !== service.serviceId));
          setFilteredServices((prevFilteredServices) => prevFilteredServices.filter((p) => p.serviceId !== service.serviceId));
  
          Swal.fire("Deleted!", "The service has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the service.", "error");
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
  
  const displayedServices = filteredServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <h3>Services</h3>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          New Service
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
              <TableCell>Service Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedServices.map((service) => (
              <TableRow key={service.id}>
                
                <TableCell>
                  {service?.serviceName} 
                </TableCell>
                <TableCell>{service?.serviceDescription}</TableCell>
                <TableCell>{service?.serviceType}</TableCell>
                <TableCell>{service?.serviceCategory}</TableCell>
                <TableCell>₦{service?.serviceCost ? new Intl.NumberFormat().format(service.serviceCost) : "N/A"}</TableCell>
                
  


                <TableCell>
                  <IconButton onClick={() => handleView(service)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(service)} color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(service)} color="error">
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
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>


{/* Modal for New Service */}
<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="dense"
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
           
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select name="serviceType" value={formData.serviceType} onChange={handleInputChange} required>
                {serviceType.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {formData.serviceType === 'Medicine' && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select name="serviceCategory" value={formData.serviceCategory} onChange={handleInputChange} required>
                  {drugCategory.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

           <FormControl fullWidth margin="dense">
            
            <TextField
              type="number"
              name="serviceCost"
              label="Cost"
              value={formData.serviceCost}
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
      Service Details
    </Typography>
    {selectedService && (
      <>
        <Typography variant="body1">
          <strong>Service Name:</strong> {`${selectedService?.serviceName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {selectedService?.serviceDescription}
        </Typography>
        <Typography variant="body1">
          <strong>Service Type:</strong> {selectedService?.serviceType}
        </Typography>
        <Typography variant="body1">
          <strong>Cost:</strong> ₦{selectedService?.serviceCost ? new Intl.NumberFormat().format(selectedService.serviceCost) : "N/A"}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


{/* Edit Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
      Edit Service
    </Typography>

    {selectedService && (
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission

          if (updateLoading) return; // Prevent multiple clicks
          setUpdateLoading(true);

          try {
            const token = Cookies.get("authToken");

            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/services/${selectedService.serviceId}`,
              selectedService,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              const updatedService = response.data; // ✅ Use response.data with Axios

            // ✅ Ensure service list updates immediately
      setServices((prevServices) => {
        const updated = prevServices.map((service) =>
          service.serviceId === updatedService.serviceId ? updatedService : service
        );
        console.log('Updated Services:', updated);
        return updated;
      });

      setFilteredServices((prevFiltered) => {
        const updated = prevFiltered.map((service) =>
          service.serviceId === updatedService.serviceId ? updatedService : service
        );
        console.log('Updated Filtered Services:', updated);
        return updated;
      });

              // ✅ Close modal BEFORE showing success message
              setOpenEditModal(false);
              setUpdateLoading(false);

              Swal.fire({
                title: "Success!",
                text: "Service updated successfully!",
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
            console.error("Error updating service:", error);

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
          label="Service Name"
          value={selectedService.serviceName}
          onChange={(e) =>
            setSelectedService({
              ...selectedService,
              serviceName: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={selectedService.serviceDescription}
          onChange={(e) =>
            setSelectedService({
              ...selectedService,
              serviceDescription: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Service Type"
          value={selectedService?.serviceType || ""}
          onChange={(e) =>
            setSelectedService({
              ...selectedService,
              serviceType: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Cost"
          value={selectedService?.serviceCost || ""}
          onChange={(e) =>
            setSelectedService({
              ...selectedService,
              serviceCost: e.target.value,
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

export default ServicesTable;
