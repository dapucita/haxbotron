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
                role: 'resetzoom'
            },
            {
                role: 'zoomin'
            },
            {
                role: 'zoomout'
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