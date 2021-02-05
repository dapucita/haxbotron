import React, { useEffect, useState } from 'react';
import SignUp from './Install.SignUp';
import client from '../../lib/client';

export default function Install() {
    const [installAlready, setInstallAlready] = useState(false);
    useEffect(() => {
        const check = async () => {
            try {
                const result = await client.get('/api/v1/init');
                if(result.status === 204) {
                    setInstallAlready(true);
                }
            } catch (e) {
                if(e.response.status === 404) {
                    setInstallAlready(false);
                }
            }
        }
        check();
    });
    return (
        <SignUp installed={installAlready} />
    )
}
