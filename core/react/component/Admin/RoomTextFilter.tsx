import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { useParams } from 'react-router-dom';
import { Button, Divider, TextField, Typography } from '@material-ui/core';
import client from '../../lib/client';
import Alert, { AlertColor } from '../common/Alert';

interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}

export default function RoomTextFilter({ styleClass }: styleClass) {

    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const [nicknameFilteringPool, setNicknameFilteringPool] = useState('');
    const [chatFilteringPool, setChatFilteringPool] = useState('');

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const onChangeNicknameFilteringPool = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNicknameFilteringPool(e.target.value);
    }

    const onChangeChatFilteringPool = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatFilteringPool(e.target.value);
    }

    const handleNicknameFilteringPoolClear = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>)  => {
        event.preventDefault();
        clearFilteringPool('nickname');
        setNicknameFilteringPool('');
    }

    const handleChatFilteringPoolClear = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>)  => {
        event.preventDefault();
        clearFilteringPool('chat');
        setChatFilteringPool('');
    }

    const clearFilteringPool = async (endpoint: string)  => {
        try {
            const result = await client.delete(`/api/v1/room/${matchParams.ruid}/filter/${endpoint}`);
            if (result.status === 204) {
                setFlashMessage('Successfully clear.');
                setAlertStatus('success');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to clear.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const handleNicknameFilteringPoolSet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilteringPool('nickname', nicknameFilteringPool);
    }

    const handleChatFilteringPoolSet = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilteringPool('chat', chatFilteringPool);
    }

    const setFilteringPool = async (endpoint: string, pool: string) => {
        localStorage.setItem(`_${endpoint}FilteringPool`, pool);
        try {
            const result = await client.post(`/api/v1/room/${matchParams.ruid}/filter/${endpoint}`, { pool: pool });
            if (result.status === 201) {
                setFlashMessage('Successfully set.');
                setAlertStatus('success');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            setAlertStatus('error');
            switch (error.response.status) {
                case 400: {
                    setFlashMessage('No words in text pool.');
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

    const getNicknameFilteringPool = async () => {
        getFilteringPool('nickname', setNicknameFilteringPool)
    }

    const getChatFilteringPool = async () => {
        getFilteringPool('chat', setChatFilteringPool)
    }

    const getFilteringPool = async (endpoint: string, setterFunction: Function) => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/filter/${endpoint}`);
            if (result.status === 200) {
                const textPool: string = result.data.pool;
                setterFunction(textPool);
            }
        } catch (error) {
            setAlertStatus('error');
            if (error.response.status === 404) {
                setFlashMessage('Failed to load filtering pool.');
                setNicknameFilteringPool('');
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }

    const handleNicknameFilteringPoolLoad = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        setNicknameFilteringPool(localStorage.getItem('_nicknameFilteringPool') || '');
    }

    const handleChatFilteringPoolLoad = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        setChatFilteringPool(localStorage.getItem('_chatFilteringPool') || '');
    }

    useEffect(() => {
        getNicknameFilteringPool();
        getChatFilteringPool();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Nickname Filtering Pool</Title>
                            <Typography variant="body1">Seperate by |,| and click Apply button.</Typography>
                            <form className={classes.form} onSubmit={handleNicknameFilteringPoolSet} method="post">
                                <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Apply</Button>
                                <Button size="small" type="button" variant="contained" color="secondary" className={classes.submit} onClick={handleNicknameFilteringPoolClear}>Clear</Button>
                                <Button size="small" type="button" variant="outlined" color="default" className={classes.submit} onClick={handleNicknameFilteringPoolLoad}>Load</Button>
                                <TextField
                                    fullWidth variant="outlined" margin="normal" multiline required
                                    value={nicknameFilteringPool} onChange={onChangeNicknameFilteringPool}
                                    id="nicknameFilteringPoolField" name="nicknameFilteringPoolField" label="Seperate by |,|"
                                />
                            </form>
                            <Divider />

                            <Title>Chat Filtering Pool</Title>
                            <Typography variant="body1">Seperate by |,| and click Apply button.</Typography>
                            <form className={classes.form} onSubmit={handleChatFilteringPoolSet} method="post">
                                <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Apply</Button>
                                <Button size="small" type="button" variant="contained" color="secondary" className={classes.submit} onClick={handleChatFilteringPoolClear}>Clear</Button>
                                <Button size="small" type="button" variant="outlined" color="default" className={classes.submit} onClick={handleChatFilteringPoolLoad}>Load</Button>
                                <TextField
                                    fullWidth variant="outlined" margin="normal" multiline required
                                    value={chatFilteringPool} onChange={onChangeChatFilteringPool}
                                    id="chatFilteringPoolField" name="chatFilteringPoolField" label="Seperate by |,|"
                                />
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
