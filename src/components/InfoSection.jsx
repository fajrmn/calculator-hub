import { Paper, Typography, Box } from '@mui/material';

const InfoSection = ({ title, children }) => {
  return (
    <Paper elevation={0} sx={{ mt: 4, p: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default InfoSection;
