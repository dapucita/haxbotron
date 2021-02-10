import React, { useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';
import client from '../../lib/client';
import Alert, { AlertColor } from '../common/Alert';

interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}


export default function RoomPower({ styleClass }: styleClass) {

    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();
    const history = useHistory();

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);
    
    const handleShutdownClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            const result = await client.delete('/api/v1/room/' + matchParams.ruid);
            if (result.status === 204) {
                setFlashMessage('Shutdown succeeded.');
                setAlertStatus('success');
                history.push('/admin/roomlist');
            }
        } catch (e) {
            setAlertStatus('error');
            switch (e.response.status) {
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
        }
    }

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                        {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>{matchParams.ruid}</Title>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                onClick={handleShutdownClick}
                            >
                                Shutdown this room right now
                            </Button>
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
