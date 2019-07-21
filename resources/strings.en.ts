// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const scheduler = {
    advertise: '📢 Haxbotron is in development. Open source and free to use!'
    ,shutdown: '📢 This room will be shutdown soon. Thanks for joinning our game!'
    ,afkKick: '📢 kick: AFK'
    ,afkDetect: '📢 {targetName}#{targetID} has been away from keyboard. Press any key, or would be kicked.'
}

export const command = {
    _ErrorWrongCommand : '❌ You did wrong command. 📑 !help or !help COMMAND for detail.'
    ,help: '📄 !about,stats,afk,poss,streak 📑 !help COMMAND for detail. '
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ Failed to read manual about that command.'
        ,help: '📑 !help COMMAND shows you how to use COMMAND command.'
        ,about: '📑 !about shows you simple inforamtion of the bot running now.'
        ,stats: '📑 !stats shows all players your statistical information. 📑 If you want to reset, do !statsreset'
        ,statsreset: '📑 !statsreset resets your statistical information. It cannot be recovered.'
        ,poss: '📑 !poss shows you possessions rate of both Read and Blue team.'
        ,streak: '📑 !streak shows you which team is being on a winning streak.'
        ,afk: '📑 !afk MSG switches to idle status. MSG is the reason, and it can be skipped.'

    } 
    ,about: '📄 This room is powered by Haxbotron bot. The host started on {_LaunchTime}.'
    ,stats: '📊 {targetName}#{ticketTarget} Win {targetStatsWins}/{targetStatsTotal}({targetStatsWinRate}%), Goal {targetStatsGoals}, Assist {targetStatsAssists}, OG {targetStatsOgs}, Lose goal {targetStatsLosepoints}.'
    ,statsreset: '📊 Reset for statistical information completed. You can\'t cancel it.'
    ,poss: '📊 Ball possession : Red {possTeamRed}%, Blue {possTeamBlue}%.'
    ,streak: '📊 {streakTeamName} is now hitting a winning streak of {streakTeamCount} games!'
    ,afk: {
        setAfk: '💤 {targetName}#{ticketTarget} is now away from keyboard. ({targetAfkReason})'
        ,unAfk: '📢 {targetName}#{ticketTarget} has came back from afk mode!'
    }
    ,super: {
        _ErrorWrongCommand : '❌ You did wrong command for super admin system.'
        ,_ErrorNoPermission : '❌ You are not super admin. You can\'t do this command.'
        ,_ErrorLoginAlready : '❌ You are already super admin. 📑 You can logout by command !super logout.'
        ,defaultMessage: '📄 Super admin system for control Haxbotron bot in the game.'
        ,loginSuccess: '🔑 Succeeded to login. You are super admin from now.'
        ,logoutSuccess: '🔑 Succeeded to logout. You are not super admin from now.'
        ,loginFail: '❌ Failed to login.'
        ,loginFailNoKey: '❌ Failed to login. You should submit authentication key for login.'
        ,thor: {
            noAdmins: '❌ There are no admin players to disqualify.'
            ,complete: '🔑 Succeeded to disqualify other admin players and make you admin.'
        }
    }
}

export const funcUpdateAdmins = {
    newAdmin: '📢 {playerName}#{playerID} has been new admin.'
}

export const onJoin = {
    welcome: '📢 Welcome, {playerName}#{playerID}! 📄 You can get informations by command !help'
    ,changename: '📢 {playerName}#{playerID} has changed name from {playerNameOld}'
    ,startRecord: '📊 Enough players has joined, so the game\'s result will be recorded from now.'
    ,stopRecord: '📊 Need more players. The game\'s result will not be recorded from now. (needs {gameRuleNeedMin} players at least)'
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
}

export const onStop = {

}

export const onVictory = {
    victory: '🎉 The game has ended. Scores {redScore}:{blueScore}!'
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