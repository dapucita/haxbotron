import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id: number, ruid: string, title: string, amount: number) {
    return { id, ruid, title, amount };
}

const rows = [
    createData(0, 'testroom1', '4:4 핫휴 승릴', 3),
    createData(1, 'testroom2', '4:4 핫휴 클관', 13),
    createData(2, 'testroom3', '수다방', 5),
    createData(3, 'testroom4', '수다방', 0),
    createData(4, 'testroom5', '1:1 챌린지', 12),
];

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
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.ruid}</TableCell>
                            <TableCell>{row.title}</TableCell>
                            <TableCell align="right">{row.amount}</TableCell>
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
