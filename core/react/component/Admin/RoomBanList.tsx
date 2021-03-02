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
import { Button, Divider, IconButton, TextField, Typography } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';
import Alert, { AlertColor } from '../common/Alert';
import { isNumber } from '../../lib/numcheck';

interface styleClass {
    styleClass: any
}

interface banListItem {
    conn: string
    reason: string
    register: number
    expire: number
}

interface newBanFields {
    conn: string
    reason: string
    seconds: number
}

interface matchParams {
    ruid: string
}

export default function RoomBanList({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const matchParams: matchParams = useParams();

    const [banList, setBanList] = useState([] as banListItem[]);
    const [newBan, setNewBan] = useState({ conn: '', reason: '', seconds: 0 } as newBanFields);

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [pagingOrder, setPagingOrder] = useState(1);
    const [pagingCount, setPagingCount] = useState(10);
    const [pagingCountInput, setPagingCountInput] = useState('10');

    const convertDate = (timestamp: number): string => {
        return new Date(timestamp).toLocaleString();
    }

    const getBanList = async (page: number) => {
        const index: number = (page - 1) * pagingCount;
        try {
            const result = await client.get(`/api/v1/banlist/${matchParams.ruid}?start=${index}&count=${pagingCount}`);
            if (result.status === 200) {
                const banList: banListItem[] = result.data;
                setBanList(banList);
            }
        } catch (error) {
            setAlertStatus('error');
            if (error.response.status === 404) {
                setFlashMessage('Failed to load list.');
                setBanList([]);
            } else {
                setFlashMessage('Unexpected error is caused. Please try again.');
            }
        }
    }

    const onClickBanDelete = async (conn: string) => {
        try {
            const result = await client.delete(`/api/v1/banlist/${matchParams.ruid}/${conn}`);
            if (result.status === 204) {
                setFlashMessage('Successfully deleted.');
                setAlertStatus('success');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to delete the ban.');
            setTimeout(() => {
                setFlashMessage('');
                setAlertStatus('error');
            }, 3000);
        }
        getBanList(pagingOrder);
    }

    const onClickPaging = (move: number) => {
        if (pagingOrder + move >= 1) {
            setPagingOrder(pagingOrder + move);
            getBanList(pagingOrder + move);
        }
    }

    const onChangePagingCountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPagingCountInput(e.target.value);

        if (isNumber(parseInt(e.target.value))) {
            const count: number = parseInt(e.target.value);
            if (count >= 1) {
                setPagingCount(count);
            }
        }
    }

    const onChangeNewBan = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "newbanseconds" && isNumber(parseInt(value))) {
            setNewBan({
                ...newBan,
                seconds: parseInt(value)
            });
        } else {
            setNewBan({
                ...newBan,
                [name]: value
            });
        }
    }

    const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/banlist/${matchParams.ruid}`, {
                conn: newBan.conn,
                reason: newBan.reason,
                seconds: newBan.seconds
            });
            if (result.status === 204) {
                setFlashMessage('Successfully banned.');
                setAlertStatus('success');
                setNewBan({ conn: '', reason: '', seconds: 0 });
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to ban.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
        getBanList(pagingOrder);
    }

    useEffect(() => {
        getBanList(1);
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Ban List</Title>
                            <Grid container spacing={2}>
                                <form className={classes.form} onSubmit={handleAdd} method="post">
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={newBan.conn} onChange={onChangeNewBan}
                                            id="conn" label="CONN" name="conn"
                                        />
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={newBan.reason} onChange={onChangeNewBan}
                                            id="reason" label="Reason" name="reason"
                                        />
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={newBan.seconds} onChange={onChangeNewBan} type="number"
                                            id="seconds" label="Ban Time(secs)" name="seconds"
                                        />
                                        <Button size="small" type="submit" variant="contained" color="primary" className={classes.submit}>Ban</Button>
                                    </Grid>
                                </form>
                            </Grid>
                            <Divider />

                            <Grid container spacing={1}>
                                <Grid item xs={8} sm={4}>
                                    {/* previous page */}
                                    <Button onClick={() => onClickPaging(-1)} size="small" type="button" variant="outlined" color="inherit" className={classes.submit}>&lt;&lt;</Button>
                                    {/* next page */}
                                    <Button onClick={() => onClickPaging(1)} size="small" type="button" variant="outlined" color="inherit" className={classes.submit}>&gt;&gt;</Button>

                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        size="small"
                                        id="pagingCountInput"
                                        label="Paging Items Count"
                                        name="pagingCountInput"
                                        type="number"
                                        value={pagingCountInput}
                                        onChange={onChangePagingCountInput}
                                    />

                                    <Typography>Page {pagingOrder}</Typography>
                                </Grid>

                            </Grid>
                            <Divider />

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>CONN</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Registered Date</TableCell>
                                        <TableCell>Expiration Date</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {banList.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.conn}</TableCell>
                                            <TableCell>{item.reason}</TableCell>
                                            <TableCell>{convertDate(item.register)}</TableCell>
                                            <TableCell>{convertDate(item.expire)}</TableCell>
                                            <TableCell align="right">
                                                <IconButton name={item.conn} onClick={() => onClickBanDelete(item.conn)} aria-label="delete" className={classes.margin}>
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
