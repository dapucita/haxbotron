import React from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ServerInfoWidget from './ServerInfoWidget';
import RoomWidget from './RoomWidget';
import Copyright from '../common/Footer.Copyright';

interface styleClass {
    styleClass: any
}

export default function Mainboard({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <ServerInfoWidget />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <RoomWidget />
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                <Copyright />
            </Box>
        </Container>
    );
}
