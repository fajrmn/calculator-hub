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
      tool.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
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
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <TextField
        fullWidth
        placeholder="Search calculators..."
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <Popper 
        id={id} 
        open={open} 
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: anchorEl?.offsetWidth }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={3}>
              <List sx={{ width: '100%' }}>
                {filteredTools.map((tool) => (
                  <ListItem key={tool.path} disablePadding>
                    <ListItemButton onClick={() => handleToolSelect(tool.path)}>
                      <ListItemText 
                        primary={tool.name}
                        secondary={tool.description}
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
