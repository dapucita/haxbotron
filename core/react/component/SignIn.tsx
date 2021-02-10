import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './common/Footer.Copyright';
import client from '../lib/client';
import { useHistory } from 'react-router-dom';
import Alert, { AlertColor } from './common/Alert';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const history = useHistory();

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);
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
                const result = await client.post('/api/v1/auth', { username, password });
                if(result.status === 201) {
                    setFlashMessage('Configuration succeeded.');
                    setAlertStatus('success');
                    /*setTimeout(()=>{
                        history.push('/admin');
                    }, 1000);*/
                    history.push('/admin');
                }
            } catch (e) {
                setAlertStatus('error');
                switch(e.response.status) {
                    case 401: {
                        setFlashMessage('Login failed.');
                        break;
                    }
                    default :{
                        setFlashMessage('Unexpected error is caused. Please try again.');
                        break;
                    }
                }
            }
        } else {
            setAlertStatus('error');
            setFlashMessage('Form is unfulfilled.');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Admin Account
                </Typography>
                <Typography variant="body1">Login and start managing the server.</Typography>
                {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                <form className={classes.form} onSubmit={handleSubmit} method="post">
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Account Name"
                        name="username"
                        value={username}
                        onChange={onChange}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Login
                    </Button>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
