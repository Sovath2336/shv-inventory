import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { inventoryService } from '../services/api';
import { InventoryItem } from '../types';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStock: 0,
    categories: {
      RPM: 0,
      'Utility Panel': 0,
      Handheld: 0,
      Other: 0,
    },
  });

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const items = await inventoryService.getAllItems();
        const stats = calculateStats(items);
        setInventoryStats(stats);
      } catch (error) {
        console.error('Failed to fetch inventory stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryStats();
  }, []);

  const calculateStats = (items: InventoryItem[]) => {
    const stats = {
      totalItems: items.length,
      lowStock: items.filter((item) => item.quantity < 5).length,
      categories: {
        RPM: 0,
        'Utility Panel': 0,
        Handheld: 0,
        Other: 0,
      },
    };

    items.forEach((item) => {
      stats.categories[item.category]++;
    });

    return stats;
  };

  if (loading) {
    return (
      <Layout>
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
          <CircularProgress />
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h3">
                {inventoryStats.totalItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h3" color="error">
                {inventoryStats.lowStock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {Object.entries(inventoryStats.categories).map(([category, count]) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {category}
                </Typography>
                <Typography variant="h3">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default Dashboard; 