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




type Product = {
  productId: number;
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


const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openModal, setOpenModal] = useState(false);
const router = useRouter();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productType: "",
    productCategory: "",
    productQuantity: "",
    productCost: "",
    productPrice: "",
    productStatus: "available",
    productImage: "",
    productManufacturer: "",
    uploadedBy: "",
  });

  const productType = [
    'Medicine',
    'Lens',
    'Frame',
    'Accessory',
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
  // const [loading, setLoading] = useState(true); // For fetching products
const [submitLoading, setSubmitLoading] = useState(false); // For form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  if (submitLoading) return; // Prevent multiple clicks
  setSubmitLoading(true);

  try {
    const token = Cookies.get("authToken");
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 201) {
      const newProduct = await response.json(); 

      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      setFilteredProducts((prevFiltered) => [newProduct, ...prevFiltered]);

      setFormData({
        productName: "",
        productDescription: "",
        productType: "",
        productCategory: "",
        productQuantity: "",
        productCost: "",
        productPrice: "",
        productStatus: "available",
        productImage: "",
        productManufacturer: "",
        uploadedBy: "",
      });

      // Close modal and stop loading BEFORE showing the alert
      setOpenModal(false);
      setSubmitLoading(false);

      // Show success message
      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });

    } else {
      throw new Error("Failed to add product.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    Swal.fire({
      title: "Oops!",
      text: "An error occurred while adding the product.",
      icon: "error",
      confirmButtonText: "Okay",
    });
  } finally {
    setSubmitLoading(false); // Ensure spinner stops in case of success or error
  }
};



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products data.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        `${product.productName}`.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setOpenViewModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };


  const handleDelete = async (product) => {
    setOpenViewModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
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
            `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          // Remove deleted product from state
          setProducts((prevProducts) => prevProducts.filter((p) => p.productId !== product.productId));
          setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter((p) => p.productId !== product.productId));
  
          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the product.", "error");
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
  
  const displayedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <h3>Products</h3>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          New Product
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
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProducts.map((product) => (
              <TableRow key={product.id}>
                
                <TableCell>
                  {product?.productName} 
                </TableCell>
                <TableCell>{product?.productDescription}</TableCell>
                <TableCell>{product?.productType}</TableCell>
                <TableCell>{product?.productCategory}</TableCell>
                <TableCell>₦{product?.productCost ? new Intl.NumberFormat().format(product.productCost) : "N/A"}</TableCell>
                
  


                <TableCell>
                  <IconButton onClick={() => handleView(product)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(product)} color="warning">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product)} color="error">
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>


{/* Modal for New Product */}
<Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="dense"
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
            />
           
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select name="productType" value={formData.productType} onChange={handleInputChange} required>
                {productType.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {formData.productType === 'Medicine' && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select name="productCategory" value={formData.productCategory} onChange={handleInputChange} required>
                  {drugCategory.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

           <FormControl fullWidth margin="dense">
            
            <TextField
              type="number"
              name="productCost"
              label="Cost"
              value={formData.productCost}
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
      Product Details
    </Typography>
    {selectedProduct && (
      <>
        <Typography variant="body1">
          <strong>Product Name:</strong> {`${selectedProduct?.productName}`}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {selectedProduct?.productDescription}
        </Typography>
        <Typography variant="body1">
          <strong>Product Type:</strong> {selectedProduct?.productType}
        </Typography>
        <Typography variant="body1">
          <strong>Cost:</strong> ₦{selectedProduct?.productCost ? new Intl.NumberFormat().format(selectedProduct.productCost) : "N/A"}
        </Typography>
</>
       
    )}
  </Box>
</Modal>


{/* Edit Modal */}
<Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
  <Box sx={{ ...modalStyle }}>
    <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
      Edit Product
    </Typography>

    {selectedProduct && (
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent default form submission

          if (updateLoading) return; // Prevent multiple clicks
          setUpdateLoading(true);

          try {
            const token = Cookies.get("authToken");

            const response = await axios.put(
              `${process.env.NEXT_PUBLIC_APP_URL}/products/${selectedProduct.productId}`,
              selectedProduct,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              const updatedProduct = response.data; // ✅ Use response.data with Axios

            // ✅ Ensure product list updates immediately
      setProducts((prevProducts) => {
        const updated = prevProducts.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        );
        console.log('Updated Products:', updated);
        return updated;
      });

      setFilteredProducts((prevFiltered) => {
        const updated = prevFiltered.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        );
        console.log('Updated Filtered Products:', updated);
        return updated;
      });

              // ✅ Close modal BEFORE showing success message
              setOpenEditModal(false);
              setUpdateLoading(false);

              Swal.fire({
                title: "Success!",
                text: "Product updated successfully!",
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
            console.error("Error updating product:", error);

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
          label="Product Name"
          value={selectedProduct.productName}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              productName: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          value={selectedProduct.productDescription}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              productDescription: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Product Type"
          value={selectedProduct?.productType || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              productType: e.target.value,
            })
          }
        />
        <TextField
          fullWidth
          margin="normal"
          label="Cost"
          value={selectedProduct?.productCost || ""}
          onChange={(e) =>
            setSelectedProduct({
              ...selectedProduct,
              productCost: e.target.value,
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

export default ProductsTable;
