import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import client from '../../lib/client';
import { useParams } from 'react-router-dom';
import Alert from '../common/Alert';
import { Button, Divider, TextField } from '@material-ui/core';
import { BrowserHostRoomCommands, BrowserHostRoomConfig, BrowserHostRoomGameRule, BrowserHostRoomHEloConfig, BrowserHostRoomSettings } from '../../../lib/browser.hostconfig';
import { WSocketContext } from '../../context/ws';

interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}

type AlertColor = 'success' | 'info' | 'warning' | 'error';

interface roomInfo {
    roomName: string
    onlinePlayers: number
    _link: string
    _roomConfig: BrowserHostRoomConfig
    _settings: BrowserHostRoomSettings
    _rules: BrowserHostRoomGameRule
    _HElo: BrowserHostRoomHEloConfig
    _commands: BrowserHostRoomCommands
}

export default function RoomInfo({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const ws = useContext(WSocketContext);

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [roomInfoJSON, setRoomInfoJSON] = useState({} as roomInfo);
    const [roomInfoJSONText, setRoomInfoJSONText] = useState('');

    const [plainPassword, setPlainPassword] = useState('');
    const [freezeStatus, setFreezeStatus] = useState(false);

    const getFreezeStatus = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/info/freeze`);
            if (result.status === 200) {
                setFreezeStatus(result.data.freezed);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setFlashMessage('Failed to load status of chat');
                setAlertStatus("error");
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
                setAlertStatus("error");
            }
        }
    }

    const getRoomInfo = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/info`);
            if (result.status === 200) {
                setRoomInfoJSON(result.data);
                setPlainPassword(result.data._roomConfig.password || '');
            }
        } catch (error) {
            if (error.response.status === 404) {
                setFlashMessage('Failed to load information.');
                setAlertStatus("error");
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
                setAlertStatus("error");
            }
        }
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlainPassword(e.target.value);
    }

    const handleSetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/room/${matchParams.ruid}/info/password`, {
                password: plainPassword
            });
            if (result.status === 201) {
                setFlashMessage('Successfully set password.');
                setAlertStatus('success');
                setPlainPassword('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);

                getRoomInfo();
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to set password.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const handleFreezeChat = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            if (freezeStatus) {
                const result = await client.delete(`/api/v1/room/${matchParams.ruid}/info/freeze`);
                if (result.status === 204) {
                    setFlashMessage('Successfully unfreezed whole chat.');
                    setAlertStatus('success');
                    setTimeout(() => {
                        setFlashMessage('');
                    }, 3000);

                    getFreezeStatus();
                }
            } else {
                const result = await client.post(`/api/v1/room/${matchParams.ruid}/info/freeze`);
                if (result.status === 204) {
                    setFlashMessage('Successfully freezed whole chat.');
                    setAlertStatus('success');
                    setTimeout(() => {
                        setFlashMessage('');
                    }, 3000);

                    getFreezeStatus();
                }
            }

        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to freeze whole chat.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const handleClearPassword = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            const result = await client.delete(`/api/v1/room/${matchParams.ruid}/info/password`);
            if (result.status === 204) {
                setFlashMessage('Successfully clear password.');
                setAlertStatus('success');
                setPlainPassword('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);

                getRoomInfo();
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to clear password.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    useEffect(() => {
        getRoomInfo();
        getFreezeStatus();
    }, []);

    useEffect(() => {
        try {
            setRoomInfoJSONText(JSON.stringify(roomInfoJSON, null, 4));
        } catch (error) {
            setFlashMessage('Failed to load text.');
            setAlertStatus("error");
        }
    }, [roomInfoJSON]);

    useEffect(() => { // websocket with socket.io
        ws.on('statuschange', (content: any) => {
            if (content.ruid === matchParams.ruid) {
                getFreezeStatus();
            }
        });
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
        }
    }, [ws]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Room Information</Title>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <Button size="small" type="button" variant="contained" color="default" className={classes.submit} onClick={handleFreezeChat}>
                                        {freezeStatus ? 'Unfreeze Chat' : 'Freeze Chat'}
                                    </Button>

                                    <form className={classes.form} onSubmit={handleSetPassword} method="post">
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={plainPassword} onChange={onChangePassword}
                                            id="password" label="Password" name="password"
                                        />
                                        <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Set</Button>
                                        <Button size="small" type="button" variant="contained" color="secondary" className={classes.submit} onClick={handleClearPassword}>Clear</Button>
                                    </form>
                                </Grid>
                            </Grid>
                            <Divider />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth variant="outlined" margin="normal" multiline
                                        value={roomInfoJSONText} id="roomInfoJSONText" name="roomInfoJSONText" label="JSON Data"
                                        InputProps={{ readOnly: true, }}
                                    />
                                </Grid>
                            </Grid>
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
