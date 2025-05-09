import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preferences';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>
    },
    {
        path: '/preferences',
        element: <PrivateRoute><Preferences /></PrivateRoute>
    }
]);

const App: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default App; 