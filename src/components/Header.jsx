import { AppBar, Toolbar, Typography, Box, Container, useScrollTrigger, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchTools from './SearchTools';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

const Header = () => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: trigger ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters
          sx={{ 
            minHeight: { xs: '56px', sm: '64px' },
            justifyContent: 'space-between'
          }}
        >
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.dark',
              }
            }}
          >
            Calculator Hub
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 }
          }}>
            <SearchTools />
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{ 
                ml: { xs: 1, sm: 2 },
                color: theme.palette.mode === 'dark' ? 'primary.main' : 'text.primary'
              }}
              aria-label="toggle dark mode"
            >
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
