import React, { useState } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useHistory, withRouter } from 'react-router-dom';
import client from '../../lib/client';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Mainboard from './Mainboard';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import RoomList from './RoomList';
import ServerInfo from './ServerInfo';
import RoomCreate from './RoomCreate';
import RoomLog from './RoomLog';
import MainboardSideMenu from './SideMenu/Mainboard.SideMenu';
import RoomListSideMenu from './SideMenu/RoomList.SideMenu';
import RoomInfoSideMenu from './SideMenu/RoomInfo.SideMenu';
import RoomPower from './RoomPower';
import RoomSuperAdmin from './RoomSuperAdmin';
import RoomInfo from './RoomInfo';
import RoomBanList from './RoomBanList';
import RoomPlayerList from './RoomPlayerList';
import RoomSocial from './RoomSocial';
import RoomTextFilter from './RoomTextFilter';
import RoomAssets from './RoomAssets';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    fullHeight: {
        height: '100%',
    },
    halfHeight: {
        height: '50%',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    halfInput: {
        width: '50%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Dashboard({ match }: RouteComponentProps) {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(true); // dashboard sidemenu
    const [noti, setNoti] = useState(0); // notification alarm count
    const [styleClass, setStyleClass] = useState(classes);

    const onClickLogout = async () => {
        try {
            const result = await client.delete('/api/v1/auth');
            if (result.status === 204) {
                history.push('/');
            }
        } catch (e) { }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Haxbotron Administrative Dashboard
                    </Typography>
                    <IconButton color="inherit">
                        <Badge color="secondary">
                            <HelpOutlineIcon onClick={() => window.open('https://github.com/dapucita/haxbotron/wiki', '_blank')} />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge badgeContent={noti} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge color="secondary">
                            <SettingsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge color="secondary">
                            <PowerSettingsNewIcon onClick={onClickLogout} />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                { /* Side Menu */ }
                <Switch>
                    <Route path={match.path} exact><MainboardSideMenu /></Route>
                    <Route path={`${match.path}/roomlist`}><RoomListSideMenu /></Route>
                    <Route path={`${match.path}/newroom`}><RoomListSideMenu /></Route>
                    <Route path={`${match.path}/serverinfo`}><MainboardSideMenu /></Route>
                    <Route path={`${match.path}/superadmin/:ruid`} component={RoomInfoSideMenu} />
                    <Route path={`${match.path}/banlist/:ruid`} component={RoomInfoSideMenu} />
                    <Route path={`${match.path}/room/:ruid`} component={RoomInfoSideMenu} />
                </Switch>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                { /* Main Content */ }
                <Switch>
                    <Route path={match.path} render={()=><Mainboard styleClass={styleClass} />} exact />
                    <Route path={`${match.path}/roomlist`} render={()=><RoomList styleClass={styleClass} />} />
                    <Route path={`${match.path}/newroom`} render={()=><RoomCreate styleClass={styleClass} />} />
                    <Route path={`${match.path}/serverinfo`} render={()=><ServerInfo styleClass={styleClass} />} />
                    <Route path={`${match.path}/superadmin/:ruid`}><RoomSuperAdmin styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/banlist/:ruid`} exact><RoomBanList styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid`} exact><RoomLog styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/info`}><RoomInfo styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/power`}><RoomPower styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/player`}><RoomPlayerList styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/social`}><RoomSocial styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/filter`}><RoomTextFilter styleClass={styleClass} /></Route>
                    <Route path={`${match.path}/room/:ruid/assets`}><RoomAssets styleClass={styleClass} /></Route>
                    <Route component={NotFound} />
                </Switch>
            </main>
        </div>
    );
}

export default withRouter(Dashboard);
