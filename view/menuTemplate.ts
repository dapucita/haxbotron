const template = [
    {
    label: 'Bot',
    submenu: [
        { label: 'Start' },
        { label: 'Stop' },
        { type: 'separator' },
        { label: 'Quit' }
    ]
    },
    {
    label: 'View',
    submenu: [
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
    ]
    },
    {
    role: 'window',
    submenu: [
        {role: 'minimize'},
        {role: 'close'}
    ]
    },
    {
    role: 'help',
    submenu: [
        {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
    ]
    }
];

module.exports = template;