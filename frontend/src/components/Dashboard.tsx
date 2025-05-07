import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navigation from './Navigation';

const Dashboard: React.FC = () => {
    return (
        <>
            <Navigation />
            <Container maxWidth="lg">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="body1">
                        Welcome to your garden planning dashboard. Use the navigation menu above to access different features.
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Dashboard; 