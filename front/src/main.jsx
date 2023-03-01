import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppProvider } from './contexts/App'
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './routes';

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <CssBaseline />
        <AppProvider>
            <AppRoutes />
        </AppProvider>
    </>
)
