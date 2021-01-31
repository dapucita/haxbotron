import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink, useHistory  } from 'react-router-dom';
import client from '../lib/client';

interface checkProps {
    installed: boolean
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
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
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp({ installed }: checkProps) {
    const classes = useStyles();
    const history = useHistory();

    const [flashMessage, setFlashMessage] = useState('');
    const [adminAccount, setAdminAccount] = useState({
        username: '',
        password: ''
    });

    const { username, password } = adminAccount;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdminAccount({
            ...adminAccount,
            [name]: value
        });
    }

    const validateForm = (): boolean => {
        if(username && password && password.length >= 3 && password.length <= 20) return true;
        else return false;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            try {
                const result = await client.post('/api/v1/init', { username, password });
                if(result.status === 201) {
                    setFlashMessage('Configuration succeeded.');
                    setTimeout(()=>{
                        history.push('/admin')
                    }, 5000);
                }
            } catch (e) {
                switch(e.status) {
                    case 400: {
                        setFlashMessage('Form is unfulfilled.');
                        break;
                    }
                    case 405: {
                        setFlashMessage('Already done.');
                        break;
                    }
                    default :{
                        setFlashMessage('Unexpected error is caused. Please try again.');
                        break;
                    }
                }
            }
        } else {
            setFlashMessage('Form is unfulfilled.');
        }
        
    }

    if(installed) {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Initial Configuration
                    </Typography>
                    <Typography variant="body1">Already done. Login and start managing the server.</Typography>
                </div>
                <Box mt={5}>
                    <Typography variant="body1" align="center">
                        {'Powered by '} 
                        <Link color="inherit" href="https://github.com/dapucita/haxbotron">
                            Haxbotron
                        </Link>
                        {'.'}
                    </Typography>
                    <Copyright />
                </Box>
            </Container>
        )
    } else {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Initial Configuration
                    </Typography>
                    <Typography variant="body1">Sign up new admin account.</Typography>
                    <Typography variant="body1">{flashMessage}</Typography>
                    <form className={classes.form} onSubmit={handleSubmit} method="post">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="username"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Account Name"
                                    autoFocus
                                    value={username}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password (3-20 characters)"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={onChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/admin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={5}>
                    <Typography variant="body1" align="center">
                        {'Powered by '} 
                        <Link color="inherit" href="https://github.com/dapucita/haxbotron">
                            Haxbotron
                        </Link>
                        {'.'}
                    </Typography>
                    <Copyright />
                </Box>
            </Container>
        )
    }
}