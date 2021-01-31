import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';

export const mainListItems = (
    <div>
        <ListItem button>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary="Game Room" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Game Rooms</ListSubheader>
        <ListItem button>
            <ListItemIcon>
                <VideogameAssetIcon />
            </ListItemIcon>
            <ListItemText primary="testroom1" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <VideogameAssetIcon />
            </ListItemIcon>
            <ListItemText primary="testroom2" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <VideogameAssetIcon />
            </ListItemIcon>
            <ListItemText primary="testroom3" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <VideogameAssetIcon />
            </ListItemIcon>
            <ListItemText primary="testroom4" />
        </ListItem>
        <ListItem button>
            <ListItemIcon>
                <VideogameAssetIcon />
            </ListItemIcon>
            <ListItemText primary="testroom5" />
        </ListItem>
    </div>
);
