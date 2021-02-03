import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { WSocketContext } from '../../context/ws';
import { useParams } from 'react-router-dom';

interface styleClass {
    styleClass: any 
}

interface matchParams {
    ruid: string
}

interface LogMessage {
    ruid: string
    origin: string
    type: string
    message: string
}


export default function RoomLog({ styleClass }: styleClass) {
    
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const ws = useContext(WSocketContext);
    const match: matchParams = useParams();
    
    const [logMessage, setLogMessage] = useState([] as LogMessage[]);
    const [recentLogMessage, setRecentLogMessage] = useState({} as LogMessage);

    useEffect(() => { // websocket with socket.io
        ws.on('log', (content: LogMessage) => {
            if(content.ruid === match.ruid) {
                setRecentLogMessage(content);
            }
        });
    }, []);

    useEffect(() => {
        Object.keys(recentLogMessage).length > 0 && setLogMessage(logMessage.concat(recentLogMessage));
        setRecentLogMessage({} as LogMessage);
    }, [recentLogMessage.message]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            <Title>Log Messages</Title>
                            <ul>
                                {logMessage.map((message, idx) => (
                                    <li key={idx}>[{message.origin}] {message.message}</li>
                                ))}
                            </ul>
                        </React.Fragment>
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                <Copyright />
            </Box>
        </Container>
    );
}
