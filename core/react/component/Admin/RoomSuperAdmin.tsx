import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './common/Widget.Title';
import client from '../../lib/client';
import { useParams } from 'react-router-dom';
import { Button, IconButton, TextField, Typography } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import Alert, { AlertColor } from '../common/Alert';

interface styleClass {
    styleClass: any
}

interface superAdminItem {
    key: string
    description: string
}

// interface matchParams {
//     ruid: string
// }

function generateRandKey() { // from https://stackoverflow.com/questions/1497481
    var length = 20,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

export default function RoomSuperAdmin({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams = useParams<"ruid">();

    const [superAdminKeyList, setSuperAdminKeyList] = useState([] as superAdminItem[]);

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [newAdminKey, setNewAdminKey] = useState('');

    const getSuperAdminKeyList = async () => {
        try {
            const result = await client.get(`/api/v1/superadmin/${matchParams.ruid}`);
            if (result.status === 200) {
                const keyList: superAdminItem[] = result.data;
                setSuperAdminKeyList(keyList);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setFlashMessage('Failed to load list.');
                setAlertStatus('error');
                setSuperAdminKeyList([]);
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
                setAlertStatus('error');
            }
        }
    }

    const onChangeNewAdminKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAdminKey(e.target.value);
    }

    const onClickKeyDelete = async (key: string) => {
        try {
            const result = await client.delete(`/api/v1/superadmin/${matchParams.ruid}/${key}`);
            if (result.status === 204) {
                setFlashMessage('Successfully deleted.');
                setAlertStatus('success');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to delete the key.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
        getSuperAdminKeyList();
    }

    const onClickKeyGenerate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setNewAdminKey(generateRandKey());
    }

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/superadmin/${matchParams.ruid}`, {
                key: newAdminKey
                , description: `registered at ${new Date()}`
            } as superAdminItem);
            if (result.status === 204) {
                setFlashMessage('Successfully added.');
                setAlertStatus('success');
                setNewAdminKey('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to register the key.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
        getSuperAdminKeyList();
    }

    useEffect(() => {
        getSuperAdminKeyList();
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Super Admin Keys</Title>
                            <Typography variant="body1">Super admin is an ingame player who has adminstrative permissions.</Typography>
                            <form className={classes.form} onSubmit={handleAdd} method="post">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    size="small"
                                    id="newadminkey"
                                    label="Super Admin Key"
                                    name="newadminkey"
                                    value={newAdminKey}
                                    onChange={onChangeNewAdminKey}
                                    className={classes.halfInput}
                                />
                                <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Add</Button>
                                <Button onClick={onClickKeyGenerate} size="small" type="button" variant="contained" color="inherit" className={classes.submit}>Generate</Button>
                            </form>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Key</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {superAdminKeyList.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="left">{item.key}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell align="right">
                                                <IconButton name={item.key} onClick={() => onClickKeyDelete(item.key)} aria-label="delete" className={classes.margin}>
                                                    <BackspaceIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
