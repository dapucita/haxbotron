import React from 'react';
import { Link as RouterLink  } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function MainboardSideMenu() {
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
                </div>
            </List>
            <Divider />
            <List>
                <div>
                    <ListSubheader inset>Management</ListSubheader>
                    <ListItem button component={RouterLink} to="/admin/newroom">
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="New Room" />
                    </ListItem>
                    <ListItem button component={RouterLink} to="/admin/roomlist">
                        <ListItemIcon>
                            <SportsEsportsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Room List" />
                    </ListItem>
                </div>
            </List>
        </>
    );
}
