// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const scheduler = {
    advertise: '📢 Haxbotron🤖 is in development. Open source and free to use!\n💬 Discord https://discord.gg/qfg45B2 Donate https://www.patreon.com/dapucita'
    ,shutdown: '📢 This room will be shutdown soon. Thanks for joinning our game!'
    ,afkKick: '📢 kicked: AFK'
    ,afkDetect: '📢 @{targetName}#{targetID} has been away from keyboard. Press any key, or would be kicked.'
}

export const command = {
    _ErrorWrongCommand : '❌ You did wrong command. 📑 !help or !help COMMAND for detail.'
    ,_ErrorNoPermission: '❌ You are not admin. You can\'t do this command.'
    ,help: '📄 !about, stats, statsreset, afk, poss, streak, list, scout\n📑 !help COMMAND for detail. (eg. !help stats)\n📑 !help admin shows you commands list for administrator.'
    ,helpadmin: '📄 !freeze, mute\n📑 !help COMMAND for detail.'
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ Failed to read manual about that command.'
        ,help: '📑 !help COMMAND shows you how to use COMMAND command.'
        ,about: '📑 !about shows you simple inforamtion of the bot running now.'
        ,stats: '📑 !stats shows you your statistical information. 📑 If you want to reset, do !statsreset\n📑 !stats #ID : shows you statistical inforamtion of the player who has ID.\n📑 You can check IDs by command !list red,blue,spec'
        ,statsreset: '📑 !statsreset resets your statistical information. It cannot be recovered.'
        ,poss: '📑 !poss shows you possessions rate of both Read and Blue team.'
        ,streak: '📑 !streak shows you which team is being on a winning streak.'
        ,afk: '📑 !afk MSG switches to idle status. MSG is the reason, and it can be skipped.'
        ,list: '📑 !list TEAM(red/blue/spec) shows you all players list of the team.'
        ,freeze: '📑 !freeze mutes or unmutes all players.'
        ,mute: '📑 !mute #ID : prohibits the player whose id is ID to chat. Or unmute if the player is already muted. (eg: !mute #12)\n📑 You can check IDs by command !list red,blue,spec'
        ,scout: '📑 !scout shows you expectation of each teams by customed Pythagorean Expectation.'
    } 
    ,about: '📄 This room is powered by Haxbotron🤖 bot. The host started on {_LaunchTime}.\n💬 Discord https://discord.gg/qfg45B2 Donate https://www.patreon.com/dapucita'
    ,stats: {
        _ErrorNoPlayer: '❌ Wrong player ID. You can only target numeric ID.(eg: !stats #12)\n📑 You can check IDs by command !list red,blue,spec'
        ,statsMsg: '📊 {targetName}#{ticketTarget} Total {targetStatsTotal}games(winrate {targetStatsWinRate}%), Goal {targetStatsGoals}, Assist {targetStatsAssists}, OG {targetStatsOgs}, Lose goal {targetStatsLosepoints}, Pass Success Rate {targetStatsPassSuccess}%.\n📊 and Per Game : {targetStatsGoalsPerGame}goals, {targetStatsAssistsPerGame}assists, {targetStatsOgsPerGame}ogs, {targetStatsLostGoalsPerGame}lose goals.'
    }
    ,statsreset: '📊 Reset for statistical information completed. You can\'t cancel it.'
    ,poss: '📊 Ball possession : Red {possTeamRed}%, Blue {possTeamBlue}%.'
    ,streak: '📊 {streakTeamName} is now hitting a winning streak of {streakTeamCount} games!'
    ,afk: {
        setAfk: '💤 {targetName}#{ticketTarget} is now away from keyboard. ({targetAfkReason})'
        ,unAfk: '📢 {targetName}#{ticketTarget} has came back from afk mode!'
    }
    ,mute: {
        _ErrorNoPermission: '❌ You are not admin. You can\'t do this command.'
        ,_ErrorNoPlayer: '❌ Wrong player ID. You can only target numeric ID.(eg: !mute #12)\n📑 You can check IDs by command !list red,blue,spec'
        ,successMute: '🔇 {targetName}#{ticketTarget} player is muted.'
        ,successUnmute: '🔊 {targetName}#{ticketTarget} player is unmuted.'
    }
    ,super: {
        _ErrorWrongCommand: '❌ You did wrong command for super admin system.'
        ,_ErrorNoPermission: '❌ You are not super admin. You can\'t do this command.'
        ,_ErrorLoginAlready: '❌ You are already super admin. 📑 You can logout by command !super logout.'
        ,defaultMessage: '📄 Super admin system for control Haxbotron bot in the game.'
        ,loginSuccess: '🔑 Succeeded to login. You are super admin from now.'
        ,logoutSuccess: '🔑 Succeeded to logout. You are not super admin from now.'
        ,loginFail: '❌ Failed to login.'
        ,loginFailNoKey: '❌ Failed to login. You should submit authentication key for login.'
        ,thor: {
            noAdmins: '❌ There are no admin players to disqualify.'
            ,complete: '🔑 Succeeded to get admin permission.'
            ,deprive: '🔑 Succeeded to disqualify other admin players and make you admin.'
        }
        ,kick: {
            noID: '❌ Error: Wrong Player ID. You can only target numeric ID.(eg: !super kick #12)'
            ,kickMsg: '📢 kicked from the game'
            ,kickSuccess: '📢 That player is kicked.'
        }
        ,ban: {
            noID: '❌ Error: Wrong Player ID. You can only target numeric ID.(eg: !super ban #12)'
            ,banMsg: '📢 banned from the game'
            ,banSuccess: '📢 That player is banned.'
        }
        ,banclear: {
            noTarget: '❌ Error: You can\'t this. 📑 !super banclear all'
            ,complete: '🔑 Succeeded to clear ban list.'
        }
    }
    ,list: {
        _ErrorNoTeam: '❌ You can request only about red, blue, spec team.'
        ,_ErrorNoOne: '❌ There\'s no one.'
        ,whoisList: '📜 {whoisResult}'
    }
    ,freeze: {
        _ErrorNoPermission : '❌ You are not admin. You can\'t do this command.'
        ,onFreeze: '🔇 The administrator freezed chatting on this room. Commands are available. 📄 !help'
        ,offFreeze: '🔊 The administrator unfreezed chatting.' 
    }
    ,scout: {
        _ErrorNoMode : '❌ There are not enough players for calculating winning expectation.'
        ,scouting: '📊 Pythagorean Expectation : Red {teamExpectationRed}%, Blue {teamExpectationBlue}%, Spec {teamExpectationSpec}%.'
    }
}

export const funcUpdateAdmins = {
    newAdmin: '📢 {playerName}#{playerID} has been new admin.\n📑 Changing stadium and banning other players are prohibited.\n📑 !help admin shows commands list for administrator.'
}

export const onJoin = {
    welcome: '📢 Welcome, {playerName}#{playerID}! 📄 You can get informations by command !help'
    ,changename: '📢 {playerName}#{playerID} has changed name from {playerNameOld}'
    ,startRecord: '📊 Enough players has joined, so the game\'s result will be recorded from now.'
    ,stopRecord: '📊 Need more players. The game\'s result will not be recorded from now. (needs {gameRuleNeedMin} players at least)'
    ,doubleJoinningMsg: '🚫 {playerName}#{playerID} has already joined.'
    ,doubleJoinningKick: '🚫 You did double joinning.'
    ,banList: '🚫 automatically banned. {banListReason}'
}

export const onLeft = {
    startRecord: '📊 Enough players has joined, so the game\'s result will be recorded from now.'
    ,stopRecord: '📊 Need more players. The game\'s result will not be recorded from now. (needs {gameRuleNeedMin} players at least)'
}

export const onChat = {
    mutedChat: '🔇 You are muted. You can\'t send message to others, and only can command by chat.'
}

export const onTeamChange = {
    afkPlayer: '🚫 Cannot to change team. {targetPlayerName}#{targetPlayerID} is away from keyboard. ({targetAfkReason})'
}

export const onStart = {
    startRecord: '📊 Enough players has joined, so the game\'s result will be recorded from now.'
    ,stopRecord: '📊 Need more players. The game\'s result will not be recorded from now. (needs {gameRuleNeedMin} players at least)'
    ,expectedWinRate: '📊 The red team \'s expectation is {teamExpectationRed}%, and the blue\'s is {teamExpectationBlue}%. (Pythagorean Expectation)'
}

export const onStop = {

}

export const onVictory = {
    victory: '🎉 The game has ended. Scores {redScore}:{blueScore}!'
    ,burning: '🔥 {streakTeamName} team is now hitting a winning streak of {streakTeamCount}games !!!'
}

export const onKick = {
    cannotBan: '🚫 You can\'t ban other players. Act kicking if you need.'
    ,notifyNotBan: '🚫 Banning {kickedName}#{kickedID} player is negated.'
}

export const onStadium = {
    loadNewStadium: '📁 {stadiumName} has been a new stadium.'
    ,cannotChange: '🚫 You can\'t change the stadium.'
}

export const onTouch = {

}

export const onGoal = {
    goal: '⚽️ {scorerName}#{scorerID} scored!!'
    ,goalWithAssist: '⚽️ {scorerName}#{scorerID} made a goal! (assisted by {assistName}#{assistID})'
    ,og: '⚽️ {ogName}#{ogID} made an OG.'
}

export const onAdminChange = {
    afknoadmin: '🚫 The player in afk mode can\'t be admin.'
}