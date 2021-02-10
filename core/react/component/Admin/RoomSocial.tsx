import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { useParams } from 'react-router-dom';
import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@material-ui/core';
import client from '../../lib/client';
import Alert, { AlertColor } from '../common/Alert';
import BackspaceIcon from '@material-ui/icons/Backspace';

interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}

export default function RoomSocial({ styleClass }: styleClass) {

    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const [newNoticeMessage, setNewNoticeMessage] = useState('');
    const [noticeMessage, setNoticeMessage] = useState('');

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const handleNoticeSet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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

    const onChangeNoticeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNoticeMessage(e.target.value);
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

    useEffect(() => {
        getNoticeMessage();
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
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    size="small"
                                    id="notice"
                                    label="Notice Message"
                                    name="notice"
                                    value={newNoticeMessage}
                                    onChange={onChangeNoticeMessage}
                                    autoFocus
                                    className={classes.halfInput}
                                />
                                <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Set</Button>
                            </form>
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
