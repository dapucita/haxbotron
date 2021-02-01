import React, { useContext, useEffect, useState } from 'react';
import { wsocket, WSocketContext } from '../context/ws';
import client from '../lib/client';
import Dashboard from './Admin/Dashboard';
import SignIn from './SignIn';

export default function Admin() {
    const [loginCheck, setLoginCheck] = useState(false);

    const ws = useContext(WSocketContext);

    useEffect(() => { // websocket with socket.io
        ws.on('log', (content: any) => {
            console.log(`[LOG] ruid:${content.ruid} origin:${content.origin} type:${content.type} message:${content.message}`);
        });
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            
        }

    }, [ws]);

    useEffect(() => { // check login
        const check = async () => {
            try {
                const result = await client.get('/api/v1/auth');
                if(result.status === 200) {
                    setLoginCheck(true);
                }
            } catch (e) {
                if(e.status === 401) {
                    setLoginCheck(false);
                }
            }
        }
        check();
    });

    if(loginCheck) {
        return (
            <WSocketContext.Provider value={wsocket}>
                <Dashboard />
            </WSocketContext.Provider>
        );
    } else {
        return (
            <SignIn />
        );
    }
}
