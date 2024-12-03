import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  MenuItem,
  InputAdornment,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

const COLLEGE_TYPES = {
  'public-2year': { name: '2-year public college', cost: 12000 },
  'public-4year-in': { name: '4-year in-state public college', cost: 28840 },
  'public-4year-out': { name: '4-year out-of-state public college', cost: 45000 },
  'private-4year': { name: '4-year private college', cost: 55000 },
};

const DEFAULT_VALUES = {
  collegeType: 'public-4year-in',
  currentCost: 28840,
  costIncrease: 5,
  yearsUntilCollege: 10,
  collegeDuration: 4,
  savingsPercent: 35,
  currentSavings: 0,
  returnRate: 5,
  taxRate: 25,
};

const EducationSavingsCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (prop) => (event) => {
    const value = event.target.value;
    setValues(prev => {
      const newValues = { ...prev, [prop]: value };
      if (prop === 'collegeType') {
        newValues.currentCost = COLLEGE_TYPES[value].cost;
      }
      return newValues;
    });
  };

  const calculateSavings = () => {
    try {
      // Validate inputs
      if (values.yearsUntilCollege < 0 || values.collegeDuration < 1) {
        throw new Error('Please enter valid years');
      }

      // Calculate future cost
      const futureAnnualCost = values.currentCost * Math.pow(1 + values.costIncrease / 100, values.yearsUntilCollege);
      const totalCost = futureAnnualCost * values.collegeDuration;
      
      // Calculate amount needed from savings
      const savingsNeeded = totalCost * (values.savingsPercent / 100);
      
      // Calculate future value of current savings
      const futureSavings = values.currentSavings * Math.pow(1 + (values.returnRate * (1 - values.taxRate / 100)) / 100, values.yearsUntilCollege);
      
      // Calculate additional savings needed
      const additionalSavingsNeeded = savingsNeeded - futureSavings;
      
      // Calculate monthly savings needed
      const monthlyRate = (values.returnRate * (1 - values.taxRate / 100)) / 1200; // Monthly rate accounting for taxes
      const months = values.yearsUntilCollege * 12;
      const monthlyPayment = additionalSavingsNeeded > 0 
        ? (additionalSavingsNeeded * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
        : 0;

      setResults({
        futureAnnualCost: Math.round(futureAnnualCost),
        totalCost: Math.round(totalCost),
        savingsNeeded: Math.round(savingsNeeded),
        futureSavings: Math.round(futureSavings),
        additionalSavingsNeeded: Math.round(additionalSavingsNeeded),
        monthlySavingsNeeded: Math.round(monthlyPayment),
      });
      setError('');
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const handleReset = () => {
    setValues(DEFAULT_VALUES);
    setResults(null);
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>Children's Education Calculator | Plan College Savings - Calculator Hub</title>
        <meta name="description" content="Plan for your child's education with our College Savings Calculator. Calculate future college costs and determine monthly savings needed for your children's education." />
        <meta name="keywords" content="education calculator, college savings, tuition planning, education cost, college fund calculator" />
      </Helmet>

      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: 4,
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: 2
        }}
      >
        💸 Children's Education Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Input Form */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Education Cost Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                select
                label="College Type"
                value={values.collegeType}
                onChange={handleInputChange('collegeType')}
                fullWidth
              >
                {Object.entries(COLLEGE_TYPES).map(([key, { name }]) => (
                  <MenuItem key={key} value={key}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Current Annual Cost"
                value={values.currentCost}
                onChange={handleInputChange('currentCost')}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Expected Cost Increase Rate"
                value={values.costIncrease}
                onChange={handleInputChange('costIncrease')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Years Until College"
                value={values.yearsUntilCollege}
                onChange={handleInputChange('yearsUntilCollege')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="College Duration"
                value={values.collegeDuration}
                onChange={handleInputChange('collegeDuration')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Percent of Costs from Savings"
                value={values.savingsPercent}
                onChange={handleInputChange('savingsPercent')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Current Savings"
                value={values.currentSavings}
                onChange={handleInputChange('currentSavings')}
                type="number"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Expected Return Rate"
                value={values.returnRate}
                onChange={handleInputChange('returnRate')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <TextField
                label="Tax Rate"
                value={values.taxRate}
                onChange={handleInputChange('taxRate')}
                type="number"
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateSavings}
                  fullWidth
                >
                  Calculate
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  fullWidth
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Results */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              height: '100%',
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Education Savings Results
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {results && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1">
                  Future Annual College Cost:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.futureAnnualCost.toLocaleString()}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1">
                  Total College Cost:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.totalCost.toLocaleString()}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1">
                  Amount Needed from Savings:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.savingsNeeded.toLocaleString()}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1">
                  Future Value of Current Savings:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.futureSavings.toLocaleString()}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1">
                  Additional Savings Needed:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.additionalSavingsNeeded.toLocaleString()}
                  </Typography>
                </Typography>

                <Typography variant="subtitle1">
                  Monthly Savings Required:
                  <Typography component="span" variant="h6" color="primary" sx={{ ml: 1 }}>
                    ${results.monthlySavingsNeeded.toLocaleString()}
                  </Typography>
                </Typography>
              </Box>
            )}

            {!results && !error && (
              <Typography color="text.secondary" align="center">
                Enter your details and click Calculate to see the results
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Education Savings">
        <Typography variant="body1">
          The Education Savings Calculator helps parents and guardians plan for their children's future education expenses. This comprehensive tool considers various factors affecting college costs and savings strategies.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Types of College Expenses:
        </Typography>
        <Typography variant="body1">
          • Tuition and Fees: Primary educational costs
          • Room and Board: Housing and meal expenses
          • Books and Supplies: Academic materials
          • Personal Expenses: Daily living costs
          • Transportation: Travel and commuting expenses
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Savings Options and Strategies:
        </Typography>
        <Typography variant="body1">
          • 529 Plans: Tax-advantaged education savings accounts
          • Coverdell ESAs: Educational savings accounts with tax benefits
          • UGMA/UTMA Accounts: Custodial accounts for minors
          • Savings Bonds: Government-backed securities
          • Regular Investment Accounts: Flexible savings options
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Factors Affecting College Costs:
        </Typography>
        <Typography variant="body1">
          • Institution Type: Public vs. private, 2-year vs. 4-year
          • Location: In-state vs. out-of-state tuition
          • College Cost Inflation: Historical average of 5-7% annually
          • Financial Aid: Grants, scholarships, and loans
          • Economic Conditions: Market performance and inflation
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Smart Saving Tips:
        </Typography>
        <Typography variant="body1">
          • Start saving early to maximize compound interest
          • Consider tax-advantaged savings options
          • Regularly review and adjust savings strategy
          • Research financial aid opportunities
          • Balance education savings with other financial goals
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default EducationSavingsCalculator;
