import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const EmbedPreview = ({ embedCode, width, height }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !embedCode) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    // Create a container for the embed
    const previewContainer = document.createElement('div');
    previewContainer.innerHTML = embedCode;

    // Handle scripts for social media embeds
    const scripts = Array.from(previewContainer.getElementsByTagName('script'));
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Append the preview
    containerRef.current.appendChild(previewContainer);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [embedCode]);

  if (!embedCode) {
    return null;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      <Box
        ref={containerRef}
        sx={{
          border: '1px solid #ddd',
          borderRadius: 1,
          p: 2,
          minHeight: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          '& iframe': {
            maxWidth: '100%',
          },
        }}
      />
    </Box>
  );
};

export default EmbedPreview;
