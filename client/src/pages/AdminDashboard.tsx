import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { authService, inventoryService } from '../services/api';
import { User } from '../types';
import Layout from '../components/Layout';

const AdminDashboard: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const users = await authService.getPendingApprovals();
      setPendingUsers(users);
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
      setError('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await authService.approveUser(userId);
      setSuccess('User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      console.error('Failed to approve user:', error);
      setError('Failed to approve user');
    }
  };

  const handleExportInventory = async () => {
    try {
      const blob = await inventoryService.exportInventory();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export inventory:', error);
      setError('Failed to export inventory');
    }
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Typography component="h2" variant="h6" color="primary">
                  Admin Dashboard
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExportInventory}
                >
                  Export Inventory
                </Button>
              </div>
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
              <Typography variant="h6" gutterBottom>
                Pending User Approvals
              </Typography>
              {pendingUsers.length === 0 ? (
                <Typography color="textSecondary">No pending approvals</Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Working Group</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.workingGroup}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default AdminDashboard; 