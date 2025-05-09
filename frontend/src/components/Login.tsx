import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
} from '@mui/material';
import axios from 'axios';
import { LoginCredentials } from '../types/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataObj = new FormData();
            formDataObj.append('username', formData.username);
            formDataObj.append('password', formData.password);

            const response = await axios.post('http://localhost:8000/auth/token', formDataObj);
            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box
                    component="img"
                    src="/seed-sprout.svg"
                    alt="SeedPlan Logo"
                    sx={{
                        width: 120,
                        height: 120,
                        mb: 2
                    }}
                />
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    SeedPlan
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Plan your seed starting, track your garden's success, and learn from year to year.
                    <br />
                    Your personal garden planning companion.
                </Typography>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {error && (
                            <Typography color="error" align="center" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 