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
import { Button, Collapse, Divider, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import Alert, { AlertColor } from '../common/Alert';
import { Player } from '../../../game/model/GameObject/Player';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { isNumber } from '../../lib/numcheck';


interface styleClass {
    styleClass: any
}

// interface matchParams {
//     ruid: string
// }

interface newBanFields {
    reason: string
    seconds: number
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

const convertDate = (timestamp: number): string => {
    if (timestamp === -1) return 'Permanent';
    return new Date(timestamp).toLocaleString();
}

function OnlinePlayerRow(props: { ruid: string, row: Player }) {
    const { ruid, row } = props;
    const classes = useRowStyles();
    const [open, setOpen] = useState(false);

    const [newBan, setNewBan] = useState({ reason: '', seconds: 0 } as newBanFields);

    const [whisperMessage, setWhisperMessage] = useState('');

    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const convertTeamID = (teamID: number): string => {
        if (teamID === 1) return 'Red';
        if (teamID === 2) return 'Blue';
        return 'Spec';
    }

    const makePermissionsText = (admin: boolean, superAdmin: boolean): string => {
        let text: string[] = [];
        if (admin) text.push('Admin');
        if (superAdmin) text.push('SuperAdmin');
        return text.join(',');
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

    const onChangeWhisperMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWhisperMessage(e.target.value);
    }

    const handleWhisper = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.post(`/api/v1/room/${ruid}/chat/${row.id}`, { message: whisperMessage });
            if (result.status === 201) {
                setFlashMessage('Successfully sent.');
                setAlertStatus('success');
                setWhisperMessage('');
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            setAlertStatus('error');
            switch (error.response.status) {
                case 400: {
                    setFlashMessage('No message.');
                    break;
                }
                case 401: {
                    setFlashMessage('No permission.');
                    break;
                }
                case 404: {
                    setFlashMessage('No exists room or player.');
                    break;
                }
                default: {
                    setFlashMessage('Unexpected error is caused. Please try again.');
                    break;
                }
            }
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const handleKick = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const result = await client.delete(`/api/v1/room/${ruid}/player/${row.id}`, {
                data: {
                    ban: false,
                    seconds: newBan.seconds,
                    message: newBan.reason
                }
            });
            if (result.status === 204) {
                setFlashMessage('Successfully kicked.');
                setAlertStatus('success');
                setNewBan({ reason: '', seconds: 0 });
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to kick.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    const handleOnlinePlayerMute = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        try {
            if(row.permissions.mute) {
                const result = await client.delete(`/api/v1/room/${ruid}/player/${row.id}/permission/mute`);
                if (result.status === 204) {
                    setFlashMessage('Successfully unmuted.');
                    setAlertStatus('success');
                    setTimeout(() => {
                        setFlashMessage('');
                    }, 3000);
                }
            } else {
                const result = await client.post(`/api/v1/room/${ruid}/player/${row.id}/permission/mute`, { muteExpire: -1 }); // Permanent
                if (result.status === 204) {
                    setFlashMessage('Successfully muted.');
                    setAlertStatus('success');
                    setTimeout(() => {
                        setFlashMessage('');
                    }, 3000);
                }
            }
        } catch (error) {
            //error.response.status
            setFlashMessage('Failed to mute/unmute.');
            setAlertStatus('error');
            setTimeout(() => {
                setFlashMessage('');
            }, 3000);
        }
    }

    return (
        <React.Fragment>
            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
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
                <TableCell>
                    <Button size="small" type="button" variant="text" color="default" onClick={handleOnlinePlayerMute} >
                        {row.permissions.mute ? 'Unmute' : 'Mute'}
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Grid container spacing={4}>
                                <form onSubmit={handleWhisper} method="post">
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={whisperMessage} onChange={onChangeWhisperMessage}
                                            id="whisper" label="Whisper" name="whisper"
                                        />
                                        <Button size="small" type="submit" variant="outlined" color="primary">Send</Button>
                                    </Grid>
                                </form>
                                <form onSubmit={handleKick} method="post">
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={newBan.reason} onChange={onChangeNewBan}
                                            id="reason" label="Reason" name="reason"
                                        />
                                        <TextField
                                            variant="outlined" margin="normal" required size="small" value={newBan.seconds} onChange={onChangeNewBan} type="number"
                                            id="seconds" label="Time(secs)" name="seconds"
                                        />
                                        <Button size="small" type="submit" variant="outlined" color="secondary">Kick</Button>
                                    </Grid>
                                </form>
                            </Grid>
                            <Typography variant="h6" gutterBottom component="div">
                                Information
                            </Typography>
                            <Table size="small" aria-label="statistics">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Permissions</TableCell>
                                        <TableCell>AFK</TableCell>
                                        <TableCell>Mute</TableCell>
                                        <TableCell>Mute Expiration</TableCell>
                                        <TableCell>Voted</TableCell>
                                        <TableCell>Join Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">{makePermissionsText(row.admin, row.permissions.superadmin)}</TableCell>
                                        <TableCell>{row.permissions.afkmode ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{row.permissions.mute ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{row.permissions.muteExpire === 0 ? '-' : convertDate(row.permissions.muteExpire)}</TableCell>
                                        <TableCell>{row.voteGet}</TableCell>
                                        <TableCell>{convertDate(row.entrytime.joinDate)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

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
                                        <TableCell>{row.stats.wins}/{row.stats.totals} ({Math.round(row.stats.wins / row.stats.totals * 100) || 0}%)</TableCell>
                                        <TableCell>{row.stats.goals}</TableCell>
                                        <TableCell>{row.stats.assists}</TableCell>
                                        <TableCell>{row.stats.ogs}</TableCell>
                                        <TableCell>{row.stats.losePoints}</TableCell>
                                        <TableCell>{Math.round(row.stats.passed / row.stats.balltouch * 100) || 0}%</TableCell>
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

function PlayerAccountRow(props: { idx: number, row: PlayerStorage }) {
    const { idx, row } = props;
    const classes = useRowStyles();
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell>{row.auth}</TableCell>
                <TableCell>{row.conn}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Information
                            </Typography>
                            <Table size="small" aria-label="player information">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Muted</TableCell>
                                        <TableCell>Mute Expiration</TableCell>
                                        <TableCell>Rejoin Count</TableCell>
                                        <TableCell>Join</TableCell>
                                        <TableCell>Left</TableCell>
                                        <TableCell>Malicious Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={idx}>
                                        <TableCell component="th" scope="row">
                                            {row.mute ? 'Yes' : 'no'}
                                        </TableCell>
                                        <TableCell>{row.muteExpire === 0 ? '-' : convertDate(row.muteExpire)}</TableCell>
                                        <TableCell>{row.rejoinCount}</TableCell>
                                        <TableCell>{row.joinDate === 0 ? '-' : convertDate(row.joinDate)}</TableCell>
                                        <TableCell>{row.leftDate === 0 ? '-' : convertDate(row.leftDate)}</TableCell>
                                        <TableCell>{row.malActCount}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <Typography variant="h6" gutterBottom component="div">
                                Statistics
                            </Typography>
                            <Table size="small" aria-label="player information">
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
                                    <TableRow key={idx}>
                                        <TableCell component="th" scope="row">
                                            {row.rating}
                                        </TableCell>
                                        <TableCell>{row.wins}/{row.totals} ({Math.round(row.wins / row.totals * 100) || 0}%)</TableCell>
                                        <TableCell>{row.goals}</TableCell>
                                        <TableCell>{row.assists}</TableCell>
                                        <TableCell>{row.ogs}</TableCell>
                                        <TableCell>{row.losePoints}</TableCell>
                                        <TableCell>{Math.round(row.passed / row.balltouch * 100) || 0}%</TableCell>
                                        <TableCell>{row.disconns}</TableCell>
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
    const matchParams = useParams<"ruid">();
    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [pagingOrder, setPagingOrder] = useState(1);
    const [pagingCount, setPagingCount] = useState(10);
    const [pagingCountInput, setPagingCountInput] = useState('10');

    const [onlinePlayerList, setOnlinePlayerList] = useState([] as Player[]);
    const [playerAccountList, setPlayerAccountList] = useState([] as PlayerStorage[]);

    const onClickPaging = (move: number) => {
        if (pagingOrder + move >= 1) {
            setPagingOrder(pagingOrder + move);
            getPlayerAccountList(pagingOrder + move);
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

    const getPlayerAccountList = async (page: number) => {
        const index: number = (page - 1) * pagingCount;
        try {
            const result = await client.get(`/api/v1/playerlist/${matchParams.ruid}?start=${index}&count=${pagingCount}`);
            if (result.status === 200) {
                const playerAccounts: PlayerStorage[] = result.data;

                setPlayerAccountList(playerAccounts);
            }
        } catch (e) {
            setFlashMessage('Failed to load accounts list.');
            setAlertStatus('error');
        }
    }

    const getOnlinePlayersID = async () => {
        try {
            const result = await client.get(`/api/v1/room/${matchParams.ruid}/player`);
            if (result.status === 200) {
                const onlinePlayersID: number[] = result.data;
                const onlinePlayersInfoList: Player[] = await Promise.all(onlinePlayersID.map(async (playerID) => {
                    const result: Player = await client.get(`/api/v1/room/${matchParams.ruid}/player/${playerID}`)
                        .then((response) => { return response.data })
                        .catch((e) => { return e });
                    return result;
                }));

                setOnlinePlayerList(onlinePlayersInfoList);
            }
        } catch (e) {
            setFlashMessage('Failed to load online players\' list.');
            setAlertStatus('error');
        }
    }

    useEffect(() => {
        getOnlinePlayersID();
        getPlayerAccountList(1);

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
        ws.on('statuschange', (content: any) => {
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
                                        <TableCell>Chat</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {onlinePlayerList && onlinePlayerList.map((item, idx) => (
                                        <OnlinePlayerRow key={idx} row={item} ruid={matchParams.ruid} />
                                    ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                        <Divider />

                        <React.Fragment>
                            <Title>Player Accounts List</Title>
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

                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>Name</TableCell>
                                            <TableCell>AUTH</TableCell>
                                            <TableCell>CONN</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {playerAccountList && playerAccountList.map((item, idx) => (
                                            <PlayerAccountRow key={idx} idx={idx} row={item} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
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
