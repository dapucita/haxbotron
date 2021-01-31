import React, { useEffect, useState } from 'react';
import client from '../lib/client';
import GetServerInfo from './Admin/GetServerInfo';
import SignIn from './SignIn';

export default function Admin() {
    const [loginCheck, setLoginCheck] = useState(false);

    useEffect(() => {
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
            <div>
                <h1>Administration</h1>
                <p>you are loginned.</p>
                <GetServerInfo />
            </div>
        );
    } else {
        return (
            <SignIn />
        );
    }
}
