import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#ffffff' : '#1976d2',
        light: isDarkMode ? '#f5f5f5' : '#42a5f5',
        dark: isDarkMode ? '#c2c2c2' : '#1565c0',
        contrastText: isDarkMode ? '#000000' : '#ffffff',
      },
      secondary: {
        main: isDarkMode ? '#f50057' : '#dc004e',
        light: isDarkMode ? '#f73378' : '#ff4081',
        dark: isDarkMode ? '#ab003c' : '#9a0036',
        contrastText: '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#2c3e50',
        secondary: isDarkMode ? '#b3b3b3' : '#546e7a',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f7fa',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      divider: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      h1: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      h2: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      h3: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      h4: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      h5: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      h6: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      subtitle1: {
        color: isDarkMode ? '#b3b3b3' : '#546e7a',
      },
      subtitle2: {
        color: isDarkMode ? '#b3b3b3' : '#546e7a',
      },
      body1: {
        color: isDarkMode ? '#ffffff' : '#2c3e50',
      },
      body2: {
        color: isDarkMode ? '#b3b3b3' : '#546e7a',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#2c3e50',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: '12px',
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
