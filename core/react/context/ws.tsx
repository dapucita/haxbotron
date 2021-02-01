import { createContext } from "react";
import io from "socket.io-client";

export const wsocket = io('', {
    path: '/ws',
    transports: ['websocket']
});

export const WSocketContext = createContext(wsocket);
