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

interface styleClass {
    styleClass: any
}

interface roomInfoItem {
    ruid: string
    roomName: string
    roomLink: string
    onlinePlayers: number
}

export default function RoomList({ styleClass }: styleClass) {
    const classes = styleClass;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [roomInfoList, setRoomInfoList] = useState([] as roomInfoItem[]);
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

    useEffect(() => {
        getRoomList();

        return (() => {
            setRoomInfoList([]);
        });
    }, []);

    useEffect(() => { // websocket with socket.io
        ws.on('roomct', (content: any) => {
            setRoomInfoList([]);
            getRoomList();
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
                                        <TableCell>Link</TableCell>
                                        <TableCell align="right">Online Players</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roomInfoList.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="left">{item.ruid}</TableCell>
                                            <TableCell>{item.roomName}</TableCell>
                                            <TableCell>{item.roomLink}</TableCell>
                                            <TableCell align="right">{item.onlinePlayers}</TableCell>
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
