import { useState } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Helmet } from 'react-helmet-async';
import EmbedPreview from '../components/EmbedPreview';

const EmbedGenerator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('600');
  const [height, setHeight] = useState('400');
  const [embedType, setEmbedType] = useState('iframe');
  const [embedCode, setEmbedCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const embedTypes = {
    iframe: {
      name: 'Generic iFrame',
      generate: (url, width, height) => 
        `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`
    },
    youtube: {
      name: 'YouTube Video',
      generate: (url, width, height) => {
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        return videoId 
          ? `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
          : null;
      }
    },
    vimeo: {
      name: 'Vimeo Video',
      generate: (url, width, height) => {
        const videoId = url.match(/vimeo\.com\/([0-9]+)/)?.[1];
        return videoId
          ? `<iframe src="https://player.vimeo.com/video/${videoId}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
          : null;
      }
    },
    twitter: {
      name: 'Twitter/X Post',
      generate: (url) => {
        const tweetUrl = url.trim();
        return tweetUrl
          ? `<blockquote class="twitter-tweet"><a href="${tweetUrl}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
          : null;
      }
    },
    instagram: {
      name: 'Instagram Post',
      generate: (url) => {
        const postUrl = url.trim();
        return postUrl
          ? `<blockquote class="instagram-media" data-instgrm-permalink="${postUrl}"><a href="${postUrl}"></a></blockquote><script async src="//www.instagram.com/embed.js"></script>`
          : null;
      }
    }
  };

  const generateEmbedCode = () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url); // Validate URL format
      const embedFunction = embedTypes[embedType].generate;
      const code = embedFunction(url, width, height);
      
      if (code) {
        setEmbedCode(code);
        setError('');
      } else {
        setError('Invalid URL format for the selected embed type');
      }
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSnackbarClose = () => {
    setCopied(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Helmet>
        <title>Embed Code Generator - Calculator Hub</title>
        <meta name="description" content="Generate embed codes for various content types including YouTube videos, tweets, and more. Customize size and preview before embedding." />
      </Helmet>

      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ 
          mb: 4,
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '1.75rem', md: '2.125rem' }
        }}
      >
        Embed Code Generator
      </Typography>

      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }} 
        sx={{ 
          minHeight: '70vh',
          alignItems: 'stretch'
        }}
      >
        {/* Input Form Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box 
              component="form" 
              noValidate 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%'
              }}
            >
              <FormControl>
                <InputLabel>Embed Type</InputLabel>
                <Select
                  value={embedType}
                  label="Embed Type"
                  onChange={(e) => setEmbedType(e.target.value)}
                >
                  {Object.entries(embedTypes).map(([key, value]) => (
                    <MenuItem key={key} value={key}>{value.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={!!error}
                helperText={error || 'Enter the URL of the content you want to embed'}
                sx={{ mt: 1 }}
              />

              {embedType !== 'twitter' && embedType !== 'instagram' && (
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2
                  }}
                >
                  <TextField
                    label="Width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    fullWidth
                  />
                </Box>
              )}

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                color="primary"
                onClick={generateEmbedCode}
                fullWidth
                size="large"
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Generate Embed Code
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview and Code Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 2, sm: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              opacity: embedCode ? 1 : 0.5,
              transition: 'opacity 0.3s ease'
            }}
          >
            {!embedCode && (
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
                  Generate an embed code to see the preview here
                </Typography>
              </Box>
            )}
            {embedCode && (
              <>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={embedCode}
                    label="Embed Code"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      sx: { 
                        fontFamily: 'monospace',
                        fontSize: '0.9rem'
                      }
                    }}
                  />
                  <Button
                    onClick={handleCopy}
                    startIcon={<ContentCopyIcon />}
                    sx={{ mt: 1 }}
                  >
                    Copy Code
                  </Button>
                </Box>

                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  <EmbedPreview 
                    embedCode={embedCode}
                    width={width}
                    height={height}
                  />
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Embed code copied to clipboard!"
        anchorOrigin={{ 
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right'
        }}
      />
    </Container>
  );
};

export default EmbedGenerator;
