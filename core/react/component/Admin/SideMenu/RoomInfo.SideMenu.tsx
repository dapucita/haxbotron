import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DnsIcon from '@material-ui/icons/Dns';
import SendIcon from '@material-ui/icons/Send';
import FilterListIcon from '@material-ui/icons/FilterList';
import AttachmentIcon from '@material-ui/icons/Attachment';

interface matchParams {
    ruid: string
}

export default function RoomInfoSideMenu() {
    const matchParams: matchParams = useParams();
    
    const [paramRUID, setParmRUID] = useState(matchParams.ruid);

    return (
        <>
            <List>
                <div>
                    <ListItem button component={RouterLink} to="/admin">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/admin/roomlist">
                        <ListItemIcon>
                            <SportsEsportsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Room List" />
                    </ListItem>
                </div>
            </List>
            <Divider />
            <List>
                <div>
                    <ListSubheader inset>{paramRUID}</ListSubheader>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}`}>
                        <ListItemIcon>
                            <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log Messages" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/info`}>
                        <ListItemIcon>
                            <DnsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Information" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/social`}>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        <ListItemText primary="Social" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/filter`}>
                        <ListItemIcon>
                            <FilterListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Text Filter" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/player`}>
                        <ListItemIcon>
                            <PeopleAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Player List" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/banlist/${paramRUID}`}>
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ban List" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/superadmin/${paramRUID}`}>
                        <ListItemIcon>
                            <VpnKeyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Super Admin" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/assets`}>
                        <ListItemIcon>
                            <AttachmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Assets" />
                    </ListItem>
                    <ListItem button component={RouterLink} to={`/admin/room/${paramRUID}/power`}>
                        <ListItemIcon>
                            <CancelPresentationIcon />
                        </ListItemIcon>
                        <ListItemText primary="Close this room" />
                    </ListItem>
                </div>
            </List>
        </>
    );
}
