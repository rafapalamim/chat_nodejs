import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './contexts/Socket';
import Chat from './pages/Chat';
import Login from './pages/Login';
import LoginAtendimento from './pages/LoginAtendimento';
import Header from './pages/template/Header';


export default function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/atendimento" element={<LoginAtendimento />} />
                    <Route path="/chat" element={<SocketProvider><Header /><Chat /></SocketProvider>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}