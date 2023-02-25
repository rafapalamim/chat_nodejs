import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login'
import { AppProvider } from './contexts/App'
import LoginAtendimento from './pages/LoginAtendimento'



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppProvider>
            <Login />
            {/* <LoginAtendimento /> */}
        </AppProvider>
    </React.StrictMode>,
)
