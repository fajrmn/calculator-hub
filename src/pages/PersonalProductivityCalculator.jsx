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
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

// Sample country data with average annual salaries in USD and standard weekly work hours
const countryData = {
  'United States': { avgSalary: 75000, workHours: 40 },
  'India': { avgSalary: 15000, workHours: 48 },
  'China': { avgSalary: 20000, workHours: 44 },
  'Brazil': { avgSalary: 18000, workHours: 44 },
  'Indonesia': { avgSalary: 12000, workHours: 40 },
  'Pakistan': { avgSalary: 8000, workHours: 48 },
  'Bangladesh': { avgSalary: 6000, workHours: 48 },
  'Nigeria': { avgSalary: 7000, workHours: 42 },
  'Philippines': { avgSalary: 9000, workHours: 48 },
  'Mexico': { avgSalary: 16000, workHours: 48 },
  'United Kingdom': { avgSalary: 47000, workHours: 37.5 },
  'Canada': { avgSalary: 58000, workHours: 37.5 },
  'Australia': { avgSalary: 65000, workHours: 38 },
  'Germany': { avgSalary: 53000, workHours: 35 },
  'France': { avgSalary: 48000, workHours: 35 },
  'Japan': { avgSalary: 42000, workHours: 40 },
  'Singapore': { avgSalary: 60000, workHours: 44 },
  'Switzerland': { avgSalary: 85000, workHours: 40 },
  'Netherlands': { avgSalary: 52000, workHours: 36 },
  'Sweden': { avgSalary: 51000, workHours: 37.5 },
  'Ireland': { avgSalary: 55000, workHours: 39 },
  'New Zealand': { avgSalary: 50000, workHours: 40 },
  'Spain': { avgSalary: 35000, workHours: 36 },
  'Italy': { avgSalary: 37000, workHours: 38 },
  'South Korea': { avgSalary: 40000, workHours: 52 },
};

const PersonalProductivityCalculator = () => {
  const [values, setValues] = useState({
    dailyHours: '',
    dailyIncome: '',
    country: '',
  });

  const [results, setResults] = useState({
    productivityScore: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    salaryComparison: 0,
    nationalAverage: 0,
  });

  const handleInputChange = (field) => (event) => {
    const newValue = event.target.value;
    // Add input validation
    if (field === 'dailyHours' && (newValue < 0 || newValue > 24)) {
      return;
    }
    if (field === 'dailyIncome' && newValue < 0) {
      return;
    }
    setValues((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  useEffect(() => {
    if (!values.country || !values.dailyHours || !values.dailyIncome) return;

    const dailyHours = Math.min(parseFloat(values.dailyHours) || 0, 24);
    const dailyIncome = Math.max(parseFloat(values.dailyIncome) || 0, 0);
    const countryInfo = countryData[values.country];

    // Calculate weekly and monthly hours (assuming 5 working days per week, 4 weeks per month)
    const weeklyHours = dailyHours * 5;
    const monthlyHours = weeklyHours * 4;

    // Calculate annual income (assuming 52 weeks, accounting for holidays and vacation)
    const workingWeeks = 48; // Assuming 4 weeks of holidays/vacation
    const annualIncome = dailyIncome * 5 * workingWeeks;

    // Calculate productivity score based on hours worked vs. country average
    const standardDailyHours = countryInfo.workHours / 5;
    const productivityScore = (dailyHours / standardDailyHours) * 100;

    // Calculate salary comparison (percentage above/below national average)
    const salaryComparison = ((annualIncome - countryInfo.avgSalary) / countryInfo.avgSalary) * 100;

    setResults({
      productivityScore: Math.min(productivityScore, 150), // Cap at 150%
      weeklyHours: Math.round(weeklyHours * 10) / 10,
      monthlyHours: Math.round(monthlyHours * 10) / 10,
      salaryComparison: Math.round(salaryComparison * 10) / 10,
      nationalAverage: countryInfo.avgSalary,
    });
  }, [values]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const getProductivityMessage = (score) => {
    if (score >= 140) return "🚀 Whoa! Are you secretly three people in a trench coat?";
    if (score >= 120) return "⚡ You're on fire! Remember to stay hydrated, superhero!";
    if (score >= 100) return "💪 Crushing it! Your coffee machine must be proud!";
    if (score >= 80) return "👍 Solid work! You've found the perfect work-life balance!";
    if (score >= 60) return "🌴 Living the dream! Work smarter, not harder!";
    return "🐢 Slow and steady wins the race... sometimes!";
  };

  const getSalaryMessage = (comparison) => {
    if (comparison >= 100) return "💰 Cha-ching! You're making it rain!";
    if (comparison >= 50) return "🎯 Look at you, money maestro!";
    if (comparison >= 0) return "📈 Above average! Time for a happy dance!";
    if (comparison >= -25) return "🌱 Growing strong! Keep climbing that ladder!";
    if (comparison >= -50) return "🎮 Plot twist: Money isn't everything!";
    return "🌈 Hey, at least you're not working for exposure!";
  };

  const getWorkHoursMessage = (weeklyHours) => {
    if (weeklyHours >= 60) return "⚠️ Your chair misses you!";
    if (weeklyHours >= 50) return "🏃 Marathon, not a sprint!";
    if (weeklyHours >= 40) return "⭐ Classic 9-to-5 warrior!";
    if (weeklyHours >= 30) return "🎭 Part-time pro!";
    if (weeklyHours >= 20) return "🎨 Living that flexible life!";
    return "🦥 Work smarter, not harder!";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>Personal Productivity Calculator - Calculator Hub</title>
        <meta
          name="description"
          content="Calculate your personal productivity score and compare your earnings with national averages."
        />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Personal Productivity Calculator
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
                label="Daily Working Hours"
                value={values.dailyHours}
                onChange={handleInputChange('dailyHours')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                }}
                placeholder="Enter your daily working hours"
              />

              <TextField
                label="Daily Income (USD)"
                value={values.dailyIncome}
                onChange={handleInputChange('dailyIncome')}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                placeholder="Enter your daily income in USD"
              />

              <TextField
                select
                label="Country"
                value={values.country}
                onChange={handleInputChange('country')}
                fullWidth
                placeholder="Select your country"
              >
                {Object.keys(countryData).map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
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
                  Productivity Score
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                  <CircularProgress
                    variant="determinate"
                    value={Math.min(results.productivityScore, 100)}
                    size={80}
                    thickness={4}
                    sx={{ color: 'primary.main' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" color="text.secondary">
                      {formatPercentage(results.productivityScore)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium' }}>
                  {getProductivityMessage(results.productivityScore)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on your country's average work hours
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Working Hours
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h5" color="primary">
                      {results.weeklyHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Weekly Hours
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" color="primary">
                      {results.monthlyHours}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Hours
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body1" color="primary" sx={{ mt: 1, fontWeight: 'medium' }}>
                  {getWorkHoursMessage(results.weeklyHours)}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Income Comparison
                </Typography>
                <Typography variant="h5" color="primary">
                  {results.salaryComparison > 0 ? '+' : ''}
                  {formatPercentage(results.salaryComparison)}
                </Typography>
                <Typography variant="body1" color="primary" sx={{ fontWeight: 'medium' }}>
                  {getSalaryMessage(results.salaryComparison)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compared to national average of {formatCurrency(results.nationalAverage)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Personal Productivity">
        <Typography variant="body1" paragraph>
          The Personal Productivity Calculator helps you understand your work efficiency and income potential compared to national averages.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Productivity Score:
        </Typography>
        <Typography variant="body1" paragraph>
          • Compares your daily work hours to your country's average
          • Score above 100% indicates you work more than average
          • Score below 100% indicates you work less than average
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Working Hours:
        </Typography>
        <Typography variant="body1" paragraph>
          • Weekly hours calculation assumes a 5-day work week
          • Monthly hours calculation assumes 4 weeks per month
          • Compare these with standard working hours in your industry
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Income Comparison:
        </Typography>
        <Typography variant="body1" paragraph>
          • Shows how your annual income compares to the national average
          • Positive percentage indicates above-average earnings
          • Negative percentage indicates below-average earnings
          • Consider factors like experience, industry, and location
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • All calculations are estimates based on provided inputs
          • All monetary values are in USD (United States Dollars)
          • National averages are approximate and may vary significantly by region and city
          • Consider local cost of living and purchasing power differences
          • Working hours vary by country due to different labor laws and customs
          • Salary data is based on general averages and may not reflect specific industries or roles
          • Some countries may have different standard work weeks (e.g., 48 hours in some Asian countries)
          • Use this tool for personal reference and goal setting
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default PersonalProductivityCalculator;
