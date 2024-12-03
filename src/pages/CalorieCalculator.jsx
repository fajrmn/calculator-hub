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
  Select,
  MenuItem,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const CalorieCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activity: 'moderate',
    unit: 'metric',
  });

  const [result, setResult] = useState(null);

  const activityLevels = {
    sedentary: { label: 'Sedentary (little or no exercise)', factor: 1.2 },
    light: { label: 'Light (exercise 1-3 times/week)', factor: 1.375 },
    moderate: { label: 'Moderate (exercise 4-5 times/week)', factor: 1.55 },
    active: { label: 'Active (daily exercise or intense exercise 3-4 times/week)', factor: 1.725 },
    veryActive: { label: 'Very Active (intense exercise 6-7 times/week)', factor: 1.9 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateCalories = () => {
    let weight = parseFloat(formData.weight);
    let height = parseFloat(formData.height);
    let age = parseFloat(formData.age);

    if (formData.unit === 'imperial') {
      weight = weight * 0.453592;
      height = height * 2.54;
    }

    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityFactor = activityLevels[formData.activity].factor;
    const maintenanceCalories = Math.round(bmr * activityFactor);

    setResult({
      maintenance: maintenanceCalories,
      weightLoss: maintenanceCalories - 500,
      weightGain: maintenanceCalories + 500,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateCalories();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>Calorie Calculator - Calculate Your Daily Calorie Needs</title>
        <meta name="description" content="Calculate your daily calorie needs based on your age, gender, height, weight, and activity level. Get personalized recommendations for weight loss or gain." />
      </Helmet>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3, fontWeight: 600 }}>
        Calorie Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Your Details
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

              <FormControl>
                <FormLabel sx={{ mb: 1 }}>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>

              <TextField
                label="Age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                required
                inputProps={{ min: 15, max: 80 }}
                size="small"
              />

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

              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Activity Level</FormLabel>
                <Select
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                  size="small"
                >
                  {Object.entries(activityLevels).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Calculate Calories
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
                    Maintenance Calories
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.maintenance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily calories to maintain your current weight
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Weight Loss
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.weightLoss}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily calories to lose 1 pound per week
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Weight Gain
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.weightGain}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Daily calories to gain 1 pound per week
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  These calculations are based on the Mifflin-St Jeor Equation. Results may vary based on individual factors.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography variant="body1">
                  Fill in your details and click "Calculate Calories" to see your results
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CalorieCalculator;
