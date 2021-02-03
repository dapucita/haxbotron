import React, { useContext, useEffect, useState } from 'react';
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
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Button, TextField, Typography } from '@material-ui/core';

interface styleClass {
    styleClass: any
}

interface superAdminItem {
    key: string
    description: string
}

interface matchParams {
    ruid: string
}

export default function RoomSuperAdmin({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const [superAdminKeyList, setSuperAdminKeyList] = useState([] as superAdminItem[]);

    const [flashMessage, setFlashMessage] = useState('');
    const [newAdminKey, setNewAdminKey] = useState('');

    const getSuperAdminKeyList = async () => {
        try {
            const result = await client.get(`/api/v1/superadmin/${matchParams.ruid}`);
            if (result.status === 200) {
                const keyList: superAdminItem[] = result.data;
                setSuperAdminKeyList(keyList);
            }
        } catch (error) {
            if(error.response.status === 404) {
                setFlashMessage('Failed to load list.');
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }

    const onChangeNewAdminKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAdminKey(e.target.value);
    }

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/superadmin/${matchParams.ruid}`, {
                key: newAdminKey
                ,description: `registered at ${new Date()}`
            } as superAdminItem);
            if (result.status === 201) {
                setFlashMessage('Successfully added.');
                setNewAdminKey('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to register the key.');
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
                            <Typography variant="body1">{flashMessage}</Typography>
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
                            </form>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Key</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {superAdminKeyList.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="left">{item.key}</TableCell>
                                            <TableCell>{item.description}</TableCell>
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
