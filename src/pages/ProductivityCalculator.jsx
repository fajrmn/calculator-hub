import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Grid,
  Paper,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

const ProductivityCalculator = () => {
  const [values, setValues] = useState({
    revenue: '',
    employees: '',
    workingHours: '',
  });

  const [results, setResults] = useState({
    revenuePerEmployee: 0,
    revenuePerHour: 0,
  });

  const handleInputChange = (field) => (event) => {
    const newValue = event.target.value;
    setValues((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  useEffect(() => {
    const revenue = parseFloat(values.revenue) || 0;
    const employees = parseInt(values.employees) || 1;
    const hours = parseFloat(values.workingHours) || 1;

    const revenuePerEmployee = revenue / employees;
    const revenuePerHour = revenue / hours;

    setResults({
      revenuePerEmployee: revenuePerEmployee,
      revenuePerHour: revenuePerHour,
    });
  }, [values]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>Productivity Calculator - Calculator Hub</title>
        <meta
          name="description"
          content="Calculate revenue per employee, productivity metrics, and revenue per working hour."
        />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Productivity Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Input Values
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Revenue"
                value={values.revenue}
                onChange={handleInputChange('revenue')}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                placeholder="Enter total revenue"
              />

              <TextField
                label="Number of Employees"
                value={values.employees}
                onChange={handleInputChange('employees')}
                type="number"
                fullWidth
                placeholder="Enter number of employees"
              />

              <TextField
                label="Working Hours"
                value={values.workingHours}
                onChange={handleInputChange('workingHours')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                }}
                placeholder="Enter total working hours"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Revenue per Employee
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatCurrency(results.revenuePerEmployee)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average revenue generated per employee
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Revenue per Working Hour
                </Typography>
                <Typography variant="h4" color="primary">
                  {formatCurrency(results.revenuePerHour)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average revenue generated per hour
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Productivity Metrics">
        <Typography variant="body1" paragraph>
          The Productivity Calculator helps you measure and analyze key performance metrics for your business or team.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Revenue per Employee:
        </Typography>
        <Typography variant="body1">
          • Measures the average revenue generation per employee
          • Helps evaluate workforce efficiency
          • Useful for comparing productivity across teams or industry benchmarks
          • Higher values indicate better employee productivity
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Revenue per Working Hour:
        </Typography>
        <Typography variant="body1">
          • Shows how much revenue is generated per hour of work
          • Useful for project pricing and resource allocation
          • Helps identify peak productivity periods
          • Can be used to optimize work schedules
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          How to Use:
        </Typography>
        <Typography variant="body1">
          • Enter your total revenue for the period
          • Input the number of employees involved
          • Specify the total working hours for the period
          • Results update automatically as you type
          • Use the metrics to make informed business decisions
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • All calculations are estimates based on provided inputs
          • Consider using consistent time periods for accurate comparisons
          • Factor in variables like overtime and part-time work
          • Use alongside other metrics for comprehensive analysis
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default ProductivityCalculator;
