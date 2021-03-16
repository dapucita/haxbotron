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
import { Button, Divider, TextField } from '@material-ui/core';
import client from '../../lib/client';
import Alert, { AlertColor } from '../common/Alert';

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
    const matchParams: matchParams = useParams();

    const [logMessage, setLogMessage] = useState([] as LogMessage[]);
    const [recentLogMessage, setRecentLogMessage] = useState({} as LogMessage);

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [broadcastMessage, setBroadcastMessage] = useState('');

    const handleBroadcast = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/room/${matchParams.ruid}/chat`, { message: broadcastMessage });
            if (result.status === 201) {
                setFlashMessage('Successfully sent.');
                setAlertStatus('success');
                setBroadcastMessage('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            setAlertStatus('error');
            switch (error.response.status) {
                case 400: {
                    setFlashMessage('No message.');
                    break;
                }
                case 401: {
                    setFlashMessage('No permission.');
                    break;
                }
                case 404: {
                    setFlashMessage('No exists room.');
                    break;
                }
                default: {
                    setFlashMessage('Unexpected error is caused. Please try again.');
                    break;
                }
            }
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const onChangeBroadcastMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBroadcastMessage(e.target.value);
    }

    useEffect(() => { // websocket with socket.io
        ws.on('log', (content: LogMessage) => {
            if (content.ruid === matchParams.ruid) {
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
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Broadcast</Title>
                            <form className={classes.form} onSubmit={handleBroadcast} method="post">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    size="small"
                                    id="broadcast"
                                    label="Message"
                                    name="broadcast"
                                    value={broadcastMessage}
                                    onChange={onChangeBroadcastMessage}
                                    autoFocus
                                    className={classes.halfInput}
                                />
                                <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Send</Button>
                            </form>
                        </React.Fragment>
                        <Divider />
                        
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
