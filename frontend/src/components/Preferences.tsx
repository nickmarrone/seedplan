import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { User } from '../types/auth';
import Navigation from './Navigation';
import { format, parse, isValid } from 'date-fns';
import api from '../utils/axios';

interface LocationData {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}

const Preferences: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [locationData, setLocationData] = useState<LocationData | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await api.get<User>('/users/me');
            setUser(response.data);
        } catch (err) {
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setUser({
                ...user,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleDateChange = (field: 'last_frost_date' | 'first_frost_date') => (date: Date | null) => {
        if (user && date) {
            // Format as MM-DD
            const formattedDate = format(date, 'MM-dd');
            setUser({
                ...user,
                [field]: formattedDate
            });
        }
    };

    const parseFrostDate = (dateStr: string | null | undefined): Date | null => {
        if (!dateStr) return null;
        // Parse MM-DD format and use current year
        const date = parse(dateStr, 'MM-dd', new Date());
        return isValid(date) ? date : null;
    };

    const handleZipcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const zipcode = e.target.value;
        // Only allow numeric input and limit to 5 digits
        if (!/^\d*$/.test(zipcode) || zipcode.length > 5) {
            return;
        }
        
        if (user) {
            setUser({ 
                ...user, 
                zipcode: zipcode,
            });
        }

        if (zipcode.length === 5) {
            try {
                const response = await api.get<LocationData>(`/location/${zipcode}`);
                setLocationData(response.data);
                if (user) {
                    setUser({
                        ...user,
                        latitude: response.data.latitude,
                        longitude: response.data.longitude,
                        zipcode: zipcode,
                    });
                }
            } catch (err) {
                setError('Invalid zipcode');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/users/me', user);
            setSuccess('Preferences updated successfully');
            setError('');
        } catch (err) {
            setError('Failed to update preferences');
            setSuccess('');
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <>
            <Navigation />
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Garden Preferences
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="full_name"
                                label="Full Name"
                                name="full_name"
                                autoComplete="name"
                                value={user?.full_name || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                disabled
                                value={user?.email || ''}
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                                    },
                                }}
                            />
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Gardening Zone"
                                        name="gardening_zone"
                                        value={user?.gardening_zone || ''}
                                        onChange={handleChange}
                                        placeholder="e.g., 6b"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Zipcode"
                                        name="zipcode"
                                        value={user?.zipcode || ''}
                                        onChange={handleZipcodeChange}
                                        error={!!error}
                                        helperText={error}
                                        inputProps={{
                                            maxLength: 5,
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*'
                                        }}
                                    />
                                </Grid>
                                {locationData && (
                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            Location: {locationData.city}, {locationData.state}
                                            <br />
                                            Coordinates: {locationData.latitude}, {locationData.longitude}
                                        </Alert>
                                    </Grid>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Last Frost Date"
                                            value={parseFrostDate(user?.last_frost_date)}
                                            onChange={handleDateChange('last_frost_date')}
                                            views={['month', 'day']}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    margin: "normal"
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="First Frost Date"
                                            value={parseFrostDate(user?.first_frost_date)}
                                            onChange={handleDateChange('first_frost_date')}
                                            views={['month', 'day']}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    margin: "normal"
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            {success && (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    {success}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                            >
                                Save Preferences
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default Preferences; 