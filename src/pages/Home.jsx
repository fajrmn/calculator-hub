import { Typography, Grid, Card, CardActionArea, Box, Container, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tools } from '../data/tools';

const Home = () => {
  const theme = useTheme();

  // Group tools by category
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>Calculator Hub - Quick Access to Online Calculators and Tools</title>
        <meta name="description" content="Fast access to online calculators and tools. Simple, efficient, and free to use." />
        <meta name="keywords" content="calculators, online tools, quick calculator, free tools" />
        <meta property="og:title" content="Calculator Hub - Quick Access to Online Calculators and Tools" />
        <meta property="og:description" content="Fast access to online calculators and tools. Simple, efficient, and free to use." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://calculator-hub.netlify.app/" />
      </Helmet>
      
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <Box 
            key={category} 
            sx={{ mb: 3 }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                fontWeight: 500,
                color: 'text.secondary',
                mb: 1.5
              }}
            >
              {category}
            </Typography>

            <Grid container spacing={2}>
              {categoryTools.map((tool) => (
                <Grid item xs={6} sm={4} md={3} key={tool.path}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardActionArea
                      component={RouterLink}
                      to={tool.path}
                      sx={{ 
                        height: '100%',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Box 
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '1.75rem' },
                          mb: 1,
                          lineHeight: 1
                        }}
                      >
                        {tool.icon}
                      </Box>
                      <Typography 
                        variant="h3"
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          fontWeight: 500,
                          color: 'text.primary',
                          mb: 0.5
                        }}
                      >
                        {tool.name}
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.8rem' },
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {tool.description}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
