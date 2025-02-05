'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Swal from 'sweetalert2'
import { useRouter, useSearchParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import Paper from '@mui/material/Paper'
const inventoryOptions = [
  { value: 'Products', label: 'Products' },
  { value: 'Services', label: 'Services' }
]

const categoryOptions = {
  Products: ['Medicine', 'Lens', 'Frame', 'Accessory'],
  Services: ['Investigation', 'Surgery', 'Procedure']
}

const CreateBilling = () => {
  const [inventoryType, setInventoryType] = useState('')
  const [categoryType, setCategoryType] = useState('')
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState('')
  const [remainingStock, setRemainingStock] = useState(0)
  const [billingItems, setBillingItems] = useState([]) // Stores multiple items
  const [loading, setLoading] = useState(false) // For submit button
  const [itemsLoading, setItemsLoading] = useState(false) // For submit button

  const searchParams = useSearchParams()
  const router = useRouter()
  const patientId = searchParams.get('patientId')
  const patientName = searchParams.get('patientName')

  useEffect(() => {
    if (categoryType) {
      const token = Cookies.get('authToken');
      setItemsLoading(true); // Optional: Show loading state while fetching data
  
      // Set the appropriate endpoint based on the selected category type
      const endpoint = inventoryType === 'Products' 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/product-billing-inventories?category=${categoryType}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/service-billing-inventories?category=${categoryType}`;  // Use the service endpoint for services
  
      axios
        .get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => setItems(response.data))
        .catch(error => console.error('Error fetching items:', error))
        .finally(() => setItemsLoading(false));  // Reset loading state
    }
  }, [categoryType]); // Trigger effect whenever the categoryType changes
  
  const handleItemChange = (value) => {
    // Check if it's a product or service
    const selected = items.find(item => item?.inventoryId === value || item?.serviceName === value);
    
    if (selected?.product) {
      // It's a product, so set inventoryId and calculate stock
      setSelectedItem(selected.inventoryId);
      setRemainingStock(parseInt(selected?.quantityReceived, 10) - parseInt(selected?.quantitySold, 10));
      setSelectedService(""); // Clear selected service for products
    } else if (selected?.serviceName) {
      // It's a service, so just set selectedService
      setSelectedItem(""); // Clear selected product for services
      setSelectedService(selected.serviceName);
      setRemainingStock(0); // Services don't have stock
    }
  };
  

  const handleAddProduct = () => {
    if (!inventoryType || !categoryType || (!selectedItem && !selectedService) || (inventoryType === 'Products' && !quantity)) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
  
    if (inventoryType === 'Products' && quantity > remainingStock) {
      Swal.fire("Error", "Quantity exceeds remaining stock!", "error");
      return;
    }
  
    const selectedProduct = inventoryType === 'Products' 
      ? items.find(item => item.inventoryId === selectedItem)
      : items.find(item => item.serviceName === selectedService);
  
    const newProduct = {
      inventoryId: selectedItem || "", // Include inventoryId for products
      serviceId: selectedProduct?.serviceId || "", // Include serviceId for services
      productId: selectedProduct?.product?.productId || "",
      productName: selectedProduct?.product?.productName || selectedProduct?.serviceName,
      productDescription: selectedProduct?.product?.productDescription || selectedProduct?.serviceDescription,
      quantity: inventoryType === 'Products' ? parseInt(quantity, 10) : 1, // Quantity only for products
      inventoryType: inventoryType,  
      categoryType: categoryType,  
      price: selectedProduct?.product?.productCost || selectedProduct?.serviceCost, 
    };
  
    setBillingItems([...billingItems, newProduct]);
    setSelectedItem("");
    setQuantity("");
    setRemainingStock(0);
    setSelectedService("");
  };
  
  
  const handleRemoveProduct = (index) => {
    setBillingItems(billingItems.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (billingItems.length === 0) {
      Swal.fire("Error", "Please add at least one product!", "error");
      return;
    }
  
    setLoading(true);
    const token = Cookies.get("authToken");
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/bill-patient`,
        {
          patientId,
          items: billingItems,  // ✅ Now contains inventoryType and categoryType
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        Swal.fire("Success", "Billing created successfully!", "success");
        setBillingItems([]); // Clear items after submission
        setInventoryType(""); // Reset inventory type
        setCategoryType(""); // Reset category type
        router.push("/dashboard/billings");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create billing!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom> Create Billing: <b>{patientName}</b> </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Inventory Type</InputLabel>
                <Select value={inventoryType} onChange={(e) => setInventoryType(e.target.value)}>
                  {inventoryOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!inventoryType}>
                <InputLabel>Category Type</InputLabel>
                <Select value={categoryType} onChange={(e) => setCategoryType(e.target.value)}>
                  {inventoryType && categoryOptions[inventoryType].map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!categoryType}>
                <InputLabel>Item Name</InputLabel>
                <Select
                  value={selectedItem || selectedService} // Use either item or service depending on what's selected
                  onChange={(e) => handleItemChange(e.target.value)}
                >
                  {itemsLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    items.map((item) => (
                      <MenuItem key={item?.inventoryId || item?.serviceName} value={item?.inventoryId || item?.serviceName}>
                        {item?.product ? item.product.productName : item.serviceName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Remaining Stock" value={remainingStock} disabled />
            </Grid>

            {inventoryType === 'Products' && (
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Quantity" value={quantity}
                  onChange={(e) => setQuantity(e.target.value)} inputProps={{ min: 1, max: remainingStock }} 
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" color="secondary" onClick={handleAddProduct}>Add Product</Button>
            </Grid>

            {billingItems.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6">Selected Products:</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product/Service</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price (₦)</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName || item.productDescription}</TableCell>
                          <TableCell>{item.productDescription || item.serviceDescription}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price}</TableCell>
                          <TableCell>
                            <Button color="error" onClick={() => handleRemoveProduct(index)}>Remove</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateBilling
