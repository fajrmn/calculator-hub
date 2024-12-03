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
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

const BodyFatCalculator = () => {
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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Helmet>
        <title>Body Fat Calculator - Calculator Hub</title>
        <meta name="description" content="Calculate your body fat percentage using the U.S. Navy method or BMI method." />
      </Helmet>

      <Typography variant="h4" gutterBottom>
        Body Fat Calculator
      </Typography>

      <Typography variant="body1" paragraph>
        Calculate your body fat percentage using the U.S. Navy method. For the most accurate results, measure all circumferences at the widest point and to the nearest 0.5 cm.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Body Fat Categories:
          </Typography>
          <Typography variant="body2" component="div">
            <strong>For Men:</strong>
            <ul>
              <li>Essential Fat: 2-5%</li>
              <li>Athletes: 6-13%</li>
              <li>Fitness: 14-17%</li>
              <li>Average: 18-24%</li>
              <li>Obese: 25% and higher</li>
            </ul>
            <strong>For Women:</strong>
            <ul>
              <li>Essential Fat: 10-13%</li>
              <li>Athletes: 14-20%</li>
              <li>Fitness: 21-24%</li>
              <li>Average: 25-31%</li>
              <li>Obese: 32% and higher</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
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

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
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
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Calculate
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClear}
                size="large"
              >
                Clear
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BodyFatCalculator;
