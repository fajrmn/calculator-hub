import { useState, useEffect } from 'react';
import {
  Snackbar,
  Button,
  Box,
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

const PWAPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <Snackbar
      open={showPrompt}
      onClose={handleClose}
      message="Install Calculator Hub for easier access"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="primary"
            size="small"
            onClick={handleInstall}
            startIcon={<GetAppIcon />}
          >
            Install
          </Button>
          <Button color="secondary" size="small" onClick={handleClose}>
            Later
          </Button>
        </Box>
      }
    />
  );
};

export default PWAPrompt;
