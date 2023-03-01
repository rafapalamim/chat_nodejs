import React from 'react';
import { AppContext } from './App';
import { io } from 'socket.io-client';

export const SocketContext = React.createContext();

export const SocketProvider = (props) => {

    const appCtx = React.useContext(AppContext);
    const token = appCtx.getToken();

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
        query: token
    });

    return (
        <SocketContext.Provider value={{ socket, token }}>
            {props.children}
        </SocketContext.Provider>
    );

}