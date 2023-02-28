import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertBar from '../wrappers/AlertBar';

const theme = createTheme({
    palette: {
        background: {
            // default: '#092e48'
        },
        text: {
            // primary: "#ffffff"
        }
    }
});

export const AppContext = React.createContext();

export const AppProvider = (props) => {

    /** 
     * Snackbar / Alert 
    */
    const [alertOptions, setAlertOptions] = useState({
        open: false,
        message: '',
        severity: ''
    });

    function showAlert(severity, message) {
        setAlertOptions({
            open: true,
            message: message,
            severity: severity
        });
    }

    function hideAlert() {
        setAlertOptions({
            open: false,
            message: alertOptions.message,
            severity: alertOptions.severity
        });
    }

    /** 
     * Login 
     * 
    */
    const [auth, setAuth] = useState({
        isAuth: false,
        token: null,
        name: null,
        identifiedBy: null
    });

    function saveAuth(token) {
        setAuth({
            isAuth: token.isAuth,
            token: token.token,
            name: token.name,
            identifiedBy: token.identifiedBy
        });
        localStorage.setItem('CHAT_AUTH', token.token);
        localStorage.setItem('CHAT_USER_NAME', token.name);
        localStorage.setItem('CHAT_USER_IDENTITY', token.identifiedBy);
    }

    function getToken() {

        const authData = {
            token: localStorage.getItem('CHAT_AUTH'),
            name: localStorage.getItem('CHAT_USER_NAME'),
            identifiedBy: localStorage.getItem('CHAT_USER_IDENTITY'),
        }

        if (!authData.token) {
            return false;
        }

        return authData;
    }

    return (
        <AppContext.Provider value={{ showAlert, hideAlert, saveAuth, getToken }}>
            <ThemeProvider theme={theme}>
                <AlertBar options={alertOptions} />
                {props.children}
            </ThemeProvider>
        </AppContext.Provider>
    );

}