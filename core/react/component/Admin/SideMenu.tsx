import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

export const mainMenuList = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
    </div>
);

export const secondaryMenuList = (
    <div>
        <ListSubheader inset>Management</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary="Game Rooms" />
        </ListItem>
    </div>
);
