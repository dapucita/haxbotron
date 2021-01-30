import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

export default function Footer() {
    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Container maxWidth="sm">
                <Typography variant="body1">
                    {'Powered by '} 
                    <Link color="inherit" href="https://github.com/dapucita/haxbotron">
                        Haxbotron
                    </Link>
                    {'.'}
                </Typography>
                <Copyright />
            </Container>
        </footer>
    )

}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary">
            {'MIT License Copyright © '}
            {new Date().getFullYear()}
            {' '}
            <Link color="inherit" href="https://github.com/dapucita">
                dapucita
            </Link>
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
}));