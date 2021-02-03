import React, { useContext, useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './common/Widget.Title';
import client from '../../lib/client';
import { WSocketContext } from '../../context/ws';
import { Link as RouterLink } from 'react-router-dom';

interface roomInfoItem {
    ruid: string
    roomName: string
    onlinePlayers: number
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function RoomWidget() {
    const classes = useStyles();
    const [roomInfoList, setRoomInfoList] = useState([] as roomInfoItem[]);
    const ws = useContext(WSocketContext);

    const getRoomList = async () => {
        try {
            const result = await client.get('/api/v1/room');
            if(result.status === 200) {
                const roomList: string[] = result.data;
                const roomInfoList: roomInfoItem[] = await Promise.all(roomList.map(async (ruid) => {
                    const result = await client.get('/api/v1/room/'+ruid);
                    return {
                        ruid: ruid,
                        roomName: result.data.roomName,
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
        <React.Fragment>
            <Title>Current Game Rooms</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>RUID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Online Players</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {roomInfoList.slice(0,3).map((item, idx) => (
                        <TableRow key={idx} component={RouterLink} to={`/admin/room/${item.ruid}`}>
                            <TableCell>{item.ruid}</TableCell>
                            <TableCell>{item.roomName}</TableCell>
                            <TableCell align="right">{item.onlinePlayers}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore}>
                <Link component={RouterLink} to="/admin/roomlist" variant="body2" color="primary">
                    See all game rooms
                </Link>
            </div>
        </React.Fragment>
    );
}
