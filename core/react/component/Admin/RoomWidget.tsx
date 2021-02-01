import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './common/Widget.Title';
import client from '../../lib/client';

interface roomInfoItem {
    ruid: string
    roomName: string
    onlinePlayers: number
}

function preventDefault(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function RoomWidget() {
    const classes = useStyles();
    const [roomInfoList, setRoomInfoList] = useState([] as roomInfoItem[]);

    useEffect(() => {
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
        getRoomList();

        return (() => {
            setRoomInfoList([]);
        });
    }, []);

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
                    {roomInfoList.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.ruid}</TableCell>
                            <TableCell>{item.roomName}</TableCell>
                            <TableCell align="right">{item.onlinePlayers}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className={classes.seeMore}>
                <Link color="primary" href="#" onClick={preventDefault}>
                    See all game rooms
        </Link>
            </div>
        </React.Fragment>
    );
}
