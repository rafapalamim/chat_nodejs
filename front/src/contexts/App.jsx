import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertBar from '../wrappers/AlertBar';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#092e48'
        },
        text: {
            primary: "#ffffff"
        }
    }
});

export const AppContext = React.createContext();

export const AppProvider = (props) => {

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

    return (
        <AppContext.Provider value={{ showAlert, hideAlert }}>
            <ThemeProvider theme={theme}>
                <AlertBar options={alertOptions} />
                {props.children}
            </ThemeProvider>
        </AppContext.Provider>
    );

}