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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const BMRCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
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

  const calculateBMR = () => {
    let weight = parseFloat(formData.weight);
    let height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (formData.unit === 'imperial') {
      // Convert pounds to kg and inches to cm
      weight = weight * 0.453592;
      height = height * 2.54;
    }

    // Mifflin-St Jeor Equation
    let bmr;
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Calculate daily calorie needs for different activity levels
    const activityLevels = {
      sedentary: bmr * 1.2,
      light: bmr * 1.375,
      moderate: bmr * 1.55,
      active: bmr * 1.725,
      veryActive: bmr * 1.9
    };

    setResult({
      bmr: Math.round(bmr),
      activityLevels: {
        sedentary: Math.round(activityLevels.sedentary),
        light: Math.round(activityLevels.light),
        moderate: Math.round(activityLevels.moderate),
        active: Math.round(activityLevels.active),
        veryActive: Math.round(activityLevels.veryActive)
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBMR();
  };

  const handleClear = () => {
    setFormData({
      age: '',
      gender: 'male',
      height: '',
      weight: '',
      unit: 'metric'
    });
    setResult(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>BMR Calculator - Calculate Your Basal Metabolic Rate</title>
        <meta name="description" content="Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on activity level." />
      </Helmet>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3, fontWeight: 600 }}>
        BMR Calculator
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
                size="small"
                inputProps={{ min: 15, max: 80 }}
                helperText="Age (15-80 years)"
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

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Calculate BMR
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
                    Your Base BMR
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.bmr} Calories/day
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is your basal metabolic rate - the calories you burn at complete rest
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Daily Calorie Needs by Activity Level
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Sedentary (little or no exercise)</TableCell>
                          <TableCell align="right">{result.activityLevels.sedentary}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Light Exercise (1-3 times/week)</TableCell>
                          <TableCell align="right">{result.activityLevels.light}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Moderate Exercise (4-5 times/week)</TableCell>
                          <TableCell align="right">{result.activityLevels.moderate}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Active (daily exercise)</TableCell>
                          <TableCell align="right">{result.activityLevels.active}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Very Active (intense exercise 6-7 times/week)</TableCell>
                          <TableCell align="right">{result.activityLevels.veryActive}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    About BMR
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    BMR is the number of calories your body burns to maintain vital functions like breathing, 
                    cell production, blood circulation, and basic neurological functions.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200 }}>
                <Typography variant="body1" color="text.secondary">
                  Enter your measurements to see your BMR and daily calorie needs
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BMRCalculator;
