import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Footer from './common/Footer';

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

export default function Main() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Container component="main" className={classes.main} maxWidth="sm">
                <Typography variant="h2" component="h1" gutterBottom>
                    Haxbotron 🤖
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {'Welcome to use Haxbotron!'}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    <Link component={RouterLink} color="inherit" to="/install">
                        Installation
                    </Link>
                </Typography>
                <Typography variant="body1">You have to do initial configuration if this is your first run.</Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    <Link component={RouterLink} color="inherit" to="/admin">
                        Administration
                    </Link>
                </Typography>
                <Typography variant="body1">You can control and manage your headless host server.</Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    <Link color="inherit" href="https://github.com/dapucita/haxbotron/wiki">
                        Documentation
                    </Link>
                </Typography>
                <Typography variant="body1">See our wiki for how to use Haxbotron.</Typography>
            </Container>
            <Footer />
        </div>
    );
}
