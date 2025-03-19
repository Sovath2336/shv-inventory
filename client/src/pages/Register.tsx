import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';

type WorkingGroup = 'Smart Click' | 'F.E.' | 'Customs';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    workingGroup: 'Smart Click',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<WorkingGroup>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password requirements
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate first name
    if (!formData.firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      setError('Please enter your last name');
      return;
    }

    // Validate email
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Validate password
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      // Handle specific error cases
      if (err?.response?.status === 409) {
        setError('An account with this email already exists');
      } else if (err?.response?.status === 400) {
        setError(err?.response?.data?.message || 'Invalid registration data');
      } else {
        setError('Failed to create account. Please try again later.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            SHV11 Inventory Management
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom>
            Create Account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleTextChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="working-group-label">Working Group</InputLabel>
                  <Select<WorkingGroup>
                    labelId="working-group-label"
                    id="workingGroup"
                    name="workingGroup"
                    value={formData.workingGroup}
                    label="Working Group"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="Smart Click">Smart Click</MenuItem>
                    <MenuItem value="F.E.">F.E.</MenuItem>
                    <MenuItem value="Customs">Customs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={toggleShowPassword}
                      color="primary"
                    />
                  }
                  label="Show password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 