import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Snackbar
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { COMMON_CITIES } from '../data/commonCities';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const DEBOUNCE_DELAY = 150;

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' }
];

const SnowDayCalculator = () => {
  // Form States
  const [searchType, setSearchType] = useState('city');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [zipCode, setZipCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');

  // API States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [serverCitySuggestions, setServerCitySuggestions] = useState([]);

  // UI States
  const [shareSuccess, setShareSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Memoized city suggestions
  const instantCitySuggestions = useMemo(() => {
    if (!cityInputValue) return [];
    const searchTerm = cityInputValue.toLowerCase();
    const commonCities = COMMON_CITIES[selectedCountry] || [];
    return commonCities
      .filter(city => 
        city.name.toLowerCase().includes(searchTerm) ||
        (city.state && city.state.toLowerCase().includes(searchTerm))
      )
      .slice(0, 5)
      .map(city => ({ 
        ...city,
        displayName: `${city.name}, ${city.state}`,
        instant: true 
      }));
  }, [cityInputValue, selectedCountry]);

  const combinedSuggestions = useMemo(() => {
    const suggestions = [...instantCitySuggestions];
    if (serverCitySuggestions.length > 0) {
      suggestions.push(...serverCitySuggestions);
    }
    return suggestions;
  }, [instantCitySuggestions, serverCitySuggestions]);

  // API Calls
  const fetchCities = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) return;
    setLoadingCities(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setServerCitySuggestions(data.map(city => ({
        name: city.name,
        state: city.state,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        displayName: `${city.name}${city.state ? `, ${city.state}` : ''}`
      })));
    } catch (err) {
      console.error('Error fetching cities:', err);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityInputValue && !instantCitySuggestions.length) {
        fetchCities(cityInputValue);
      }
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [cityInputValue, fetchCities, instantCitySuggestions.length]);

  const calculateSnowDayProbability = useCallback((weatherData) => {
    const temp = weatherData.list[0].main.temp;
    const windSpeed = weatherData.list[0].wind.speed;
    const conditions = weatherData.list[0].weather[0].main.toLowerCase();

    let probability = 0;

    // Temperature factor (32°F = 0°C is freezing point)
    if (temp <= 30) probability += 40;
    else if (temp <= 32) probability += 30;
    else if (temp <= 34) probability += 20;
    else if (temp <= 36) probability += 10;

    // Wind speed factor
    if (windSpeed > 20) probability += 20;
    else if (windSpeed > 15) probability += 15;
    else if (windSpeed > 10) probability += 10;

    // Weather conditions factor
    if (conditions.includes('snow')) probability += 40;
    else if (conditions.includes('rain') && temp <= 34) probability += 30;
    else if (conditions.includes('cloud')) probability += 10;

    return Math.min(Math.max(probability, 0), 100);
  }, []);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!OPENWEATHER_API_KEY) {
        throw new Error('OpenWeather API key is not configured');
      }

      let coords;
      if (searchType === 'zip') {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${selectedCountry}&appid=${OPENWEATHER_API_KEY}`
        );
        if (!response.ok) throw new Error('Invalid ZIP code');
        coords = await response.json();
      } else {
        const searchQuery = cityName || cityInputValue;
        if (!searchQuery) throw new Error('Please enter a city name');
        
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery},${selectedCountry}&limit=1&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        if (!response.ok || !data.length) {
          throw new Error(`City "${searchQuery}" not found. Please try another city name.`);
        }
        coords = data[0];
      }

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
      );
      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
      const weatherData = await weatherResponse.json();
      
      setWeatherData(weatherData);
      setPrediction(calculateSnowDayProbability(weatherData));
      setError(''); // Clear any existing error when successful
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setWeatherData(null);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareText = `Snow Day Prediction for ${weatherData.city.name}: ${prediction}% chance of a snow day!\nTemperature: ${Math.round(weatherData.list[0].main.temp_min)}°F to ${Math.round(weatherData.list[0].main.temp_max)}°F\nConditions: ${weatherData.list[0].weather[0].description}`;
      await navigator.clipboard.writeText(shareText);
      setShareSuccess(true);
      setSnackbarOpen(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSearchTypeChange = (_, newValue) => {
    setSearchType(newValue);
    setError('');
    setPrediction(null);
    setWeatherData(null);
    setCityInputValue('');
    setZipCode('');
    setServerCitySuggestions([]);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setError('');
    setPrediction(null);
    setWeatherData(null);
    setCityInputValue('');
    setZipCode('');
    setServerCitySuggestions([]);
  };

  const handleCitySelect = (_, value) => {
    if (value && typeof value !== 'string') {
      setCityName(value.name);
      setCityInputValue(value.name);
    } else if (typeof value === 'string') {
      setCityName(value);
      setCityInputValue(value);
    } else {
      setCityName('');
      setCityInputValue('');
    }
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '400px 1fr' },
      gap: 2,
      p: 2,
      overflow: 'hidden'
    }}>
      <Helmet>
        <title>Snow Day Calculator - Calculator Hub</title>
        <meta name="description" content="Calculate the probability of a snow day based on weather conditions" />
      </Helmet>

      {/* Search Panel */}
      <Paper sx={{ 
        p: 3,
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" gutterBottom>
          ❄️ Snow Day Predictor
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Country</InputLabel>
          <Select
            value={selectedCountry}
            label="Country"
            onChange={handleCountryChange}
          >
            {COUNTRIES.map(country => (
              <MenuItem key={country.code} value={country.code}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tabs
          value={searchType}
          onChange={handleSearchTypeChange}
          centered
        >
          <Tab label="Search by ZIP" value="zip" />
          <Tab label="Search by City" value="city" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {searchType === 'zip' ? (
            <TextField
              fullWidth
              label="ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              error={!!error}
              helperText={error || ''}
              inputProps={{ maxLength: 5 }}
            />
          ) : (
            <Autocomplete
              fullWidth
              freeSolo
              options={combinedSuggestions}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.displayName}
              loading={loadingCities}
              inputValue={cityInputValue}
              onInputChange={(_, value) => {
                setCityInputValue(value || '');
                setError(''); // Clear error when user types
              }}
              onChange={handleCitySelect}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography>{option.displayName || option.name}</Typography>
                    {option.instant && (
                      <Typography variant="caption" color="text.secondary">
                        Instant Suggestion
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enter city name"
                  error={!!error}
                  helperText={error || ''}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCities && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}

          <Button
            variant="contained"
            type="submit"
            disabled={loading || (searchType === 'city' && !cityInputValue) || (searchType === 'zip' && !zipCode)}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Check Snow Day Probability'}
          </Button>
        </Box>
      </Paper>

      {/* Results Panel */}
      <Paper sx={{ 
        p: 3,
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: prediction === null ? 'center' : 'flex-start'
      }}>
        {prediction === null ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Enter a location to check snow day probability
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We'll analyze weather conditions and historical patterns
            </Typography>
          </Box>
        ) : weatherData && (
          <>
            <Typography variant="h2" sx={{ 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontWeight: 'bold',
              color: prediction > 70 ? 'success.main' : 'primary.main'
            }}>
              {prediction}%
            </Typography>

            <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
              {prediction > 90 ? '🎉 Almost Certain Snow Day!' :
               prediction > 70 ? '🌨️ Very Likely Snow Day!' :
               prediction > 50 ? '❄️ Decent Chance!' :
               prediction > 30 ? '🌥️ Small Chance...' :
               '☀️ Probably Not Today'}
            </Typography>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              width: '100%'
            }}>
              {[
                { label: '📍 Location', value: weatherData.city.name },
                { label: '🌡️ Temperature', value: `${Math.round(weatherData.list[0].main.temp_min)}°F to ${Math.round(weatherData.list[0].main.temp_max)}°F` },
                { label: '🌥️ Conditions', value: weatherData.list[0].weather[0].description, capitalize: true },
                { label: '💨 Wind Speed', value: `${Math.round(weatherData.list[0].wind.speed)} mph` }
              ].map(({ label, value, capitalize }) => (
                <Paper key={label} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {label}
                  </Typography>
                  <Typography sx={{ textTransform: capitalize ? 'capitalize' : 'none' }}>
                    {value}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {prediction > 70 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  🎊 Time to prepare your snow day activities! 🎊
                </Typography>
              </Box>
            )}

            <Button
              variant="outlined"
              onClick={handleShare}
              startIcon={<Icon>{shareSuccess ? 'check_circle' : 'share'}</Icon>}
              sx={{
                mt: 3,
                borderColor: shareSuccess ? 'success.main' : 'inherit',
                color: shareSuccess ? 'success.main' : 'inherit',
              }}
            >
              {shareSuccess ? 'Copied!' : 'Share Result'}
            </Button>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default SnowDayCalculator;
