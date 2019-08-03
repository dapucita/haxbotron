// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const scheduler = {
    advertise: '📢 Haxbotron - Open source, Free to use\n💬 [디스코드 채팅] https://discord.gg/qfg45B2'
    ,shutdown: '📢 방이 곧 닫힙니다. 이용해주셔서 감사합니다.'
    ,afkKick: '📢 잠수로 인한 퇴장'
    ,afkDetect: '📢 @{targetName}#{targetID}님이 잠수중입니다. 아무 키나 눌러주세요. 계속 잠수시 퇴장당할 수 있습니다.'
}

export const command = {
    _ErrorWrongCommand : '❌ 잘못된 명령어입니다. 📑 !help 또는 !help COMMAND로 자세히 알아보세요.'
    ,_ErrorNoPermission: '❌ admin만 이 명령어를 사용할 수 있습니다.'
    ,help: '📄 !about, stats, statsreset, afk, poss, streak, list\n📑 !help COMMAND로 자세히 보기 (예: !help stats)\n📑 !help admin 을 입력하여 관리자용 명령어를 볼 수 있습니다.'
    ,helpadmin: '📄 !freeze, mute\n📑 !help COMMAND로 자세히 보기'
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ 요청하신 명령어에 대한 설명이 없습니다.'
        ,help: '📑 !help COMMAND : COMMAND 명령어의 자세한 설명을 보여줍니다.'
        ,about: '📑 !about : 봇의 정보를 보여줍니다.'
        ,stats: '📑 !stats : 스탯을 다른 사람들에게 보여줍니다. 📑 !statsreset로 리셋합니다.'
        ,statsreset: '📑 !statsreset : 스탯을 초기화합니다. 다시 복구할 수 없습니다.'
        ,poss: '📑 !poss : 양 팀의 공 점유율을 보여줍니다.'
        ,streak: '📑 !streak : 현재 연승팀과 연승 횟수를 보여줍니다.'
        ,afk: '📑 !afk MSG : 잠수 모드를 설정하거나 해제합니다. MSG에 이유를 쓸 수도 있습니다.'
        ,list: '📑 !list red/blue/spec : 해당 팀의 명단을 보여줍니다. 간략한 정보가 담겨있습니다.'
        ,freeze: '📑 !freeze : 방 전체 채팅을 얼리거나 녹입니다. admin만 할 수 있습니다.'
        ,mute: '📑 !mute #ID : 해당 ID의 플레이어를 음소거하거나 해제합니다. ID는 숫자이어야 합니다. (예: !mute #12)\n 📑 /list red,blue,spec 명령어로 각 팀의 숫자아이디를 확인할 수 있습니다.'
    } 
    ,about: '📄 이 방은 Haxbotron 봇에 의해 운영됩니다. 봇 시작 {_LaunchTime}.\n💬 [디스코드 채팅] https://discord.gg/qfg45B2'
    ,stats: '📊 {targetName}#{ticketTarget}님: 총 {targetStatsTotal}판(승률 {targetStatsWinRate}%), 골 {targetStatsGoals}, 어시 {targetStatsAssists}, 자책 {targetStatsOgs}, 실점 {targetStatsLosepoints}, 패스성공률 {targetStatsPassSuccess}%.'
    ,statsreset: '📊 스탯을 초기화했습니다. 다시 복구할 수 없습니다.'
    ,poss: '📊 점유율 : Red {possTeamRed}%, Blue {possTeamBlue}%.'
    ,streak: '📊 {streakTeamName}팀이 {streakTeamCount}판째 연승중입니다!'
    ,afk: {
        setAfk: '💤 {targetName}#{ticketTarget}님이 지금부터 잠수합니다... ({targetAfkReason})'
        ,unAfk: '📢 {targetName}#{ticketTarget}님이 잠수를 풀고 복귀합니다!'
    }
    ,mute: {
        _ErrorNoPermission: '❌ admin만 이 명령어를 사용할 수 있습니다.'
        ,_ErrorNoPlayer: '❌ 접속중이지 않은 player입니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: /mute #12)\n📑 /list red,blue,spec 명령어로 각 팀의 숫자아이디를 확인할 수 있습니다.'
        ,successMute: '🔇 {targetName}#{ticketTarget}님을 음소거했습니다.'
        ,successUnmute: '🔊 {targetName}#{ticketTarget}님의 음소거를 해제했습니다.'
    }
    ,super: {
        _ErrorWrongCommand: '❌ 잘못된 super 명령어입니다.'
        ,_ErrorNoPermission: '❌ super admin만 이 명령어를 사용할 수 있습니다.'
        ,_ErrorLoginAlready: '❌ 이미 super admin입니다. 📑 !super logout로 로그아웃할 수 있습니다.'
        ,defaultMessage: '📄 Haxbotron 봇을 관리하기 위한 super 명령어입니다.'
        ,loginSuccess: '🔑 로그인 성공. super 권한을 부여받았습니다.'
        ,logoutSuccess: '🔑 로그아웃 완료. super 권한을 반납하였습니다.'
        ,loginFail: '❌ 로그인에 실패하였습니다.'
        ,loginFailNoKey: '❌ 로그인에 실패하였습니다. 인증키를 입력해야 합니다.'
        ,thor: {
            noAdmins: '❌ 방장권한을 회수할 플레이어가 남아있지 않습니다.'
            ,complete: '🔑 방장 권한을 획득하였습니다.'
            ,deprive: '🔑 다른 방장의 권한을 회수하고 대신하였습니다.'
        }
        ,kick: {
            noID: '❌ 잘못된 플레이어ID입니다. 퇴장시킬 수 없습니다.'
            ,kickMsg: '📢 퇴장'
            ,kickSuccess: '📢 해당 플레이어를 퇴장시켰습니다.'
        }
        ,banclear: {
            complete: '🔑 밴 목록을 초기화했습니다.'
        }
    }
    ,list: {
        _ErrorNoTeam: '❌ red, blue, spec 팀 중 하나를 지정해야 합니다.'
        ,_ErrorNoOne: '❌ 해당 팀에 아무도 없습니다.'
        ,whoisList: '📜 {whoisResult}'
    }
    ,freeze: {
        _ErrorNoPermission : '❌ admin만 이 명령어를 사용할 수 있습니다.'
        ,onFreeze: '🔇 방장이 채팅을 비활성화했습니다. 명령어는 사용할 수 있습니다. 📄 !help'
        ,offFreeze: '🔊 방장이 채팅을 활성화했습니다. 이제 말할 수 있습니다.' 
    }
}

export const funcUpdateAdmins = {
    newAdmin: '📢 {playerName}#{playerID}님이 새로운 방장이 되었습니다.'
}

export const onJoin = {
    welcome: '📢 {playerName}#{playerID}님 반갑습니다! 📄 !help로 도움말을 볼 수 있습니다.'
    ,changename: '📢 {playerName}#{playerID}님이 {playerNameOld}에서 닉네임을 변경하였습니다.'
    ,startRecord: '📊 충분한 인원이 모였습니다. 지금부터 스탯 기록이 될 것입니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 현재 상태에선 스탯 기록이 되지 않습니다.'
    ,doubleJoinningMsg: '🚫 {playerName}#{playerID}님이 중복 접속하였습니다.'
    ,doubleJoinningKick: '🚫 중복 접속으로 퇴장'
    ,banList: '🚫 자동밴:{banListReason}'
}

export const onLeft = {
    startRecord: '📊 충분한 인원이 모였습니다. 지금부터 스탯 기록이 될 것입니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 현재 상태에선 스탯 기록이 되지 않습니다.'
}

export const onChat = {
    mutedChat: '🔇 음소거되어 채팅을 할 수 없습니다. 명령어는 사용할 수 있습니다.'
}

export const onTeamChange = {
    afkPlayer: '🚫 {targetPlayerName}#{targetPlayerID}님은 잠수중이라 팀을 옮길 수 없습니다. ({targetAfkReason})'
}

export const onStart = {
    startRecord: '📊 충분한 인원이 모였습니다. 지금부터 스탯 기록이 될 것입니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 현재 상태에선 스탯 기록이 되지 않습니다.'
}

export const onStop = {

}

export const onVictory = {
    victory: '🎉 경기 종료! 스코어 {redScore}:{blueScore} !! ⚽️'
    ,burning: '🔥 {streakTeamName} 팀이 {streakTeamCount}연승중입니다 !!'
}

export const onKick = {
    cannotBan: '🚫 일반 퇴장만 시킬 수 있습니다. 영구퇴장은 취소됩니다.'
    ,notifyNotBan: '🚫 {kickedName}#{kickedID}님의 영구퇴장이 취소되었습니다. 다시 접속할 수 있습니다.'
}

export const onStadium = {
    loadNewStadium: '📁 {stadiumName} 맵이 새로 열렸습니다.'
    ,cannotChange: '🚫 맵을 변경할 수 없습니다.'
}

export const onTouch = {

}

export const onGoal = {
    goal: '⚽️ {scorerName}#{scorerID}님의 득점!'
    ,goalWithAssist: '⚽️ {scorerName}#{scorerID}님의 득점! {assistName}#{assistID}님이 어시스트했습니다.'
    ,og: '⚽️ {ogName}#{ogID}님이 자책골을 넣었습니다...'
}

export const onAdminChange = {
    afknoadmin: '🚫 잠수 중인 플레이어는 admin이 될 수 없습니다.'
}