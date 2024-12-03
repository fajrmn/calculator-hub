import { Box } from '@mui/material';
import Header from '../Header';
import PWAPrompt from '../PWAPrompt';

const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <PWAPrompt />
    </Box>
  );
};

export default Layout;
