// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const announcement = {
    advertise: '📢 Haxbotron is open source and free to use! - https://dapucita.github.io/haxbotron/'
    ,shutdown: '📢 This room will be shutdown soon. Thanks for joinning our game!'
}

export const command = {
    _ErrorWrongCommand : '❌ You did wrong command. 📑 !help or !help COMMAND for detail.'
    ,help: '📄 !about !stats !poss !streak 📑 !help COMMAND for detail. '
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ Failed to read manual about that command.'
        ,help: '📑 !help COMMAND shows you how to use COMMAND command.'
        ,about: '📑 !about shows you simple inforamtion of the bot running now.'
        ,stats: '📑 !stats shows all players your statistical information. 📑 If you want to reset, do !statsreset'
        ,statsreset: '📑 !statsreset resets your statistical information. It cannot be recovered.'
        ,poss: '📑 !poss shows you possessions rate of both Read and Blue team.'
        ,streak: '📊 !streak shows you which team is being on a winning streak.'
    } 
    ,about: '📄 This room is powered by Haxbotron bot. The host started on {_LaunchTime}.'
    ,super: '👑 You are super admin now.'
    ,debug: '👑 Debug information has printed in console.'
    ,stats: '📊 {targetName}#{ticketTarget} Win {targetStatsWins}/{targetStatsTotal}({targetStatsWinRate}%), Goal {targetStatsGoals}, Assist {targetStatsAssists}, OG {targetStatsOgs}, Lose goal {targetStatsLosepoints}.'
    ,statsreset: '📊 Reset for statistical information completed. You can\'t cancel it.'
    ,poss: '📊 Ball possession : Red {possTeamRed}%, Blue {possTeamBlue}%.'
    ,streak: '📊 {streakTeamName} is now hitting a winning streak of {streakTeamCount} games!'
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
    mutedChat: '🔇 You are muted. You can\'t send message to others.'
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
    goal: '⚽️ {scorerName}#{scorerID} made a goal!'
    ,goalWithAssist: '⚽️ {scorerName}#{scorerID} made a goal! Assist by {assistName}#{assistID}'
    ,og: '⚽️ {ogName}#{ogID} made an OG.'

}