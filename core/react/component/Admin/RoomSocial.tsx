import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { useParams } from 'react-router-dom';
import { Button, Divider, FormControlLabel, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import client from '../../lib/client';
import Alert, { AlertColor } from '../common/Alert';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { LiveHelp } from '@material-ui/icons';

interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}

type DiscordWebhookConfig = {
    feed: boolean
    id: string
    token: string
    replayUpload: boolean
}

export default function RoomSocial({ styleClass }: styleClass) {

    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const [newNoticeMessage, setNewNoticeMessage] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');

    const [newDiscordWebhookID, setNewDiscordWebhookID] = useState('');
    const [newDiscordWebhookToken, setNewDiscordWebhookToken] = useState('');
    const [newDiscordWebhookFeed, setNewDiscordWebhookFeed] = useState(false);
    const [newDiscordWebhookReplayUpload, setNewDiscordWebhookReplayUpload] = useState(false);

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const handleNoticeSet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem(`_NoticeMessage`, newNoticeMessage);
        try {
            const result = await client.post(`/api/v1/room/${matchParams.ruid}/social/notice`, { message: newNoticeMessage });
            if (result.status === 201) {
                setFlashMessage('Successfully set.');
                setAlertStatus('success');
                setNewNoticeMessage('');
                getNoticeMessage();
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

    const handleDiscordWebhookSet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem(`_DiscordWebhookConfig`, JSON.stringify({
            feed: newDiscordWebhookFeed, id: newDiscordWebhookID, token: newDiscordWebhookToken, replayUpload: newDiscordWebhookReplayUpload
        } as DiscordWebhookConfig));
        try {
            const result = await client.post(`/api/v1/room/${matchParams.ruid}/social/discord/webhook`, {
                feed: newDiscordWebhookFeed,
                id: newDiscordWebhookID,
                token: newDiscordWebhookToken,
                replayUpload: newDiscordWebhookReplayUpload
            });
            if (result.status === 201) {
                setFlashMessage('Discord Webhook is configured.');
                setAlertStatus('success');
                getDiscordWebhookConfig();
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            setAlertStatus('error');
            switch (error.response.status) {
                case 400: {
                    setFlashMessage('Request body for Discord webhook is unfulfilled.');
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

    const onChangeNoticeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNoticeMessage(e.target.value);
    }

    const onChangeDiscordWebhookID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDiscordWebhookID(e.target.value);
    }
    const onChangeDiscordWebhookToken = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDiscordWebhookToken(e.target.value);
    }
    const onChangeDiscordWebhookFeed = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDiscordWebhookFeed(e.target.checked); // switch toggle component
    }
    const onChangeDiscordWebhookReplayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDiscordWebhookReplayUpload(e.target.checked); // switch toggle component
    }

    const getNoticeMessage = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/social/notice`);
            if (result.status === 200) {
                const noticeMessage: string = result.data.message;
                setNoticeMessage(noticeMessage);
            }
        } catch (error) {
            setAlertStatus('error');
            if (error.response.status === 404) {
                setFlashMessage('Failed to load notice message.');
                setNoticeMessage('');
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }
    const getDiscordWebhookConfig = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/social/discord/webhook`);
            if (result.status === 200) {
                const config: DiscordWebhookConfig = result.data;
                setNewDiscordWebhookID(config.id);
                setNewDiscordWebhookToken(config.token);
                setNewDiscordWebhookFeed(config.feed);
                setNewDiscordWebhookReplayUpload(config.replayUpload);
            }
        } catch (error) {
            setAlertStatus('error');
            if (error.response.status === 404) {
                setFlashMessage('Failed to load Discord webhook configuration.');
                setNoticeMessage('');
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }

    const deleteNoticeMessage = async () => {
        try {
            const result = await client.delete(`/api/v1/room/${matchParams.ruid}/social/notice`);
            if (result.status === 204) {
                setAlertStatus('success');
                setFlashMessage('Successfully delete notice.');
                getNoticeMessage();
            }
        } catch (error) {
            setAlertStatus('error');
            if (error.response.status === 404) {
                setFlashMessage('Failed to access notice message.');
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }

    const handleNoticeLoad = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (localStorage.getItem(`_NoticeMessage`) !== null) {
            setNewNoticeMessage(localStorage.getItem(`_NoticeMessage`)!);
        }
    }

    const handleDiscordWebhookLoad = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (localStorage.getItem(`_DiscordWebhookConfig`) !== null) {
            const config: DiscordWebhookConfig = JSON.parse(localStorage.getItem(`_DiscordWebhookConfig`)!);
            setNewDiscordWebhookID(config.id);
            setNewDiscordWebhookToken(config.token);
            setNewDiscordWebhookFeed(config.feed);
            setNewDiscordWebhookReplayUpload(config.replayUpload);
        }
    }

    useEffect(() => {
        getNoticeMessage();
        getDiscordWebhookConfig();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}

                            <Title>Notice</Title>
                            <form className={classes.form} onSubmit={handleNoticeSet} method="post">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" fullWidth
                                            id="notice" label="Notice Message" name="notice"
                                            value={newNoticeMessage} onChange={onChangeNoticeMessage}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={1}>
                                        <Button fullWidth size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Publish</Button>
                                    </Grid>
                                    <Grid item xs={3} sm={1}>
                                        <Button fullWidth size="small" type="button" variant="outlined" color="default" className={classes.submit} onClick={handleNoticeLoad}>Load</Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Notice Message</TableCell>
                                                <TableCell align="right" />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{noticeMessage}</TableCell>
                                                <TableCell align="right">
                                                    {noticeMessage &&
                                                        <IconButton name='deleteNotice' onClick={deleteNoticeMessage} aria-label="delete" className={classes.margin}>
                                                            <BackspaceIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                            <Divider />

                            <Title>Discord Webhook</Title>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <Typography component="h2" variant="subtitle2" color="inherit" gutterBottom>
                                        {'Create a webhook in the Discord application and submit your webhook\'s ID and Token. (e.g. https://discord.com/api/webhooks/id/token)'}
                                        <IconButton onClick={() => window.open('https://github.com/dapucita/haxbotron/wiki/Discord-Webhook-Configuration', '_blank')} edge="start" size="medium" aria-label="get help">
                                            <LiveHelp />
                                        </IconButton>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <form className={classes.form} onSubmit={handleDiscordWebhookSet} method="post">
                                <Grid container spacing={2}>
                                    <Grid item xs={2} sm={1}>
                                        <FormControlLabel
                                            control={<Switch id="discordWebhookFeed" name="discordWebhookFeed" size="small" checked={newDiscordWebhookFeed} onChange={onChangeDiscordWebhookFeed} color="primary" />}
                                            label="Enable" labelPlacement="top"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            variant="outlined" margin="normal" size="small" fullWidth
                                            id="discordWebhookID" label="Webhook ID" name="discordWebhookID"
                                            value={newDiscordWebhookID} onChange={onChangeDiscordWebhookID}
                                        />
                                    </Grid>
                                    <Grid item xs={8} sm={6}>
                                        <TextField
                                            variant="outlined" margin="normal" size="small" fullWidth
                                            id="discordWebhookToken" label="Webhook Token" name="discordWebhookToken"
                                            value={newDiscordWebhookToken} onChange={onChangeDiscordWebhookToken}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={1}>
                                        <Button fullWidth size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Apply</Button>
                                    </Grid>
                                    <Grid item xs={3} sm={1}>
                                        <Button fullWidth size="small" type="button" variant="outlined" color="default" className={classes.submit} onClick={handleDiscordWebhookLoad}>Load</Button>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch id="discordWebhookReplayUpload" name="discordWebhookReplayUpload" size="small" checked={newDiscordWebhookReplayUpload} onChange={onChangeDiscordWebhookReplayUpload} color="primary" />}
                                            label="Replay Upload" labelPlacement="top"
                                        />
                                    </Grid>
                                </Grid>
                            </form>
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
