import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchTools from '../components/SearchTools';
import { tools } from '../data/tools';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Calculator Hub - Your Ultimate Destination for Free Online Calculators and Tools</title>
        <meta name="description" content="Explore our vast collection of free online calculators and tools, covering various categories such as finance, health, education, and more. Discover the perfect tool for your needs, with easy-to-use interfaces and mobile-friendly designs." />
        <meta name="keywords" content="online calculators, free tools, calculator hub, web tools, finance calculators, health calculators, education calculators, snow day predictor, vorici calculator, embed generator, unit converters, math calculators" />
        <meta property="og:title" content="Calculator Hub - Your Ultimate Destination for Free Online Calculators and Tools" />
        <meta property="og:description" content="Unlock a world of free online calculators and tools, designed to simplify complex calculations and provide accurate results. Browse our extensive collection today!" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://calculator-hub.netlify.app/" />
      </Helmet>
      
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Calculator Hub
      </Typography>
      
      <SearchTools />
      
      <Typography variant="h6" component="h2" gutterBottom color="textSecondary" sx={{ mt: 4 }}>
        All Tools:
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.path}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tool.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {tool.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={RouterLink} 
                  to={tool.path} 
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
