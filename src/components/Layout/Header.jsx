import { AppBar, Toolbar, Typography, Container, Autocomplete, TextField, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../../context/ThemeContext';

const tools = [
  {
    name: 'Snow Day Predictor',
    description: 'Calculate the probability of a snow day based on weather conditions',
    path: '/snow-day-calculator'
  },
  {
    name: 'Vorici Calculator',
    description: 'Calculate chromatic orb crafting probabilities',
    path: '/vorici-calculator'
  }
];

const Header = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar sx={{ gap: 2, position: 'relative' }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              minWidth: 'max-content'
            }}
          >
            Calculator Hub
          </Typography>

          <Autocomplete
            size="small"
            sx={{
              flexGrow: 1,
              maxWidth: 300,
              '& .MuiOutlinedInput-root': {
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '20px',
                height: '40px',
                '&:hover': {
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '20px',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                }
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? 'white' : 'black',
                fontSize: '0.875rem',
                padding: '8px 14px !important',
                '&::placeholder': {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  opacity: 1
                }
              }
            }}
            options={tools}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ fontSize: '0.875rem', py: 1 }}>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {option.description}
                  </Typography>
                </Box>
              </Box>
            )}
            onChange={(_, value) => {
              if (value) {
                navigate(value.path);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search tools..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <SearchIcon sx={{ 
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                      fontSize: '1.2rem',
                      ml: 1,
                      mr: 0.5
                    }} />
                  ),
                }}
              />
            )}
          />

          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            sx={{ 
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
