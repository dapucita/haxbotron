import React, { useEffect, useState } from 'react';
import client from '../../lib/client';

export default function GetServerInfo () {
    const [serverInfo, setServerInfo] = useState({
        usedMemoryMB: 0,
        upTimeSecs: 0,
        serverVersion: '0.0'
    });
    useEffect(() => {
        const getInfo = async () => {
            try {
                const result = await client.get('/api/v1/system');
                if(result.status === 200) {
                    setServerInfo(result.data);
                }
            } catch (e) {
                if(e.status === 401) { }
            }
        }
        getInfo();
    }, []);

    return(
        <p>{serverInfo.usedMemoryMB} {serverInfo.upTimeSecs} {serverInfo.serverVersion}</p>
    );
}
