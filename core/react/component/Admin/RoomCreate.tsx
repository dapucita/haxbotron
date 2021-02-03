import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { ReactHostRoomInfo } from '../../../lib/browser.hostconfig';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as DefaultConfigSet from "../../lib/defaultroomconfig.json";
import { useHistory } from 'react-router-dom';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

interface styleClass {
    styleClass: any
}

function getSavedRoomConfig(): ReactHostRoomInfo {
    let savedRoomInfo: ReactHostRoomInfo = DefaultConfigSet;
    if (localStorage.getItem('_savedRoomInfo') !== null) savedRoomInfo = JSON.parse(localStorage.getItem('_savedRoomInfo')!);
    return savedRoomInfo;
}

export default function RoomCreate({ styleClass }: styleClass) {

    //TODO: REMAKE THIS....
    const classes = styleClass;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const savedRoomInfo: ReactHostRoomInfo = getSavedRoomConfig();

    const history = useHistory();

    const [roomInfoConfig, setRoomInfoConfig] = useState(savedRoomInfo);
    const [flashMessage, setFlashMessage] = useState('');

    const [roomUID, setRoomUID] = useState(roomInfoConfig.ruid);
    const [roomConfigForm, setRoomConfigForm] = useState(roomInfoConfig._config);
    const [roomSettingsForm, setRoomSettingsForm] = useState(roomInfoConfig.settings);
    //const [roomRulesForm, setRoomRulesForm] = useState(roomInfoConfig.rules);
    //const [roomHEloForm, setRoomHEloForm] = useState(roomInfoConfig.helo);

    const [formConfigField, setFormConfigField] = useState()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        localStorage.setItem('_savedRoomInfo', JSON.stringify(roomInfoConfig));
        history.push('/admin/roomlist');
    }

    const handleReset = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        localStorage.removeItem('_savedRoomInfo');
        setRoomInfoConfig(DefaultConfigSet);

        setRoomConfigForm(roomInfoConfig._config);
        setRoomSettingsForm(roomInfoConfig.settings);
        history.push('/admin/roomlist');
    }

    const onChangeRUID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomUID(e.target.value);
    }
    const onChangePublic = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setRoomConfigForm({
            ...roomConfigForm,
            public: checked
        })
    }
    const onChangeRoomConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoomConfigForm({
            ...roomConfigForm,
            [name]: value
        });
        setRoomInfoConfig({
            ...roomInfoConfig
            ,_config: roomConfigForm
        });
    }
    const onChangeRoomSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRoomSettingsForm({
            ...roomSettingsForm,
            [name]: value
        });
        setRoomInfoConfig({
            ...roomInfoConfig
            ,settings: roomSettingsForm
        });
    }

    useEffect(() => {
        
    }, []);

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            <Typography variant="body1">{flashMessage}</Typography>
                            <Title>Create New Game Room</Title>
                            <form className={classes.form} onSubmit={handleSubmit} method="post">
                                <Button type="submit" variant="contained" color="primary" className={classes.submit}>Create</Button>
                                <Button type="reset" variant="contained" color="secondary" className={classes.submit} onClick={handleReset}>Reset</Button>
                                <TextField
                                    id="ruid" name="ruid" label="RUID" variant="outlined" margin="normal" required autoFocus value={roomUID} onChange={onChangeRUID} 
                                />
                                <TextField
                                    id="roomName" name="roomName" label="Title" variant="outlined" margin="normal" required value={roomInfoConfig._config.roomName} onChange={onChangeRoomConfig} 
                                />
                                <TextField
                                    id="password" name="password" label="Password" variant="outlined" margin="normal" value={roomInfoConfig._config.password} onChange={onChangeRoomConfig} 
                                />
                                <TextField
                                    id="maxPlayers" name="maxPlayers" label="Max Players" variant="outlined" margin="normal" type="number" required value={roomInfoConfig._config.maxPlayers} onChange={onChangeRoomConfig} 
                                />
                                <FormControlLabel
                                    control={<Switch id="public" name="public" checked={roomInfoConfig._config.public} onChange={onChangePublic} color="primary" />}
                                    label="Public"
                                />
                                <TextField
                                    id="token" name="token" label="Token" variant="outlined" margin="normal" required value={roomInfoConfig._config.token} onChange={onChangeRoomConfig} 
                                />
                            </form>
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
