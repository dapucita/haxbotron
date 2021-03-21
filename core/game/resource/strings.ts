// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const scheduler = {
    advertise: '📢 Haxbotron🤖 (https://dapucita.github.io/haxbotron/)\n💬 [디스코드] https://discord.gg/qfg45B2 [후원하기] https://www.patreon.com/dapucita'
    ,shutdown: '📢 방이 곧 닫힙니다. 이용해주셔서 감사합니다.'
    ,afkKick: '📢 잠수로 인한 퇴장'
    ,afkCommandTooLongKick: '📢 2분 이상 잠수로 퇴장'
    ,afkDetect: '📢 @{targetName}#{targetID}님이 잠수중입니다. 아무 키나 눌러주세요. 계속 잠수시 퇴장당할 수 있습니다.'
    ,autoUnmute: '🔊 {targetName}#{targetID}님의 음소거가 자동으로 해제되었습니다.'
    ,banVoteAutoNotify: '🗳️ 추방 투표가 진행중입니다 (!vote #ID) : {voteList}'
}

export const teamName = {
    specTeam: 'Spec'
    ,redTeam: 'Red'
    ,blueTeam: 'Blue'
}

export const antitrolling = {
    joinFlood: {
        banReason: '🚫 잦은 재접속(5분)'
        ,floodWarning: '📢 너무 짧은 시간에 재접속하면 퇴장될 수 있습니다.'
    }
    ,chatFlood: {
        muteReason: '🔇 {playerName}#{playerID}님이 채팅 도배로 음소거됐습니다.(3분) 관리자가 해제할 수 있습니다.'
    }
    ,ogFlood: {
        banReason: '🚫 연속 자책골(10분)'
    }
    ,banNoPermission: {
        banReason: '🚫 영구퇴장 금지(30초)'
    }
    ,kickAbusing: {
        banReason: '🚫 잦은 플레이어 킥(5분)'
        ,abusingWarning: '📢 너무 짧은 시간에 내보내면 퇴장될 수 있습니다.'
    }
    ,insufficientStartAbusing: {
        banReason: '🚫 팀 인원 미충족(5분)'
        ,abusingWarning: '📢 팀 인원을 채우지 않고 계속 진행하면 퇴장될 수 있습니다.'
    }
    ,afkAbusing: {
        cannotReason: '❌ 게임 중에는 잠수할 수 없습니다.'
    }
    ,gameAbscond: {
        banReason: '🚫 게임중 탈주(5분)'
    }
    ,malAct: {
        banReason: '🚫 악의적인 행위 감지'
    }
}

export const command = {
    _ErrorWrongCommand : '❌ 잘못된 명령어입니다. 📑 !help 또는 !help COMMAND로 자세히 알아보세요.'
    ,_ErrorNoPermission: '❌ 관리자만 이 명령어를 사용할 수 있습니다.'
    ,_ErrorDisabled: '❌ 현재 방에서는 사용할 수 없는 명령어입니다.'
    ,help: '📄 !about, notice, stats, statsreset, tier, afk, vote, poss, streak, scout, list\n📑 !help COMMAND로 자세히 보기 (예: !help stats)\n📑 !help admin 을 입력하여 관리자용 명령어를 볼 수 있습니다.'
    ,helpadmin: '📄 !freeze, mute\n📑 !help COMMAND로 자세히 보기'
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ 요청하신 명령어에 대한 설명이 없습니다.'
        ,help: '📑 !help COMMAND : 해당 COMMAND 명령어에 대한 자세한 설명을 보여줍니다.'
        ,about: '📑 !about : 봇의 정보를 보여줍니다.'
        ,stats: '📑 !stats : 전적과 레이팅을 보여줍니다. 📑 !statsreset로 초기화합니다.\n📑 !stats #ID : 해당 ID의 플레이어 전적과 레이팅을 봅니다. ID는 숫자이어야 합니다. (예: !stats #12)\n📑 !list red,blue,spec 명령어로 숫자아이디를 확인할 수 있습니다.'
        ,statsreset: '📑 !statsreset : 전적과 레이팅을 초기화합니다. 다시 복구할 수 없습니다.'
        ,poss: '📑 !poss : 양 팀의 공 점유율을 보여줍니다.'
        ,streak: '📑 !streak : 현재 연승팀과 연승 횟수를 보여줍니다.'
        ,afk: '📑 !afk MSG : 잠수 모드를 설정하거나 해제합니다. MSG에 이유를 쓸 수도 있습니다. 너무 오래 잠수하면 퇴장될 수 있습니다.'
        ,list: '📑 !list red/blue/spec : 해당 팀의 명단을 보여줍니다. 간략한 정보가 담겨있습니다.\n📑 !list mute : 음소거된 플레이어의 명단을 보여줍니다.\n📑 !list afk : 잠수중인 플레이어의 명단을 보여줍니다.'
        ,freeze: '📑 !freeze : 방 전체 채팅을 얼리거나 녹입니다. admin만 할 수 있습니다.'
        ,mute: '📑 !mute #ID : 해당 ID의 플레이어를 음소거하거나 해제합니다. ID는 숫자이어야 합니다. (예: !mute #12)\n📑 !list red,blue,spec,mute 명령어로 숫자아이디를 확인할 수 있습니다.'
        ,scout: '📑 !scout : 각 팀의 기대승률치를 보여줍니다. 팀 간의 비교는 아니며, 피타고리안 승률 공식의 변형을 사용합니다.'
        ,vote: '📑 !vote : 현재 추방 투표 현황과 본인의 투표 상태를 보여줍니다.\n📑 !vote #ID : 해당 ID의 플레이어에 대해 추방 투표를 하거나 취소합니다. ID는 숫자이어야 합니다. (예: !vote #12)'
        ,tier: '📑 !tier : 티어와 레이팅 시스템에 대한 정보를 보여줍니다.'
        ,notice: '📑 !notice : 공지사항을 보여줍니다.'
    } 
    ,about: '📄 방 이름 : {RoomName} ({_LaunchTime})\n💬 이 방은 Haxbotron🤖 봇에 의해 운영됩니다. (https://dapucita.github.io/haxbotron/)\n💬 [디스코드] https://discord.gg/qfg45B2 [후원하기] https://www.patreon.com/dapucita'
    ,stats: {
        _ErrorNoPlayer: '❌ 접속중이지 않습니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: !stats #12)\n📑 !list red,blue,spec 명령어로 숫자아이디를 확인할 수 있습니다.'
        ,statsMsg: '📊 {targetName}#{ticketTarget}님의 전적 (레이팅 {targetStatsRatingAvatar}{targetStatsRating}) 총 {targetStatsTotal}판(승률 {targetStatsWinRate}%), 연결끊김 {targetStatsDisconns}회 \n📊 (이어서) 골 {targetStatsGoals}, 도움 {targetStatsAssists}, 자책 {targetStatsOgs}, 실점 {targetStatsLosepoints}, 패스성공률 {targetStatsPassSuccess}%\n📊 (이어서) 경기당 {targetStatsGoalsPerGame}골, {targetStatsAssistsPerGame}도움과 {targetStatsOgsPerGame}자책, {targetStatsLostGoalsPerGame}실점을 기록중입니다.'
        ,matchAnalysis: '📊 (이어서) 현재 경기에서 {targetStatsNowGoals}골 {targetStatsNowAssists}도움 {targetStatsNowOgs}자책을 기록중입니다. (패스성공률 {targetStatsNowPassSuccess}%)'
    }
    ,statsreset: '📊 전적을 초기화했습니다. 다시 복구할 수 없습니다.'
    ,poss: '📊 점유율 : Red {possTeamRed}%, Blue {possTeamBlue}%.'
    ,streak: '📊 {streakTeamName}팀이 {streakTeamCount}판째 연승중입니다!'
    ,afk: {
        _WarnAfkTooLong: '📢 너무 오래 잠수하면 퇴장될 수 있습니다. (2분간 잠수시)'
        ,setAfk: '💤 {targetName}#{ticketTarget}님이 지금부터 잠수합니다... ({targetAfkReason})'
        ,unAfk: '📢 {targetName}#{ticketTarget}님이 잠수를 풀고 복귀합니다!'
        ,muteNotifyWarn: '❌ 음소거된 상태에서는 다른 플레이어에게 잠수 알림이 표시되지 않습니다.'
        ,startRecord: '📊 충분한 인원이 모였습니다. 지금부터 전적이 기록됩니다.'
        ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 지금은 전적이 기록되지 않습니다.'
    }
    ,mute: {
        _ErrorNoPermission: '❌ 관리자만 이 명령어를 사용할 수 있습니다.'
        ,_ErrorNoPlayer: '❌ 접속중이지 않습니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: !mute #12)\n📑 !list red,blue,spec,mute 명령어로 숫자아이디를 확인할 수 있습니다.'
        ,successMute: '🔇 {targetName}#{ticketTarget}님을 음소거했습니다.(3분) 해제하려면 mute 명령어를 다시 사용하세요.'
        ,successUnmute: '🔊 {targetName}#{ticketTarget}님의 음소거를 해제했습니다.'
        ,muteAbusingWarn: '❌ 해당 플레이어에 대해 곧바로 음소거할 수 없습니다.(3분)'
    }
    ,super: {
        _ErrorWrongCommand: '❌ 잘못된 슈퍼 관리자 명령어입니다.'
        ,_ErrorNoPermission: '❌ 슈퍼 관리자만 이 명령어를 사용할 수 있습니다.'
        ,_ErrorLoginAlready: '❌ 이미 슈퍼 관리자입니다. 📑 !super logout로 로그아웃할 수 있습니다.'
        ,defaultMessage: '📄 Haxbotron 봇을 관리하기 위한 super 명령어입니다.'
        ,loginSuccess: '🔑 로그인 성공. super 권한을 부여받았습니다.'
        ,logoutSuccess: '🔑 로그아웃 완료. super 권한을 반납하였습니다.'
        ,loginFail: '❌ 로그인에 실패하였습니다.'
        ,loginFailNoKey: '❌ 로그인에 실패하였습니다. 인증키를 입력해야 합니다.'
        ,thor: {
            noAdmins: '❌ 일반 관리자 권한을 회수할 플레이어가 남아있지 않습니다.'
            ,complete: '🔑 일반 관리자 권한을 획득하였습니다.'
            ,deprive: '🔑 다른 일반 관리자의 권한을 회수하고 대신하였습니다.'
        }
        ,kick: {
            noID: '❌ 잘못된 플레이어ID입니다. 퇴장시킬 수 없습니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: !super kick #12)'
            ,kickMsg: '📢 퇴장'
            ,kickSuccess: '📢 해당 플레이어를 퇴장시켰습니다.'
        }
        ,ban: {
            noID: '❌ 잘못된 플레이어ID입니다. 영구퇴장시킬 수 없습니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: !super ban #12)'
            ,banMsg: '📢 영구퇴장'
            ,banSuccess: '📢 해당 플레이어를 영구퇴장시켰습니다.'
        }
        ,banclear: {
            noTarget: '❌ 잘못된 밴 초기화 형식입니다. 현재는 📑 !super banclear all 만 가능합니다.'
            ,complete: '🔑 밴 목록을 초기화했습니다.'
        }
        ,banlist: {
            _ErrorNoOne: '❌ 해당 명단에 아무도 없습니다.'
            ,whoisList: '📜 {whoisResult}'
        }
    }
    ,list: {
        _ErrorNoTeam: '❌ red, blue, spec, mute, afk 중 명단 종류를 지정해야 합니다. (예: !list red)'
        ,_ErrorNoOne: '❌ 해당 명단에 아무도 없습니다.'
        ,whoisList: '📜 {whoisResult}'
    }
    ,freeze: {
        _ErrorNoPermission : '❌ 관리자만 이 명령어를 사용할 수 있습니다.'
        ,onFreeze: '🔇 관리자가 채팅을 전체 비활성화했습니다. 명령어는 사용할 수 있습니다. 📄 !help'
        ,offFreeze: '🔊 관리자가 채팅을 전체 활성화했습니다. 이제 말할 수 있습니다.' 
    }
    ,scout: {
        _ErrorNoMode : '❌ 충분한 인원이 모이지 않아 기대승률을 확인할 수 없습니다.'
        ,scouting: '📊 피타고리안 기대승률 : Red 팀 {teamExpectationRed}%, Blue 팀 {teamExpectationBlue}%, 대기팀 {teamExpectationSpec}%.'
    }
    ,vote: {
        _ErrorNoPlayer: '❌ 접속중이지 않습니다. #숫자아이디 의 형식으로 지정해야 합니다. (예: !vote #12)'
        ,_ErrorNoPermission: '❌ 인원이 부족하여 투표를 할 수 없습니다.'
        ,voteBanMessage: '🚫 투표에 의한 추방 (30분)'
        ,voteComplete: '🗳️ {targetName}#{targetID} 님에게 추방 투표를 하였습니다. 명령어를 다시 사용하여 취소할 수 있습니다.'
        ,voteCancel: '🗳️ {targetName}#{targetID} 님에 대한 추방 투표를 취소하였습니다.'
        ,voteIntroduce : '🗳️ 특정 플레이어에 대해 추방 투표를 하거나 취소할 수 있습니다. (예: !vote #12)'
        ,voteStatus : '🗳️ 현재 {targetName}#{targetID} 님에게 추방 투표를 한 상태입니다.'
        ,voteAutoNotify: '🗳️ 현재 추방 투표가 진행중입니다 : {voteList}'
    }
    ,tier: '📄 티어는 레이팅 점수에 따라 결정됩니다. 레이팅 점수는 !stats 명령어로 봅니다.\n📑 {tierAvatar9}{tierCutoff9} {tierAvatar8}{tierCutoff8} {tierAvatar7}{tierCutoff7} {tierAvatar6}{tierCutoff6} {tierAvatar5}{tierCutoff5} {tierAvatar4}{tierCutoff4} {tierAvatar3}{tierCutoff3} {tierAvatar2}{tierCutoff2} {tierAvatar1}{tierCutoff1}'
    ,notice: {
        _ErrorNoMessage: '❌ 현재 공지사항이 없습니다.'
    }
}

export const funcUpdateAdmins = {
    newAdmin: '📢 {playerName}#{playerID}님이 새로운 관리자가 되었습니다.\n📑 맵을 변경하거나, 다른 플레이어를 영구퇴장할 수는 없습니다.\n📑 !help admin 을 입력하여 관리자용 명령어를 볼 수 있습니다.'
}

export const onJoin = {
    welcome: '📢 {playerName}#{playerID}님 반갑습니다! 📄 !help로 도움말을 볼 수 있습니다.'
    ,changename: '📢 {playerName}#{playerID}님이 {playerNameOld}에서 닉네임을 변경하였습니다.'
    ,startRecord: '📊 충분한 인원이 모였습니다. 지금부터 전적이 기록됩니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 지금은 전적이 기록되지 않습니다.'
    ,doubleJoinningMsg: '🚫 {playerName}#{playerID}님이 중복 접속하였습니다.'
    ,doubleJoinningKick: '🚫 중복 접속으로 퇴장'
    ,tooLongNickname: '🚫 너무 긴 닉네임'
    ,duplicatedNickname: '🚫 중복 닉네임'
    ,bannedNickname: '🚫 금지된 닉네임'
    ,includeSeperator: '🚫 금지된 닉네임 (|,|)'
    ,banList: {
        permanentBan: '{banListReason}'
        ,fixedTermBan: '{banListReason}'
    }
}

export const onLeft = {
    startRecord: '📊 충분한 인원이 모였습니다. 지금부터 스탯 기록이 될 것입니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 현재 상태에선 스탯 기록이 되지 않습니다.'
}

export const onChat = {
    mutedChat: '🔇 음소거되어 채팅을 할 수 없습니다. 명령어는 사용할 수 있습니다.'
    ,tooLongChat: '🔇 채팅 메시지가 너무 깁니다.'
    ,bannedWords: '🚫 채팅에 금칙어가 포함되어 있습니다.'
    ,includeSeperator: '🚫 채팅에 금칙어(|,|)가 포함되어 있습니다.'
}

export const onTeamChange = {
    afkPlayer: '🚫 {targetPlayerName}#{targetPlayerID}님은 잠수중이라 팀을 옮길 수 없습니다. ({targetAfkReason})'
}

export const onStart = {
    startRecord: '📊 충분한 인원이 모였습니다. 지금부터 전적이 기록됩니다.'
    ,stopRecord: '📊 최소 {gameRuleNeedMin}명이 필요합니다. 지금은 전적이 기록되지 않습니다.'
    ,expectedWinRate: '📊 Red 팀의 기대승률은 {teamExpectationRed}%이고, Blue 팀의 기대승률은 {teamExpectationBlue}%입니다. (양 팀간의 비교가 아닙니다)'
}

export const onStop = {
    feedSocialDiscordWebhook: {
        replayMessage: '💽 {roomName}의 리플레이 파일 ({replayDate})'
    }
}

export const onVictory = {
    victory: '🎉 경기 종료! 스코어 {redScore}:{blueScore} !! ⚽️'
    ,burning: '🔥 {streakTeamName} 팀이 {streakTeamCount}연승중입니다 !!'
    ,reroll: '📢 {streakTeamCount}연승을 축하합니다. 팀을 자동으로 섞습니다.'
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
    afknoadmin: '🚫 잠수 중인 플레이어는 관리자가 될 수 없습니다.'
}

export const onGamePause = {
    readyForStart: '📢 곧 경기가 시작됩니다!'
}
