const { ipcRenderer } = require('electron');

const roomInfoSubmitBtn = document.getElementById('launchButton');
const roomTitle = document.getElementById('roomTitle');
const roomPassword = document.getElementById('roomPassword');
const roomHostName = document.getElementById('roomHostName');
const roomMaxPlayers = document.getElementById('roomMaxPlayers');
const roomPublicCheck = document.getElementById('roomPublicCheck');
const roomAuthToken = document.getElementById('roomAuthToken');

const announceMsgSendBtn = document.getElementById('announceMsgSendButton');
const announceMsgBox = document.getElementById('announceMsg');

const superKeyBox = document.getElementById('superKeyList');
const superKeyGenerateBtn = document.getElementById('superKeyGenerateButton');
const superKeyEditBtn = document.getElementById('superKeyEditButton');
const superKeyApplyBtn = document.getElementById('superKeyApplyButton');

roomInfoSubmitBtn.addEventListener('click', function() {
    let renderedRoomInfo = { // object literal from RoomConfig written in TypeScript
        roomName : roomTitle.value,
        password : roomPassword.value,
        public : roomPublicCheck.checked,
        playerName : roomHostName.value,
        maxPlayers : roomMaxPlayers.value,
        token : roomAuthToken.value
    };
    ipcRenderer.send('room-make-action', renderedRoomInfo); // send
});

announceMsgSendBtn.addEventListener('click', function() {
    ipcRenderer.send('msg-send-action', announceMsgBox.value); // send
    announceMsgBox.value = ''; // init
});

superKeyGenerateBtn.addEventListener('click', function() {
    let newKey = generateRandKey();
    if(superKeyBox.value != '') {
        superKeyBox.value = superKeyBox.value + '\r\n' + newKey;
    } else { // if the first line
        superKeyBox.value = newKey;
    }
});
superKeyEditBtn.addEventListener('click', function() {
    superKeyBox.readOnly = false; // unlock to edit
    superKeyBox.style.backgroundColor = '#ffffff';
});
superKeyApplyBtn.addEventListener('click', function() {
    superKeyBox.readOnly = true; // lock to edit
    superKeyBox.style.backgroundColor = '#bebebe';
    if(superKeyBox.value != '') { // if not empty
        //let keyList = superKeyBox.value.split('\n').filter(eachKey => eachKey!=''); // only not empty lines
        ipcRenderer.send('super-key-action', superKeyBox.value); // send
    } else { // if empty
        alert('Error: there\'s no any super key.');
    }
});

function generateRandKey() { // from https://stackoverflow.com/questions/1497481
    var length = 20,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}