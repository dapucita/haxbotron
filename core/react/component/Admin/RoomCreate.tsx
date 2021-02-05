import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Copyright from '../common/Footer.Copyright';
import Title from './common/Widget.Title';
import { BrowserHostRoomCommands, BrowserHostRoomConfig, BrowserHostRoomGameRule, BrowserHostRoomHEloConfig, BrowserHostRoomSettings, ReactHostRoomInfo } from '../../../lib/browser.hostconfig';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as DefaultConfigSet from "../../lib/defaultroomconfig.json";
import { useHistory } from 'react-router-dom';
import { Divider, IconButton, Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import client from '../../lib/client';
import Alert from '../common/Alert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

interface styleClass {
    styleClass: any
}

type AlertColor = 'success' | 'info' | 'warning' | 'error';

const getSavedRoomConfig = (): ReactHostRoomInfo => {
    let savedRoomInfo: ReactHostRoomInfo = DefaultConfigSet;
    if (localStorage.getItem('_savedRoomInfo') !== null) savedRoomInfo = JSON.parse(localStorage.getItem('_savedRoomInfo')!);
    return savedRoomInfo;
}

export default function RoomCreate({ styleClass }: styleClass) {
    const classes = styleClass;
    const fixedHeightPaper = clsx(classes.paper, classes.fullHeight);
    const history = useHistory();
    const [flashMessage, setFlashMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState("success" as AlertColor);

    const [roomConfigComplex, setRoomConfigComplex] = useState({} as ReactHostRoomInfo); // Total complex of Room Config (will be sent with API request body)
    
    const [configFormField, setConfigFormField] = useState({} as BrowserHostRoomConfig); // Room Configuration Form
    const [roomUIDFormField, setRoomUIDFormField] = useState(''); // RUID Field
    const [roomPublicFormField, setRoomPublicFormField] = useState(true); // Room as Public Field (switch toggle component)

    const [rulesFormField, setRulesFormField] = useState({} as BrowserHostRoomGameRule); // Game Rule Configuration Form
    const [rulesTeamLockField, setRulesTeamLockField] = useState(true); // Team Lock Field in Game Rule configuration form
    const [rulesSwitchesFormField, setRulesSwitchesFormField] = useState({ // three switches(auitoAdmin, autoOpertaing, statsRecrod)
        autoAdmin: false // auto appointment admin
        ,autoOperating: true // auto emcee mode
        ,statsRecord: true // record game results on statistics system.
    });

    const [settingsFormField, setSettingsFormField] = useState({} as BrowserHostRoomSettings); // Bot Settings Configuration Form
    const [settingsFormStringifiedField, setSettingsFormStringifiedField] = useState(''); // JSON Stringified Bot Settings Configuration Form

    const [heloFormField, setHeloFormField] = useState({} as BrowserHostRoomHEloConfig); // HElo System Configruation Form
    const [heloFormStringifiedField, setHeloFormStringifiedField] = useState(''); // JSON Stringified HElo System Configruation Form

    const [commandsFormField, setCommandsFormField] = useState({} as BrowserHostRoomCommands); // Ingame Commands Configuration Form
    const [commandsFormStringifiedField, setCommandsFormStringifiedField] = useState(''); // JSON Stringified Ingame Commands Configuration Form

    useEffect(() => {
        // LOAD DEFAULT OR LASTEST SETTINGS WHEN THIS COMPONENT IS LOADED
        const loadedDefaultSettings: ReactHostRoomInfo = getSavedRoomConfig();

        setRoomUIDFormField(loadedDefaultSettings.ruid);
        
        setConfigFormField(loadedDefaultSettings._config);
        setRoomPublicFormField(loadedDefaultSettings._config.public); // switch toggle component
        
        setRulesFormField(loadedDefaultSettings.rules);
        setRulesTeamLockField(loadedDefaultSettings.rules.requisite.teamLock); // switch toggle component
        setRulesSwitchesFormField({autoAdmin: loadedDefaultSettings.rules.autoAdmin, autoOperating: loadedDefaultSettings.rules.autoOperating, statsRecord: loadedDefaultSettings.rules.statsRecord}); // switch toggle component
        
        setSettingsFormField(loadedDefaultSettings.settings);
        setSettingsFormStringifiedField(JSON.stringify(loadedDefaultSettings.settings,null,4));
        
        setHeloFormField(loadedDefaultSettings.helo);
        setHeloFormStringifiedField(JSON.stringify(loadedDefaultSettings.helo,null,4));
        
        setCommandsFormField(loadedDefaultSettings.commands);
        setCommandsFormStringifiedField(JSON.stringify(loadedDefaultSettings.commands,null,4));

        

        return () => {
            // WHEN UNMOUNTED
            setRoomUIDFormField(loadedDefaultSettings.ruid);
            
            setConfigFormField(loadedDefaultSettings._config);
            setRoomPublicFormField(loadedDefaultSettings._config.public); // switch toggle component
            
            setRulesFormField(loadedDefaultSettings.rules);
            setRulesTeamLockField(loadedDefaultSettings.rules.requisite.teamLock); // switch toggle component
            setRulesSwitchesFormField({autoAdmin: loadedDefaultSettings.rules.autoAdmin, autoOperating: loadedDefaultSettings.rules.autoOperating, statsRecord: loadedDefaultSettings.rules.statsRecord}); // switch toggle component
            
            setSettingsFormField(loadedDefaultSettings.settings);
            setSettingsFormStringifiedField(JSON.stringify(loadedDefaultSettings.settings));
        
            setHeloFormField(loadedDefaultSettings.helo);
            setHeloFormStringifiedField(JSON.stringify(loadedDefaultSettings.helo));
        
            setCommandsFormField(loadedDefaultSettings.commands);
            setCommandsFormStringifiedField(JSON.stringify(loadedDefaultSettings.commands));
        }
    }, []);

    useEffect(() => {
        // SAVE ONTO CONFIG COMPLEX WHEN EACH STATES ARE CHANGED
        setRoomConfigComplex({
            ruid: roomUIDFormField,
            _config: { ...configFormField, public: roomPublicFormField }, // include switch toggle component
            settings: settingsFormField,
            rules: {
                ...rulesFormField
                ,requisite: { ...rulesFormField.requisite, teamLock: rulesTeamLockField }
                ,autoAdmin: rulesSwitchesFormField.autoAdmin
                ,autoOperating: rulesSwitchesFormField.autoOperating
                ,statsRecord: rulesSwitchesFormField.statsRecord
            },
            helo: heloFormField,
            commands: commandsFormField
        });
    }, [roomUIDFormField, roomPublicFormField, configFormField, // include switch toggle component
        rulesFormField, rulesTeamLockField, rulesSwitchesFormField,
        settingsFormField, heloFormField, commandsFormField
    ]); 

    useEffect(() => {
        try {
            const parsedSettings: BrowserHostRoomSettings = JSON.parse(settingsFormStringifiedField);
            setSettingsFormField(parsedSettings);

            const parsedHElo: BrowserHostRoomHEloConfig = JSON.parse(heloFormStringifiedField);
            setHeloFormField(parsedHElo);

            const parsedCommands: BrowserHostRoomCommands = JSON.parse(commandsFormStringifiedField);
            setCommandsFormField(parsedCommands);
        } catch(e) {
            //console.log("PARSING ERROR!!");
        }
    }, [settingsFormStringifiedField,heloFormStringifiedField,commandsFormStringifiedField])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (true) {
            // create room
            try {
                setFlashMessage('The game room is being created. Please wait.');
                setAlertStatus("info");
                const result = await client.post(`/api/v1/room`, roomConfigComplex);
                if (result.status === 201) {
                    setFlashMessage('The game room has been created.');
                    setAlertStatus("success");
                    // save as lastest settings value (it will be loaded as default next time)
                    localStorage.setItem('_savedRoomInfo', JSON.stringify(roomConfigComplex));
                    // redirect to room list page
                    history.push('/admin/roomlist');
                }
            } catch (error) {
                setFlashMessage('Unexpected error is caused. Please try again.');
                setAlertStatus("error");
                switch (error.response?.status) {
                    case 400: {
                        setFlashMessage('Configuration schema is unfulfilled.');
                        setAlertStatus("error");
                        break;
                    }
                    case 401: {
                        setFlashMessage('Rejected.');
                        setAlertStatus("error");
                        break;
                    }
                    case 409: {
                        setFlashMessage('The same RUID value is already in use.');
                        setAlertStatus("error");
                        break;
                    }
                }
                setTimeout(() => {
                    setFlashMessage('');
                }, 3000);
            }
        }
    }

    const handleReset = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        localStorage.removeItem('_savedRoomInfo');
        history.push('/admin/roomlist');
    }

    const handleJSONBeautify  = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        try {
            setSettingsFormStringifiedField(JSON.stringify(settingsFormField,null,4));
            setHeloFormStringifiedField(JSON.stringify(heloFormField,null,4));
            setCommandsFormStringifiedField(JSON.stringify(commandsFormField,null,4));
        } catch (error) {
            //console.log("JSON Beautify Error : \n" + error);
        }
    }

    const onChangeRUID = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomUIDFormField(e.target.value);
    }

    const onChangePublic = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomPublicFormField(e.target.checked); // switch toggle component
    }

    const onChangeTeamLock = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRulesTeamLockField(e.target.checked); // switch toggle component
    }

    const onChangeRoomConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfigFormField({
            ...configFormField,
            [name]: value
        });
    }

    const onChangeRules = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRulesFormField({
            ...rulesFormField,
            [name]: value
        });
    }

    const onChangeRulesSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target; // switch toggle component
        setRulesSwitchesFormField({
            ...rulesSwitchesFormField,
            [name]: checked
        });
    }

    const onChangeRulesRequisite = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRulesFormField({
            ...rulesFormField,
            requisite: {
                ...rulesFormField.requisite,
                [name]: value
            }
        });
    }

    const onChangeStringifiedField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch(name) {
            case 'botSettings': {
                setSettingsFormStringifiedField(value);
                break;
            }
            case 'heloConfig': {
                setHeloFormStringifiedField(value);
                break;
            }
            case 'gameCommands': {
                setCommandsFormStringifiedField(value);
                break;
            }
        }
    }

    return (
        <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={fixedHeightPaper}>
                        <React.Fragment>
                            {flashMessage && <Alert severity={alertStatus}>{flashMessage}</Alert>}
                            <Title>Create New Game Room</Title>
                        </React.Fragment>

                        <React.Fragment>
                            <form className={classes.form} onSubmit={handleSubmit} method="post">
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Button fullWidth type="submit" variant="contained" color="primary" className={classes.submit}>Create</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <Button fullWidth type="reset" variant="contained" color="secondary" className={classes.submit} onClick={handleReset}>Reset</Button>
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <Button type="button" variant="text" color="default" className={classes.submit} onClick={handleJSONBeautify}>Beautify JSON</Button>
                                    </Grid>
                                </Grid>
                                <Divider />

                                <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>Room Configuration</Typography>
                                <Typography component="h2" variant="subtitle2" color="inherit" gutterBottom>Do not reuse the same RUID and token if they are already in use.</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            fullWidth id="ruid" name="ruid" label="RUID" variant="outlined" margin="normal" size="small" required autoFocus value={roomUIDFormField} onChange={onChangeRUID}
                                        />
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <TextField
                                            fullWidth id="token" name="token" label="Headless Token" variant="outlined" margin="normal" size="small" required value={configFormField.token} onChange={onChangeRoomConfig}
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={1}>
                                        <IconButton onClick={() => window.open('https://www.haxball.com/headlesstoken', '_blank')} edge="start" size="medium" aria-label="get token">
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch id="public" name="public" size="small" checked={roomPublicFormField} onChange={onChangePublic} color="primary" />}
                                            label="Public" labelPlacement="top"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={8} sm={4}>
                                        <TextField
                                            fullWidth id="roomName" name="roomName" label="Room Title" variant="outlined" margin="normal" size="small" required value={configFormField.roomName} onChange={onChangeRoomConfig}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            fullWidth id="password" name="password" label="Password" variant="outlined" margin="normal" size="small" value={configFormField.password} onChange={onChangeRoomConfig}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth id="maxPlayers" name="maxPlayers" label="Max Players" variant="outlined" margin="normal" type="number" size="small" required value={configFormField.maxPlayers} onChange={onChangeRoomConfig}
                                        />
                                    </Grid>
                                </Grid>
                                <Divider />

                                {/* Game Rules */}
                                <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>Game Rules</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField.ruleName} onChange={onChangeRules} id="ruleName" name="ruleName" label="Rule Name" variant="outlined" margin="normal" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={8} sm={4}>
                                        <TextField
                                            fullWidth value={rulesFormField.ruleDescription} onChange={onChangeRules} id="ruleDescription" name="ruleDescription" label="Rule Description" variant="outlined" margin="normal" size="small" required
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField?.requisite && rulesFormField.requisite.minimumPlayers} onChange={onChangeRulesRequisite} id="minimumPlayers" name="minimumPlayers" label="Minimum Players Need" variant="outlined" margin="normal" type="number" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField?.requisite && rulesFormField.requisite.eachTeamPlayers} onChange={onChangeRulesRequisite} id="eachTeamPlayers" name="eachTeamPlayers" label="Number of Team Players" variant="outlined" margin="normal" type="number" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField?.requisite && rulesFormField.requisite.timeLimit} onChange={onChangeRulesRequisite} id="timeLimit" name="timeLimit" label="Time Limit" variant="outlined" margin="normal" type="number" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField?.requisite && rulesFormField.requisite.scoreLimit} onChange={onChangeRulesRequisite} id="scoreLimit" name="scoreLimit" label="Score Limit" variant="outlined" margin="normal" type="number" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch onChange={onChangeTeamLock} checked={rulesTeamLockField} id="teamLock" name="teamLock" size="small" color="primary" />}
                                            label="Team Lock" labelPlacement="top"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch onChange={onChangeRulesSwitch} checked={rulesSwitchesFormField.autoAdmin} id="autoAdmin" name="autoAdmin" size="small" color="primary" />}
                                            label="Auto Admin" labelPlacement="start"
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch onChange={onChangeRulesSwitch} checked={rulesSwitchesFormField.autoOperating} id="autoOperating" name="autoOperating" size="small" color="primary" />}
                                            label="Auto Operating" labelPlacement="start"
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <FormControlLabel
                                            control={<Switch onChange={onChangeRulesSwitch} checked={rulesSwitchesFormField.statsRecord} id="statsRecord" name="statsRecord" size="small" color="primary" />}
                                            label="Stats Recording" labelPlacement="start"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField.defaultMapName} onChange={onChangeRules} id="defaultMapName" name="defaultMapName" label="Default Map Name" variant="outlined" margin="normal" size="small" required
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={2}>
                                        <TextField
                                            fullWidth value={rulesFormField.readyMapName} onChange={onChangeRules} id="readyMapName" name="readyMapName" label="Ready Map Name" variant="outlined" margin="normal" size="small" required
                                        />
                                    </Grid>
                                </Grid>
                                <Divider />

                                <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>Bot Settings</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth value={settingsFormStringifiedField} onChange={onChangeStringifiedField} id="botSettings" name="botSettings" label="JSON Data" variant="outlined" margin="normal" required multiline
                                        />
                                    </Grid>
                                </Grid>
                                <Divider />

                                <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>HElo Configuration</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth value={heloFormStringifiedField} onChange={onChangeStringifiedField} id="heloConfig" name="heloConfig" label="JSON Data" variant="outlined" margin="normal" required multiline
                                        />
                                    </Grid>
                                </Grid>
                                <Divider />

                                <Typography component="h2" variant="subtitle1" color="primary" gutterBottom>Game Commands</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth value={commandsFormStringifiedField} onChange={onChangeStringifiedField} id="gameCommands" name="gameCommands" label="JSON Data" variant="outlined" margin="normal" required multiline
                                        />
                                    </Grid>
                                </Grid>
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
