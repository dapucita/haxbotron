import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import client from '../../lib/client';
import Typography from '@material-ui/core/Typography';
import Title from './common/Widget.Title';

interface styleClass {
    styleClass: any
}

export default function ServerInfo({ styleClass }: styleClass) {
    styleClass = {
        ...styleClass,
        infoContext: {
            flex: 1,
        },
    }
    const classes = styleClass;

    const [serverInfo, setServerInfo] = useState({
        usedMemoryMB: 0,
        upTimeSecs: 0,
        serverVersion: '0.0.0'
    });
    const [lastestReleaseVerison, setLastestReleaseVerison] = useState('v0.0.0');

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const result = await client.get('/api/v1/system');
                const _GitHublastestRelease = await client.get('https://api.github.com/repos/dapucita/haxbotron/releases/latest');
                setLastestReleaseVerison(_GitHublastestRelease.data.tag_name);
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
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            <Title>Memory Usage</Title>
                            <Typography component="p" variant="h4">
                                {serverInfo.usedMemoryMB}MB Used
                            </Typography>
                        </React.Fragment>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            <Title>Server Uptime</Title>
                            <Typography component="p" variant="h4">
                                {Math.round(serverInfo.upTimeSecs / 60)} minutes
                            </Typography>
                        </React.Fragment>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            <Title>Server Version</Title>
                            <Typography component="p" variant="h4">
                                v{serverInfo.serverVersion}
                            </Typography>
                            <Typography color="textSecondary" className={classes.infoContext}>
                                lastest : {lastestReleaseVerison}
                            </Typography>
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
