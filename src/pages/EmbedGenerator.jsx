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
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Helmet } from 'react-helmet-async';
import EmbedPreview from '../components/EmbedPreview';

const EmbedGenerator = () => {
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
    <>
      <Helmet>
        <title>Embed Code Generator - Calculator Hub</title>
        <meta name="description" content="Generate embed codes for various content types including YouTube videos, tweets, and more. Customize size and preview before embedding." />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Embed Code Generator
      </Typography>

      <Grid container spacing={3}>
        {/* Input Form Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box component="form" noValidate>
              <FormControl fullWidth sx={{ mb: 2 }}>
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
                margin="normal"
                error={!!error}
                helperText={error || 'Enter the URL of the content you want to embed'}
              />

              {embedType !== 'twitter' && embedType !== 'instagram' && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="Width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    label="Height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={generateEmbedCode}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Generate Embed Code
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Preview and Code Section */}
        <Grid item xs={12} md={6}>
          {embedCode && (
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ position: 'relative', mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={embedCode}
                  label="Embed Code"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Box>

              <EmbedPreview 
                embedCode={embedCode}
                width={width}
                height={height}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Embed code copied to clipboard!"
      />
    </>
  );
};

export default EmbedGenerator;
