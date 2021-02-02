import React, { useEffect, useState } from 'react';
import { wsocket, WSocketContext } from '../context/ws';
//import { RouteComponentProps } from 'react-router-dom';
import client from '../lib/client';
import Dashboard from './Admin/Dashboard';
import SignIn from './SignIn';

export default function Admin(/* { match }: RouteComponentProps */) {
    const [loginCheck, setLoginCheck] = useState(false);

    useEffect(() => { // check login
        const check = async () => {
            try {
                const result = await client.get('/api/v1/auth');
                if(result.status === 200) {
                    setLoginCheck(true);
                }
            } catch (e) {
                if(e.response.status === 401) {
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
