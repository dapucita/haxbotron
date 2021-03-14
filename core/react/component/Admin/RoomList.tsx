import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Title from './common/Widget.Title';
import client from '../../lib/client';
import { WSocketContext } from '../../context/ws';
import { Link as RouterLink } from 'react-router-dom';
import { Divider } from '@material-ui/core';

interface styleClass {
    styleClass: any
}

interface roomInfoItem {
    ruid: string
    roomName: string
    roomLink: string
    onlinePlayers: number
}

interface ruidListItem {
    ruid: string
}

interface allRoomListItem {
    ruid: string
    online: boolean
}



export default function RoomList({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);

    const [roomInfoList, setRoomInfoList] = useState([] as roomInfoItem[]);
    const [allRoomList, setAllRoomList] = useState([] as allRoomListItem[]);
    const ws = useContext(WSocketContext);

    const getRoomList = async () => {
        try {
            const result = await client.get('/api/v1/room');
            if (result.status === 200) {
                const roomList: string[] = result.data;
                const roomInfoList: roomInfoItem[] = await Promise.all(roomList.map(async (ruid) => {
                    const result = await client.get(`/api/v1/room/${ruid}/info`);
                    return {
                        ruid: ruid,
                        roomName: result.data.roomName,
                        roomLink: result.data._link,
                        onlinePlayers: result.data.onlinePlayers
                    }
                }));

                setRoomInfoList(roomInfoList);
            }
        } catch (e) { }
    }

    const getAllRUIDList = async () => {
        try {
            const result = await client.get('/api/v1/ruidlist');
            if (result.status === 200) {
                const allRuidList: ruidListItem[] = result.data;
                const onlineRoomList = await client.get(`/api/v1/room`)
                                                .then((response) => {return response.data as string[]})
                                                .catch((error) => {return [] as string[]});
                const allRoomList: allRoomListItem[] = await Promise.all(allRuidList.map(async (item) => {
                    return {
                        ruid: item.ruid,
                        online: onlineRoomList?.includes(item.ruid) || false
                    }
                }));
                setAllRoomList(allRoomList);
            }
        } catch (e) { }
    }

    useEffect(() => {
        getRoomList();
        getAllRUIDList();

        return (() => {
            setRoomInfoList([]);
            setAllRoomList([]);
        });
    }, []);

    useEffect(() => { // websocket with socket.io
        ws.on('roomct', (content: any) => {
            setRoomInfoList([]);
            setAllRoomList([]);

            getRoomList();
            getAllRUIDList();
        });
        ws.on('joinleft', (content: any) => {
            setRoomInfoList([]);

            getRoomList();
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
                            <Title>Current Game Rooms</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">RUID</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="right">Link</TableCell>
                                        <TableCell align="right">Online Players</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roomInfoList.map((item, idx) => (
                                        <TableRow key={idx} component={RouterLink} to={`/admin/room/${item.ruid}`}>
                                            <TableCell align="left">{item.ruid}</TableCell>
                                            <TableCell>{item.roomName}</TableCell>
                                            <TableCell align="right">{item.roomLink}</TableCell>
                                            <TableCell align="right">{item.onlinePlayers}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                        <Divider />

                        <React.Fragment>
                            <Title>All Rooms List</Title>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">RUID</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {allRoomList.map((item, idx) => (
                                        <TableRow key={idx} component={RouterLink} to={`/admin/room/${item.ruid}`}>
                                            <TableCell align="left">{item.ruid}</TableCell>
                                            <TableCell align="right">{item.online ? "online" : "offline"}</TableCell>
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
