import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

const VoriciCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    desiredRed: '0',
    desiredGreen: '0',
    desiredBlue: '0',
    currentSockets: '3',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user makes changes
    setError(null);
  };

  const validateInput = () => {
    const red = parseInt(formData.desiredRed);
    const green = parseInt(formData.desiredGreen);
    const blue = parseInt(formData.desiredBlue);
    const totalSockets = parseInt(formData.currentSockets);
    const totalDesired = red + green + blue;

    if (isNaN(red) || isNaN(green) || isNaN(blue)) {
      return {
        isValid: false,
        error: 'All socket values must be valid numbers'
      };
    }

    if (red < 0 || green < 0 || blue < 0) {
      return {
        isValid: false,
        error: 'Socket values cannot be negative'
      };
    }

    if (totalDesired > totalSockets) {
      return {
        isValid: false,
        error: `Total desired sockets (${totalDesired}) exceeds available sockets (${totalSockets})`,
        details: {
          red: `Red: ${red}`,
          green: `Green: ${green}`,
          blue: `Blue: ${blue}`,
          total: `Total: ${totalDesired}/${totalSockets}`
        }
      };
    }

    if (totalDesired === 0) {
      return {
        isValid: false,
        error: 'At least one socket color must be specified'
      };
    }

    return { isValid: true };
  };

  const calculateChromatics = () => {
    const validation = validateInput();
    if (!validation.isValid) {
      setError(validation);
      setResult(null);
      return;
    }

    const red = parseInt(formData.desiredRed);
    const green = parseInt(formData.desiredGreen);
    const blue = parseInt(formData.desiredBlue);
    const totalSockets = parseInt(formData.currentSockets);

    try {
      const probability = calculateProbability(red, green, blue, totalSockets);
      const attempts = Math.ceil(1 / probability);
      const chromatics = attempts * 4; // 4 chromatics per attempt

      setResult({
        probability: (probability * 100).toFixed(2),
        attempts: attempts,
        chromatics: chromatics,
        offColors: totalSockets - (red + green + blue)
      });
      setError(null);
    } catch (err) {
      setError({
        isValid: false,
        error: 'Calculation error occurred',
        details: { message: err.message }
      });
      setResult(null);
    }
  };

  const calculateProbability = (red, green, blue, total) => {
    if (red + green + blue > total) return 0;
    
    let probability = 1;
    let remaining = total;
    
    if (red > 0) {
      probability *= choose(remaining, red) * Math.pow(0.34, red);
      remaining -= red;
    }
    
    if (green > 0) {
      probability *= choose(remaining, green) * Math.pow(0.33, green);
      remaining -= green;
    }
    
    if (blue > 0) {
      probability *= choose(remaining, blue) * Math.pow(0.33, blue);
      remaining -= blue;
    }
    
    return probability;
  };

  const choose = (n, k) => {
    if (k > n) return 0;
    if (k === 0) return 1;
    return (n * choose(n - 1, k - 1)) / k;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateChromatics();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>Vorici Calculator - Calculate Chromatic Orb Crafting Costs</title>
        <meta name="description" content="Calculate the optimal number of chromatic orbs needed for desired socket colors in Path of Exile using the Vorici method." />
      </Helmet>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3, fontWeight: 600 }}>
        Vorici Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Socket Configuration
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
              >
                <AlertTitle>Error</AlertTitle>
                {error.error}
                {error.details && (
                  <Box sx={{ mt: 1, pl: 1 }}>
                    {Object.entries(error.details).map(([key, value]) => (
                      <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
                        {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Total Sockets</FormLabel>
                <Select
                  name="currentSockets"
                  value={formData.currentSockets}
                  onChange={handleInputChange}
                  size="small"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Desired Red Sockets"
                type="number"
                name="desiredRed"
                value={formData.desiredRed}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, max: formData.currentSockets }}
                error={error && error.details?.red}
              />

              <TextField
                label="Desired Green Sockets"
                type="number"
                name="desiredGreen"
                value={formData.desiredGreen}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, max: formData.currentSockets }}
                error={error && error.details?.green}
              />

              <TextField
                label="Desired Blue Sockets"
                type="number"
                name="desiredBlue"
                value={formData.desiredBlue}
                onChange={handleInputChange}
                fullWidth
                required
                size="small"
                inputProps={{ min: 0, max: formData.currentSockets }}
                error={error && error.details?.blue}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Calculate Cost
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Crafting Results
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {result ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Success Probability
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.probability}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chance of getting desired colors in one attempt
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Expected Cost
                  </Typography>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {result.chromatics}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chromatic Orbs needed (average)
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Crafting Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <Typography variant="body2">Expected Attempts: {result.attempts}</Typography>
                    <Typography variant="body2">Off-Color Sockets: {result.offColors}</Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Note: These are average values. Actual results may vary due to RNG.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <Typography variant="body1">
                  Enter your desired socket colors to calculate crafting costs
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Vorici Chromatic Calculator">
        <Typography variant="body1">
          The Vorici Chromatic Calculator helps Path of Exile players determine the most efficient way to obtain desired socket colors on items using the crafting bench. This tool optimizes your chromatic orb usage by calculating the best crafting method based on item requirements and desired socket colors.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Socket Color Mechanics:
        </Typography>
        <Typography variant="body1">
          • Red sockets favor Strength requirements
          • Green sockets favor Dexterity requirements
          • Blue sockets favor Intelligence requirements
          • Off-color sockets are harder to obtain
          • Item requirements influence socket color probabilities
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Crafting Methods:
        </Typography>
        <Typography variant="body1">
          • Regular Chromatic Orbs: Random color changes
          • Crafting Bench: Guaranteed socket numbers
          • Harvest Crafting: Targeted color changes
          • Vorici in Research: White socket chances
          • Socket Recipe: Specific color combinations
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Cost Considerations:
        </Typography>
        <Typography variant="body1">
          • Chromatic Orb market value
          • Crafting bench recipe costs
          • Average attempts needed
          • Alternative crafting methods
          • Time investment versus buying ready items
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Advanced Tips:
        </Typography>
        <Typography variant="body1">
          • Consider item level requirements
          • Check for cheaper alternative items
          • Calculate cost versus trade prices
          • Save difficult combinations for endgame
          • Use bench crafts for guaranteed results
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • Results are probability-based
          • Actual costs may vary
          • Game patches may affect calculations
          • Consider league economy
          • Some combinations are extremely rare
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default VoriciCalculator;
