import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  InputAdornment,
  Box,
  Popper,
  Fade,
  Typography,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { tools } from '../data/tools';

const SearchTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const filteredTools = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      (tool.keywords && tool.keywords.some(keyword => keyword.toLowerCase().includes(query)))
    ).map(tool => ({
      ...tool,
      matchType: tool.name.toLowerCase().includes(query) ? 'name' :
                 tool.description.toLowerCase().includes(query) ? 'description' : 'keyword'
    }));
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setAnchorEl(event.currentTarget);
  };

  const handleToolSelect = (path) => {
    setSearchQuery('');
    setAnchorEl(null);
    navigate(path);
  };

  const open = Boolean(anchorEl) && filteredTools.length > 0;
  const id = open ? 'search-popper' : undefined;

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        size="small"
        placeholder="Search tools..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'background.paper',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main'
            }
          }
        }}
        sx={{
          width: { xs: '200px', sm: '300px' },
          transition: 'width 0.2s',
          '&:focus-within': {
            width: { xs: '250px', sm: '400px' }
          }
        }}
      />
      <Popper 
        id={id} 
        open={open} 
        anchorEl={anchorEl} 
        placement="bottom-start"
        transition
        sx={{ 
          width: { xs: '280px', sm: '400px' },
          zIndex: 1300
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper 
              elevation={3}
              sx={{ 
                mt: 1,
                maxHeight: '400px',
                overflow: 'auto'
              }}
            >
              <List dense>
                {filteredTools.map((tool, index) => (
                  <ListItem 
                    key={tool.path} 
                    disablePadding
                    divider={index !== filteredTools.length - 1}
                  >
                    <ListItemButton 
                      onClick={() => handleToolSelect(tool.path)}
                      sx={{ 
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {tool.icon && <span>{tool.icon}</span>}
                            <Typography variant="subtitle1">
                              {tool.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              {tool.description}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="primary"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {tool.category}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default SearchTools;
