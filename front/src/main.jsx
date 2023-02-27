import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login'
import { AppProvider } from './contexts/App'
import LoginAtendimento from './pages/LoginAtendimento'
import Header from './pages/template/Header'
import CssBaseline from '@mui/material/CssBaseline';
import Chat from './pages/Chat'



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CssBaseline />
        <AppProvider>
            <Header />
            <Chat />
            {/* <Login /> */}
            {/* <LoginAtendimento /> */}
        </AppProvider>
    </React.StrictMode>,
)
