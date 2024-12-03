import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const calculators = [
  {
    title: 'Snow Day Predictor',
    description: 'Get instant predictions for school closures based on real-time weather forecasts. Just enter your ZIP code to check if tomorrow might be a snow day!',
    path: '/snow-day-calculator',
  },
  {
    title: 'Vorici Calculator',
    description: 'Calculate Chromatic Orb crafting statistics including costs, success rates, and optimal strategies.',
    path: '/vorici-calculator',
  },
];

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Calculator Hub - Free Online Calculators</title>
        <meta name="description" content="Access a collection of useful online calculators including Snow Day predictions and Vorici Chromatic Orb crafting calculator. Free, easy to use, and accurate calculations." />
      </Helmet>
      
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Calculator Hub
      </Typography>
      
      <Typography variant="h6" component="h2" gutterBottom color="textSecondary">
        Choose a calculator to get started:
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {calculators.map((calc) => (
          <Grid item xs={12} sm={6} key={calc.path}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {calc.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {calc.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={RouterLink} 
                  to={calc.path} 
                  size="large" 
                  color="primary" 
                  variant="contained"
                  sx={{ width: '100%' }}
                >
                  Open Calculator
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
