import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Checkbox,
  Divider,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import weekday from 'dayjs/plugin/weekday';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);

const DateCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for Days Between Dates calculator
  const [betweenDates, setBetweenDates] = useState({
    startDate: null,
    endDate: null,
    includeEndDay: false,
  });

  // State for Add/Subtract calculator
  const [dateModification, setDateModification] = useState({
    startDate: null,
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    businessDays: false,
  });

  // State for results and errors
  const [betweenResult, setBetweenResult] = useState(null);
  const [modificationResult, setModificationResult] = useState(null);
  const [error, setError] = useState(null);

  const calculateDaysBetween = () => {
    try {
      if (!betweenDates.startDate || !betweenDates.endDate) {
        setError('Please select both start and end dates');
        return;
      }

      setError(null);
      const start = dayjs(betweenDates.startDate);
      const end = dayjs(betweenDates.endDate);

      if (end.isBefore(start)) {
        setError('End date must be after start date');
        return;
      }

      // Add one day if includeEndDay is true before calculations
      const adjustedEnd = betweenDates.includeEndDay ? end.add(1, 'day') : end;
      
      const years = adjustedEnd.diff(start, 'year');
      const months = adjustedEnd.diff(start, 'month') % 12;
      const weeks = Math.floor(adjustedEnd.diff(start, 'week') % 4);
      const days = adjustedEnd.diff(start, 'day') % 7;
      const totalDays = adjustedEnd.diff(start, 'day');

      setBetweenResult({
        years,
        months,
        weeks,
        days,
        totalDays,
      });
    } catch (err) {
      setError('Error calculating dates. Please try again.');
    }
  };

  const calculateModifiedDate = () => {
    try {
      if (!dateModification.startDate) {
        setError('Please select a start date');
        return;
      }

      setError(null);
      let result = dayjs(dateModification.startDate);

      if (dateModification.businessDays) {
        // Add business days (skip weekends)
        let totalDays = (dateModification.weeks * 5) + dateModification.days; // Convert weeks to business days
        let remainingDays = totalDays;
        let currentDate = result;
        
        while (remainingDays !== 0) {
          currentDate = currentDate.add(remainingDays > 0 ? 1 : -1, 'day');
          // Skip weekends (0 is Sunday, 6 is Saturday)
          if (currentDate.day() !== 0 && currentDate.day() !== 6) {
            remainingDays = remainingDays > 0 ? remainingDays - 1 : remainingDays + 1;
          }
        }
        
        // Add years and months normally since they don't affect business days calculation
        result = currentDate
          .add(dateModification.years, 'year')
          .add(dateModification.months, 'month');
      } else {
        // Regular date addition/subtraction
        result = result
          .add(dateModification.years, 'year')
          .add(dateModification.months, 'month')
          .add(dateModification.weeks, 'week')
          .add(dateModification.days, 'day');
      }

      setModificationResult(result);
    } catch (err) {
      setError('Error modifying date. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setDateModification(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>Date Calculator - Calculator Hub</title>
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Date Calculator
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Days Between Dates Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Days Between Two Dates
        </Typography>
        <Grid container spacing={3}>
          {/* Left Column - Inputs */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <DatePicker
                    label="Start Date"
                    value={betweenDates.startDate}
                    onChange={(newValue) => setBetweenDates(prev => ({ ...prev, startDate: newValue }))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={betweenDates.endDate}
                    onChange={(newValue) => setBetweenDates(prev => ({ ...prev, endDate: newValue }))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={betweenDates.includeEndDay}
                        onChange={(e) => setBetweenDates(prev => ({ ...prev, includeEndDay: e.target.checked }))}
                      />
                    }
                    label="Include end day"
                  />
                  <Button
                    variant="contained"
                    onClick={calculateDaysBetween}
                    fullWidth
                    size="large"
                  >
                    Calculate Duration
                  </Button>
                </Box>
              </LocalizationProvider>
            </Paper>
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Duration Results
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {betweenResult ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Years
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {betweenResult.years}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Months
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {betweenResult.months}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Weeks
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {betweenResult.weeks}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Days
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {betweenResult.days}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Days
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {betweenResult.totalDays}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Select dates and calculate to see results
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Add/Subtract Date Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Add to or Subtract from a Date
        </Typography>
        <Grid container spacing={3}>
          {/* Left Column - Inputs */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <DatePicker
                    label="Start Date"
                    value={dateModification.startDate}
                    onChange={(newValue) => setDateModification(prev => ({ ...prev, startDate: newValue }))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Years"
                        type="number"
                        value={dateModification.years}
                        onChange={(e) => handleInputChange('years', parseInt(e.target.value) || 0)}
                        placeholder="+2 or -2"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Months"
                        type="number"
                        value={dateModification.months}
                        onChange={(e) => handleInputChange('months', parseInt(e.target.value) || 0)}
                        placeholder="+3 or -3"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Weeks"
                        type="number"
                        value={dateModification.weeks}
                        onChange={(e) => handleInputChange('weeks', parseInt(e.target.value) || 0)}
                        placeholder="+4 or -4"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Days"
                        type="number"
                        value={dateModification.days}
                        onChange={(e) => handleInputChange('days', parseInt(e.target.value) || 0)}
                        placeholder="+5 or -5"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dateModification.businessDays}
                        onChange={(e) => setDateModification(prev => ({ ...prev, businessDays: e.target.checked }))}
                      />
                    }
                    label="Calculate in business days (skip weekends)"
                  />
                  <Button
                    variant="contained"
                    onClick={calculateModifiedDate}
                    fullWidth
                    size="large"
                  >
                    Calculate New Date
                  </Button>
                </Box>
              </LocalizationProvider>
            </Paper>
          </Grid>

          {/* Right Column - Results */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Modified Date Result
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {modificationResult ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {modificationResult.format('MMMM D, YYYY')}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {modificationResult.format('dddd')}
                  </Typography>
                  {dateModification.businessDays && (
                    <Typography variant="body2" color="text.secondary">
                      (Business days calculation)
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  Select a date and modify to see results
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <InfoSection title="Understanding Date Calculator">
        <Typography variant="body1">
          The Date Calculator is a comprehensive tool designed to help you perform various date-related calculations. Whether you need to find the duration between dates or calculate a future/past date, this calculator provides accurate results while accounting for complex calendar rules.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Days Between Dates:
        </Typography>
        <Typography variant="body1">
          • Calculates exact duration between two dates
          • Breaks down the result into years, months, weeks, and days
          • Option to include or exclude the end date
          • Handles leap years automatically
          • Shows total number of days for precise measurements
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Date Modification:
        </Typography>
        <Typography variant="body1">
          • Add or subtract time units from a date
          • Supports years, months, weeks, and days
          • Use positive numbers to move forward in time
          • Use negative numbers to move backward in time
          • Business days option skips weekends
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Calendar Rules Handled:
        </Typography>
        <Typography variant="body1">
          • Leap years (February 29th)
          • Varying month lengths (28-31 days)
          • Century rules for leap years
          • Week calculations across month boundaries
          • Business day calculations excluding weekends
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Common Use Cases:
        </Typography>
        <Typography variant="body1">
          • Project timeline planning
          • Age calculations
          • Contract duration calculations
          • Deadline management
          • Payment period calculations
          • Event planning
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • All calculations use the Gregorian calendar
          • Business days exclude Saturday and Sunday
          • Month calculations account for varying lengths
          • Date modifications maintain the same time of day
          • Results are timezone-aware
        </Typography>
      </InfoSection>

    </Container>
  );
};

export default DateCalculator;
