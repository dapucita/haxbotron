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
import { WSocketContext } from '../../context/ws';
import { useParams } from 'react-router-dom';
import { Collapse, Divider, IconButton, makeStyles, Typography } from '@material-ui/core';
import Alert, { AlertColor } from '../common/Alert';
import { Player } from '../../../game/model/GameObject/Player';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


interface styleClass {
    styleClass: any
}

interface matchParams {
    ruid: string
}

interface PlayerStorage {
    auth: string;
    conn: string;
    name: string;
    rating: number;
    totals: number;
    disconns: number;
    wins: number;
    goals: number;
    assists: number;
    ogs: number;
    losePoints: number;
    balltouch: number;
    passed: number;
    mute: boolean;
    muteExpire: number;
    rejoinCount: number;
    joinDate: number;
    leftDate: number;
    malActCount: number;
}

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function OnlinePlayerRow(props: { row: Player }) {
    const { row } = props;
    const classes = useRowStyles();
    const [open, setOpen] = useState(false);

    const convertTeamID = (teamID: number): string => {
        if (teamID === 1) return 'Red';
        if (teamID === 2) return 'Blue';
        return 'Spec';
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.name}#{row.id}</TableCell>
                <TableCell>{row.auth}</TableCell>
                <TableCell>{row.conn}</TableCell>
                <TableCell>{convertTeamID(row.team)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Statistics
                            </Typography>
                            <Table size="small" aria-label="statistics">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Wins/Totals</TableCell>
                                        <TableCell>Goals</TableCell>
                                        <TableCell>Assists</TableCell>
                                        <TableCell>OGs</TableCell>
                                        <TableCell>Lose Points</TableCell>
                                        <TableCell>Pass Succ</TableCell>
                                        <TableCell>Disconnections</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                {row.stats.rating}
                                            </TableCell>
                                            <TableCell>{row.stats.wins}/{row.stats.totals} ({Math.round(row.stats.wins/row.stats.totals*100)||0}%)</TableCell>
                                            <TableCell>{row.stats.goals}</TableCell>
                                            <TableCell>{row.stats.assists}</TableCell>
                                            <TableCell>{row.stats.ogs}</TableCell>
                                            <TableCell>{row.stats.losePoints}</TableCell>
                                            <TableCell>{Math.round(row.stats.passed/row.stats.balltouch*100)||0}%</TableCell>
                                            <TableCell>{row.stats.disconns}</TableCell>
                                        </TableRow>
                                    
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function RoomPlayerList({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const ws = useContext(WSocketContext);
    const matchParams: matchParams = useParams();
    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [pagingOrder, setPagingOrder] = useState(1);

    const [onlinePlayerList, setOnlinePlayerList] = useState([] as Player[]);

    const getOnlinePlayersID = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/player`);
            if (result.status === 200) {
                const onlinePlayersID: number[] = result.data;
                const onlinePlayersInfoList: Player[] = await Promise.all(onlinePlayersID.map(async (playerID) => {
                    const result: Player = await client.get(`/api/v1/room/${matchParams.ruid}/player/${playerID}`)
                                                        .then((response) => {return response.data})
                                                        .catch((e) => {return e});
                    return result;
                }));

                setOnlinePlayerList(onlinePlayersInfoList);
            }
        } catch (e) {
            setFlashMessage('Failed to load list.');
            setAlertStatus('error');
        }
    }

    useEffect(() => {
        getOnlinePlayersID();

        return (() => {
            setOnlinePlayerList([]);
        });
    }, []);

    useEffect(() => { // websocket with socket.io
        ws.on('roomct', (content: any) => {
            if (content.ruid === matchParams.ruid) {
                getOnlinePlayersID();
            }
        });
        ws.on('joinleft', (content: any) => {
            if (content.ruid === matchParams.ruid) {
                getOnlinePlayersID();
            }
        });
        return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
        }
    }, [ws]);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Online Players</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Name</TableCell>
                                        <TableCell>AUTH</TableCell>
                                        <TableCell>CONN</TableCell>
                                        <TableCell>Team</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {onlinePlayerList && onlinePlayerList.map((item, idx) => (
                                        <OnlinePlayerRow key={idx} row={item} />
                                    ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                        <Divider />
                    </Paper>
                </Grid>
            </Grid>
            <Box pt={4}>
                <Copyright />
            </Box>
        </Container>
    );
}
