import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  LinearProgress,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const BodyFatCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [results, setResults] = useState(null);

  const calculateBodyFat = () => {
    // Convert measurements to numbers
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);

    // Calculate body fat using U.S. Navy method
    let bodyFatPercentage;
    if (gender === 'male') {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistNum - neckNum) + 0.15456 * Math.log10(heightNum)) - 450;
    } else {
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistNum - neckNum) + 0.22100 * Math.log10(heightNum)) - 450;
    }

    // Calculate other metrics
    const bodyFatMass = (weightNum * bodyFatPercentage) / 100;
    const leanBodyMass = weightNum - bodyFatMass;
    const idealBodyFat = gender === 'male' ? 10.5 : 18.5;
    const bodyFatToLose = Math.max(0, bodyFatMass - (weightNum * idealBodyFat / 100));

    // Determine category
    let category;
    if (gender === 'male') {
      if (bodyFatPercentage < 6) category = 'Essential';
      else if (bodyFatPercentage < 14) category = 'Athletes';
      else if (bodyFatPercentage < 18) category = 'Fitness';
      else if (bodyFatPercentage < 25) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFatPercentage < 14) category = 'Essential';
      else if (bodyFatPercentage < 21) category = 'Athletes';
      else if (bodyFatPercentage < 25) category = 'Fitness';
      else if (bodyFatPercentage < 32) category = 'Average';
      else category = 'Obese';
    }

    setResults({
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      category,
      bodyFatMass: bodyFatMass.toFixed(1),
      leanBodyMass: leanBodyMass.toFixed(1),
      idealBodyFat: idealBodyFat.toFixed(1),
      bodyFatToLose: bodyFatToLose.toFixed(1)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateBodyFat();
  };

  const handleClear = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setResults(null);
  };

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Body Fat Calculator - Calculator Hub</title>
        <meta name="description" content="Calculate your body fat percentage using the U.S. Navy method or BMI method." />
      </Helmet>

      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Body Fat Calculator
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Calculate your body fat percentage using the U.S. Navy method. For the most accurate results, measure all circumferences at the widest point and to the nearest 0.5 cm.
        </Typography>

        <Grid container spacing={3}>
          {/* Input Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <form onSubmit={handleSubmit}>
                <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Gender
                  </Typography>
                  <RadioGroup
                    row
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      fullWidth
                      placeholder="25"
                      helperText="Example: 25 years"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      fullWidth
                      placeholder="70"
                      helperText="Example: 70 kg"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Height (cm)"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      fullWidth
                      placeholder="178"
                      helperText="Example: 178 cm"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Neck Circumference (cm)"
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      required
                      fullWidth
                      placeholder="38"
                      helperText="Example: 38 cm (measure at the narrowest point)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Waist Circumference (cm)"
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      required
                      fullWidth
                      placeholder="85"
                      helperText="Example: 85 cm (measure at navel level)"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Calculate
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                    size="large"
                    fullWidth
                  >
                    Clear
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              {results ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" color="primary" gutterBottom>
                      Body Fat: {results.bodyFatPercentage}%
                    </Typography>
                    <Box sx={{ width: '100%', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, (parseFloat(results.bodyFatPercentage) / 40) * 100)}
                        sx={{
                          height: 20,
                          borderRadius: 1,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: parseFloat(results.bodyFatPercentage) > 25 ? 'error.main' : 'success.main',
                          },
                        }}
                      />
                    </Box>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Body Fat Category</TableCell>
                          <TableCell>{results.category}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Body Fat Mass</TableCell>
                          <TableCell>{results.bodyFatMass} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Lean Body Mass</TableCell>
                          <TableCell>{results.leanBodyMass} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Ideal Body Fat</TableCell>
                          <TableCell>{results.idealBodyFat}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Body Fat to Lose</TableCell>
                          <TableCell>{results.bodyFatToLose} kg</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    Enter your measurements to see the results
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Body Fat Categories Reference */}
        <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Body Fat Categories Reference
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                For Men:
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Essential Fat</TableCell>
                      <TableCell>2-5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Athletes</TableCell>
                      <TableCell>6-13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fitness</TableCell>
                      <TableCell>14-17%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average</TableCell>
                      <TableCell>18-24%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Obese</TableCell>
                      <TableCell>25% and higher</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                For Women:
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Essential Fat</TableCell>
                      <TableCell>10-13%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Athletes</TableCell>
                      <TableCell>14-20%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fitness</TableCell>
                      <TableCell>21-24%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Average</TableCell>
                      <TableCell>25-31%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Obese</TableCell>
                      <TableCell>32% and higher</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default BodyFatCalculator;