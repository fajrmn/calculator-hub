import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const BMICalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    unit: 'metric',
  });

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    let weight = parseFloat(formData.weight);
    let height = parseFloat(formData.height);

    if (formData.unit === 'imperial') {
      // Convert pounds to kg and inches to meters
      weight = weight * 0.453592;
      height = height * 0.0254;
    } else {
      // Convert cm to meters
      height = height / 100;
    }

    const bmi = weight / (height * height);
    
    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    setResult({
      bmi: bmi.toFixed(1),
      category,
      healthyWeightRange: calculateHealthyWeightRange(height, formData.unit)
    });
  };

  const calculateHealthyWeightRange = (height, unit) => {
    const minBMI = 18.5;
    const maxBMI = 24.9;
    
    let minWeight = minBMI * height * height;
    let maxWeight = maxBMI * height * height;
    
    if (unit === 'imperial') {
      // Convert kg back to pounds
      minWeight = (minWeight / 0.453592).toFixed(1);
      maxWeight = (maxWeight / 0.453592).toFixed(1);
      return `${minWeight} - ${maxWeight} pounds`;
    }
    
    return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBMI();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>BMI Calculator - Calculate Your Body Mass Index</title>
        <meta name="description" content="Calculate your Body Mass Index (BMI) and get insights about your healthy weight range." />
      </Helmet>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3, fontWeight: 600 }}>
        BMI Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Your Measurements
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl>
                <FormLabel sx={{ mb: 1 }}>Unit System</FormLabel>
                <RadioGroup
                  row
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="metric" control={<Radio />} label="Metric (kg/cm)" />
                  <FormControlLabel value="imperial" control={<Radio />} label="Imperial (lb/in)" />
                </RadioGroup>
              </FormControl>

              <TextField
                label={`Height (${formData.unit === 'metric' ? 'cm' : 'inches'})`}
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
              />

              <TextField
                label={`Weight (${formData.unit === 'metric' ? 'kg' : 'lb'})`}
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Calculate BMI
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Results
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {result ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Your BMI
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.bmi}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You are classified as: {result.category}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Healthy Weight Range
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {result.healthyWeightRange}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    For your height, a healthy weight range would be
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    BMI Categories
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <Typography variant="body2">Underweight: Less than 18.5</Typography>
                    <Typography variant="body2">Normal weight: 18.5 - 24.9</Typography>
                    <Typography variant="body2">Overweight: 25 - 29.9</Typography>
                    <Typography variant="body2">Obese: 30 or greater</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Note: BMI is a general indicator and may not be accurate for athletes, elderly, or pregnant women.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography variant="body1">
                  Enter your height and weight to calculate your BMI
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BMICalculator;
