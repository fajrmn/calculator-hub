import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchTools from '../components/SearchTools';
import { tools } from '../data/tools';

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
