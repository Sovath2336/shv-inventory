import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { inventoryService } from '../services/api';
import { InventoryItem } from '../types';
import Layout from '../components/Layout';

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    itemName: '',
    partNumber: '',
    category: 'RPM',
    workingGroup: 'Smart Click',
    quantity: 0,
    barcode: '',
  });

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

  const handleAddItem = async () => {
    try {
      await inventoryService.addItem(newItem as Omit<InventoryItem, '_id'>);
      setOpenDialog(false);
      setNewItem({
        itemName: '',
        partNumber: '',
        category: 'RPM',
        workingGroup: 'Smart Click',
        quantity: 0,
        barcode: '',
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

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
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Inventory Items
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Item
            </Button>
          </div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Part Number</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Working Group</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.partNumber}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.workingGroup}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="itemName"
              label="Item Name"
              fullWidth
              value={newItem.itemName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="partNumber"
              label="Part Number"
              fullWidth
              value={newItem.partNumber}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              select
              fullWidth
              value={newItem.category}
              onChange={handleChange}
            >
              <MenuItem value="RPM">RPM</MenuItem>
              <MenuItem value="Utility Panel">Utility Panel</MenuItem>
              <MenuItem value="Handheld">Handheld</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              name="workingGroup"
              label="Working Group"
              select
              fullWidth
              value={newItem.workingGroup}
              onChange={handleChange}
            >
              <MenuItem value="Smart Click">Smart Click</MenuItem>
              <MenuItem value="F.E.">F.E.</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              value={newItem.quantity}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="barcode"
              label="Barcode"
              fullWidth
              value={newItem.barcode}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Inventory; 