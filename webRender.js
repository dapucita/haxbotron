const { ipcRenderer } = require('electron');

const roomInfoSubmitBtn = document.getElementById('launchButton');
const roomTitle = document.getElementById('roomTitle');
const roomPassword = document.getElementById('roomPassword');
const roomHostName = document.getElementById('roomHostName');
const roomMaxPlayers = document.getElementById('roomMaxPlayers');
const roomPublicCheck = document.getElementById('roomPublicCheck');
const roomAuthToken = document.getElementById('roomAuthToken');

roomInfoSubmitBtn.addEventListener('click', function() {
    let renderedRoomInfo = { // object literal from RoomConfig written in TypeScript
        roomName : roomTitle.value,
        password : roomPassword.value,
        public : roomPublicCheck.checked,
        playerName : roomHostName.value,
        maxPlayers : roomMaxPlayers.value,
        token : roomAuthToken.value
    };

    ipcRenderer.send('room-make-action', renderedRoomInfo);
});

