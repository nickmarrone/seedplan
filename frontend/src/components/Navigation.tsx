import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';

const Navigation: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    SeedPlan
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Link
                        component={RouterLink}
                        to="/dashboard"
                        color="inherit"
                        underline="none"
                    >
                        Dashboard
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/preferences"
                        color="inherit"
                        underline="none"
                    >
                        Preferences
                    </Link>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navigation; 