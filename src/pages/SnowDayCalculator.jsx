import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Snackbar,
  Divider,
  Slider,
  FormLabel
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import InfoSection from '../components/InfoSection';

// Use import.meta.env for Vite environment variables
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const DEBOUNCE_DELAY = 150;

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' }
];

const COMMON_CITIES = {
  US: [
    { name: 'New York', state: 'NY' },
    { name: 'Los Angeles', state: 'CA' },
    { name: 'Chicago', state: 'IL' },
    { name: 'Houston', state: 'TX' },
    { name: 'Phoenix', state: 'AZ' },
  ],
  CA: [
    { name: 'Toronto', state: 'ON' },
    { name: 'Montreal', state: 'QC' },
    { name: 'Vancouver', state: 'BC' },
    { name: 'Calgary', state: 'AB' },
    { name: 'Ottawa', state: 'ON' },
  ],
  GB: [
    { name: 'London', state: '' },
    { name: 'Birmingham', state: '' },
    { name: 'Manchester', state: '' },
    { name: 'Leeds', state: '' },
    { name: 'Glasgow', state: '' },
  ],
  AU: [
    { name: 'Sydney', state: 'NSW' },
    { name: 'Melbourne', state: 'VIC' },
    { name: 'Brisbane', state: 'QLD' },
    { name: 'Perth', state: 'WA' },
    { name: 'Adelaide', state: 'SA' },
  ],
};

const SnowDayCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchType, setSearchType] = useState('city');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [zipCode, setZipCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [serverCitySuggestions, setServerCitySuggestions] = useState([]);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  // Add a function to validate API configuration
  const validateApiConfig = () => {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeather API key is not configured. Please check environment variables.');
    }
  };

  const fetchCities = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) return;
    setLoadingCities(true);
    setError('');
    
    try {
      validateApiConfig();
      const url = new URL('https://api.openweathermap.org/geo/1.0/direct');
      url.searchParams.append('q', searchTerm);
      url.searchParams.append('limit', '5');
      url.searchParams.append('appid', OPENWEATHER_API_KEY);

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch cities');
      }
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
      console.error('City Search Error:', {
        message: err.message,
        hasApiKey: !!OPENWEATHER_API_KEY
      });
      setError(`Search Error: ${err.message}`);
      setServerCitySuggestions([]);
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

  useEffect(() => {
    // Log environment variable status (only in development)
    if (import.meta.env.DEV) {
      console.log('API Key Status:', OPENWEATHER_API_KEY ? 'Present' : 'Missing');
    }
  }, []);

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
    setWeatherData(null);
    setPrediction(null);

    try {
      validateApiConfig();
      let coords;

      if (searchType === 'zip') {
        const zipUrl = new URL('https://api.openweathermap.org/geo/1.0/zip');
        zipUrl.searchParams.append('zip', `${zipCode},${selectedCountry}`);
        zipUrl.searchParams.append('appid', OPENWEATHER_API_KEY);

        const response = await fetch(zipUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid ZIP code');
        }
        coords = await response.json();
      } else {
        const searchQuery = cityName || cityInputValue;
        if (!searchQuery) throw new Error('Please enter a city name');
        
        const cityUrl = new URL('https://api.openweathermap.org/geo/1.0/direct');
        cityUrl.searchParams.append('q', `${searchQuery},${selectedCountry}`);
        cityUrl.searchParams.append('limit', '1');
        cityUrl.searchParams.append('appid', OPENWEATHER_API_KEY);

        const response = await fetch(cityUrl);
        const data = await response.json();
        if (!response.ok || !data.length) {
          throw new Error(`City "${searchQuery}" not found. Please try another city name.`);
        }
        coords = data[0];
      }

      const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/forecast');
      weatherUrl.searchParams.append('lat', coords.lat);
      weatherUrl.searchParams.append('lon', coords.lon);
      weatherUrl.searchParams.append('appid', OPENWEATHER_API_KEY);
      weatherUrl.searchParams.append('units', 'imperial');

      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      const weatherData = await weatherResponse.json();
      
      setWeatherData(weatherData);
      setPrediction(calculateSnowDayProbability(weatherData));
    } catch (err) {
      console.error('Weather Data Error:', {
        message: err.message,
        hasApiKey: !!OPENWEATHER_API_KEY,
        searchType,
        selectedCountry
      });
      setError(`Error: ${err.message}`);
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
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>Snow Day Predictor | Calculate Snow Day Chances - Calculator Hub</title>
        <meta name="description" content="Predict the likelihood of a snow day with our accurate Snow Day Calculator. Uses real-time weather data and historical patterns to forecast school closures. Free and easy to use!" />
        <meta name="keywords" content="snow day calculator, snow day predictor, school closure calculator, weather prediction tool, snow day forecast" />
        <meta property="og:title" content="Snow Day Predictor | Calculate Snow Day Chances" />
        <meta property="og:description" content="Get accurate predictions for snow days using real-time weather data. Perfect for students, parents, and teachers planning ahead." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://calculator-hub.netlify.app/snow-day-calculator" />
        <meta name="author" content="Calculator Hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        ❄️ Snow Day Predictor
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter Location
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  mb: 2
                }}
              >
                <Tab label="Search by ZIP" value="zip" />
                <Tab label="Search by City" value="city" />
              </Tabs>

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
                    setError('');
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
                size="large"
                sx={{ 
                  mt: 'auto',
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                ) : (
                  'Check Snow Day Probability'
                )}
              </Button>
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
              display: 'flex',
              flexDirection: 'column',
              opacity: prediction !== null ? 1 : 0.7,
              transition: 'all 0.3s ease',
              bgcolor: 'background.paper'
            }}
          >
            {prediction === null ? (
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h6">
                  Enter a location to see the snow day prediction
                </Typography>
              </Box>
            ) : weatherData && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                    mb: 3
                  }}
                >
                  Snow Day Prediction for {weatherData.city.name}
                </Typography>

                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: prediction > 70 ? theme.palette.success.main : theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  {prediction}%
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4
                  }}
                >
                  {prediction > 90 ? '🎉 Almost Certain Snow Day!' :
                   prediction > 70 ? '🌨️ Very Likely Snow Day!' :
                   prediction > 50 ? '❄️ Decent Chance!' :
                   prediction > 30 ? '🌥️ Small Chance...' :
                   '☀️ Probably Not Today'}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {[
                    { icon: '🌡️', label: 'Temperature', value: `${Math.round(weatherData.list[0].main.temp)}°F` },
                    { icon: '💨', label: 'Wind Speed', value: `${Math.round(weatherData.list[0].wind.speed)} mph` },
                    { icon: '🌥️', label: 'Conditions', value: weatherData.list[0].weather[0].description, capitalize: true }
                  ].map(({ icon, label, value, capitalize }) => (
                    <Grid item xs={12} sm={4} key={label}>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 2,
                          height: '100%',
                          bgcolor: 'background.default'
                        }}
                      >
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="h6" component="span">
                            {icon}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          gutterBottom
                        >
                          {label}
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontWeight: 'medium',
                            textTransform: capitalize ? 'capitalize' : 'none'
                          }}
                        >
                          {value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {prediction > 70 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: theme.palette.success.main,
                        fontWeight: 'medium'
                      }}
                    >
                      🎊 Time to prepare your snow day activities! 🎊
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Snow Day Probability">
        <Typography variant="body1">
          The Snow Day Calculator helps predict the likelihood of school or work closures due to winter weather conditions. This tool considers various meteorological and local factors to estimate closure probability.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Key Factors Considered:
        </Typography>
        <Typography variant="body1">
          • Predicted snowfall amount and timing
          • Temperature and precipitation type
          • Local area's typical response to snow
          • Previous snow accumulation
          • Day of the week
          • School district policies
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          How to Interpret Results:
        </Typography>
        <Typography variant="body1">
          • 0-25%: Low probability - Normal operations likely
          • 26-50%: Moderate chance - Possible delay
          • 51-75%: High chance - Prepare for closure
          • 76-100%: Very high probability - Closure likely
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • Results are estimates based on historical data
          • Local conditions may vary significantly
          • School districts make final decisions
          • Monitor official announcements
          • Weather forecasts can change rapidly
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Safety Tips:
        </Typography>
        <Typography variant="body1">
          • Stay informed through official channels
          • Have backup childcare plans ready
          • Keep emergency supplies stocked
          • Plan for alternative work arrangements
          • Follow local emergency guidelines
        </Typography>
      </InfoSection>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ 
          vertical: 'bottom',
          horizontal: 'center'
        }}
      />
    </Container>
  );
};

export default SnowDayCalculator;
