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
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import CodeIcon from '@mui/icons-material/Code';

const BMICalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    unit: 'metric',
  });

  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(window.location.href);
  const [embedCode] = useState(`<iframe
  src="${window.location.origin}/bmi-calculator"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 1px solid #ccc; border-radius: 4px;"
  title="BMI Calculator"
></iframe>`);

  const [result, setResult] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleCloseCopied = () => {
    setCopied(false);
  };

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
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: 0,
                }}
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
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: 0,
                }}
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

      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="sharing options">
            <Tab icon={<ShareIcon />} label="Share Link" />
            <Tab icon={<CodeIcon />} label="Embed" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Share this BMI Calculator
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                {shareUrl}
              </Typography>
              <IconButton onClick={() => handleCopy(shareUrl)} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Embed this calculator on your website
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {embedCode}
              </Typography>
              <IconButton onClick={() => handleCopy(embedCode)} size="small">
                <ContentCopyIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: The embedded calculator will inherit your website's styles. You can adjust the width and height as needed.
            </Typography>
          </Box>
        )}
      </Paper>

      <InfoSection title="Understanding BMI (Body Mass Index)">
        <Typography variant="body1">
          BMI (Body Mass Index) is a widely used screening tool that helps assess body weight categories and potential health risks. It's calculated using your height and weight measurements.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          BMI Categories:
        </Typography>
        <Typography variant="body1" component="div">
          • Underweight: Less than 18.5 - May indicate nutritional deficiencies or other health issues
          • Normal Weight: 18.5 to 24.9 - Associated with lowest health risks for most people
          • Overweight: 25 to 29.9 - May increase risk of health problems
          • Obese: 30 or greater - Higher risk of several health conditions
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Considerations:
        </Typography>
        <Typography variant="body1">
          • BMI is a screening tool, not a diagnostic measure
          • It doesn't account for muscle mass, bone density, age, or gender
          • Athletes and muscular individuals may have high BMIs despite healthy body composition
          • Elderly individuals may need different BMI interpretations
          • Some ethnic groups may have different healthy BMI ranges
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          When to Consult a Healthcare Provider:
        </Typography>
        <Typography variant="body1">
          • If your BMI is outside the normal range
          • Before starting any weight loss or gain program
          • If you have concerns about your weight or body composition
          • For personalized health advice based on your individual circumstances
        </Typography>
      </InfoSection>

      <Snackbar open={copied} autoHideDuration={2000} onClose={handleCloseCopied}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BMICalculator;
