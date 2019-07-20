// if you want to implement 'click' member using objects from index.ts, you should to do it in index.ts not here. (you can't use ipcrender)

const template = [{
        label: 'Application',
        submenu: [{
                id: 'startMenuItem',
                label: 'Start'
            },
            {
                id: 'stopMenuItem',
                enabled: false,
                label: 'Stop'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'View',
        submenu: [{
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: 'Command',
        submenu: [
        {
            id: 'announceCommandMenuItem',
            enabled: false,
            label: 'Announce a message'
        }, {
            id: 'superAdminLoginKeyMenuItem',
            label: 'Login keys for Super admin'
        }
    ]
    },
    {
        label: 'Setting',
        submenu: [{
            id: 'headlessModeMenuItem',
            type: 'checkbox',
            checked: false,
            label: 'headless mode'
        }
        ]
    },
    {
        label: 'Help',
        submenu: [{
                label: 'Check for Updates'
            },
            {
                type: 'separator'
            },
            {
                label: 'Website',
                click() {
                    require('electron').shell.openExternal('https://dapucita.github.io/haxbotron/')
                }
            },
            {
                label: 'About'
            }
        ]
    }
];

module.exports = template;