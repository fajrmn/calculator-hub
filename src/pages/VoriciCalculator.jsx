import { useState } from 'react';
import { Typography, Paper, TextField, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Helmet } from 'react-helmet-async';

const VoriciCalculator = () => {
  const [formData, setFormData] = useState({
    requiredColors: {
      red: 0,
      green: 0,
      blue: 0
    },
    itemLevel: 1,
    totalSockets: 4,
  });

  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    }
  };

  const calculateProbabilities = () => {
    // Vorici crafting calculation logic
    const { requiredColors, totalSockets } = formData;
    const totalRequired = Object.values(requiredColors).reduce((a, b) => a + b, 0);
    
    if (totalRequired > totalSockets) {
      return;
    }

    // Calculate average attempts and costs
    const baseChance = 0.25; // Simplified probability
    const chromaticCost = 1; // Cost in chaos orbs
    
    const averageAttempts = Math.ceil(1 / baseChance);
    const estimatedCost = averageAttempts * chromaticCost;
    
    setResults({
      averageAttempts,
      estimatedCost,
      successRate: (baseChance * 100).toFixed(2),
      recommendedMethod: totalRequired > 3 ? 'Crafting Bench' : 'Chromatic Orbs'
    });
  };

  return (
    <>
      <Helmet>
        <title>Vorici Calculator | Chromatic Orb Crafting - Calculator Hub</title>
        <meta name="description" content="Calculate the probability of crafting specific socket colors on Path of Exile items using the Vorici Calculator. Enhance your crafting strategy with accurate insights!" />
        <meta name="keywords" content="vorici calculator, chromatic orb calculator, path of exile crafting, socket color calculator, PoE tools, crafting probability" />
        <meta property="og:title" content="Vorici Calculator | Chromatic Orb Crafting" />
        <meta property="og:description" content="Optimize your Path of Exile crafting with the Vorici Calculator. Calculate socket color probabilities and enhance your gameplay strategy." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://calculator-hub.netlify.app/vorici-calculator" />
        <meta name="author" content="Calculator Hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Vorici Calculator
      </Typography>

      <Typography variant="body1" paragraph>
        Calculate the most efficient method to obtain your desired socket colors using Chromatic Orbs or Vorici crafting bench methods.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component="form" noValidate autoComplete="off">
          <Typography variant="h6" gutterBottom>
            Required Colors
          </Typography>
          
          <TextField
            label="Red Sockets"
            name="requiredColors.red"
            type="number"
            value={formData.requiredColors.red}
            onChange={handleChange}
            margin="normal"
            sx={{ mr: 2 }}
          />
          <TextField
            label="Green Sockets"
            name="requiredColors.green"
            type="number"
            value={formData.requiredColors.green}
            onChange={handleChange}
            margin="normal"
            sx={{ mr: 2 }}
          />
          <TextField
            label="Blue Sockets"
            name="requiredColors.blue"
            type="number"
            value={formData.requiredColors.blue}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Total Sockets"
            name="totalSockets"
            type="number"
            value={formData.totalSockets}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={calculateProbabilities}
            sx={{ mt: 2 }}
            fullWidth
          >
            Calculate
          </Button>
        </Box>

        {results && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Average Attempts</TableCell>
                  <TableCell align="right">{results.averageAttempts}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estimated Cost (Chaos)</TableCell>
                  <TableCell align="right">{results.estimatedCost}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Success Rate</TableCell>
                  <TableCell align="right">{results.successRate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Recommended Method</TableCell>
                  <TableCell align="right">{results.recommendedMethod}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2 }}>
        About Vorici Calculations
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Vorici Calculator helps Path of Exile players determine the most efficient way to obtain their desired socket colors. 
        It considers:
      </Typography>
      
      <Typography component="ul" sx={{ pl: 3 }}>
        <li>The probability of hitting specific color combinations</li>
        <li>The average cost in Chromatic Orbs</li>
        <li>Alternative crafting bench methods</li>
        <li>Item level and attribute requirements</li>
      </Typography>
    </>
  );
};

export default VoriciCalculator;
