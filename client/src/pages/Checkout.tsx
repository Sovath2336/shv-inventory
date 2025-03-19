import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { inventoryService } from '../services/api';
import { InventoryItem } from '../types';
import Layout from '../components/Layout';

interface CheckoutItemWithDetails extends InventoryItem {
  checkoutQuantity: number;
}

const Checkout: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<CheckoutItemWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await inventoryService.getAllItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddItem = (item: InventoryItem) => {
    if (selectedItems.some((selected) => selected._id === item._id)) {
      setError('Item already added to checkout list');
      return;
    }

    setSelectedItems([...selectedItems, { ...item, checkoutQuantity: 1 }]);
    setSearchTerm('');
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item._id === itemId
          ? { ...item, checkoutQuantity: Math.min(quantity, item.quantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter((item) => item._id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      const checkoutItems = selectedItems.map((item) => ({
        id: item._id,
        quantity: item.checkoutQuantity,
      }));

      await inventoryService.checkoutItems(checkoutItems);
      setSuccess('Items checked out successfully');
      setSelectedItems([]);
      fetchItems();
    } catch (error) {
      setError('Failed to checkout items');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Checkout Items
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Search items by name, part number, or barcode"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ mb: 2 }}
              />
              {searchTerm && (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Part Number</TableCell>
                        <TableCell>Available</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell>{item.partNumber}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleAddItem(item)}
                              disabled={item.quantity === 0}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {selectedItems.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Selected Items
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Part Number</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.partNumber}</TableCell>
                            <TableCell>
                              <TextField
                                type="number"
                                value={item.checkoutQuantity}
                                onChange={(e) =>
                                  handleQuantityChange(item._id, parseInt(e.target.value))
                                }
                                inputProps={{
                                  min: 1,
                                  max: item.quantity,
                                }}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveItem(item._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckout}
                    sx={{ mt: 2 }}
                  >
                    Complete Checkout
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Checkout; 