import React from 'react';
import Footer from './common/Footer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
}));


export default function NotFound() {
    const classes = useStyles();
    const location = useLocation();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="sm">
                <Typography variant="h2" component="h1" gutterBottom>
                    Haxbotron 🤖
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {'This page is not found.'}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    <Box fontStyle="italic">{location.pathname}</Box>
                </Typography>
            </Container>
            <Footer />
        </div>
        
    )
}
