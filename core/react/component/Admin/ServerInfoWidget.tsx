import React, { useEffect, useState } from 'react';
import client from '../../lib/client';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './common/Widget.Title';

function preventDefault(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
}

const useStyles = makeStyles({
    infoContext: {
        flex: 1,
    },
});

export default function ServerInfoWidget() {
    const classes = useStyles();
    const [serverInfo, setServerInfo] = useState({
        usedMemoryMB: 0,
        upTimeSecs: 0,
        serverVersion: '0.0'
    });

    useEffect(() => {
        const getInfo = async () => {
            try {
                const result = await client.get('/api/v1/system');
                if (result.status === 200) {
                    setServerInfo(result.data);
                }
            } catch (e) {
                if (e.status === 401) { }
            }
        }
        getInfo();
    }, []);

    return (
        <React.Fragment>
            <Title>Server Info</Title>
            <Typography component="p" variant="h4">
                {serverInfo.usedMemoryMB}MB Used
            </Typography>
            <Typography color="textSecondary" className={classes.infoContext}>
                uptime {Math.round(serverInfo.upTimeSecs/60)} minutes.
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    Get more information
                </Link>
            </div>
        </React.Fragment>
    );
}
