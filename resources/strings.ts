// YOU CAN USE A PLACEHOLDER FOR INTERPOLATION. FOR EXAMPLE, 'Hello, My name is {name}.'
// THE TYPES OF PLACEHOLDER ARE LIMITED BY STRING SET.

export const command = {
    help: '📄 !about !stats 📑 !help COMMAND for detail'
    ,helpman: { // detailed description for a command
        _ErrorWrongMan : '❌ Failed to read about that command.'
        ,help: '📑 !help COMMAND shows you how to use COMMAND command.'
        ,about: '📑 !about shows you simple inforamtion of the bot running now.'
        ,stats: '📑 !stats shows all players your statistical information.'
    } 
    ,about: '📄 Haxbotron bot - launched on {{_LaunchTime}}'
    ,super: '👑 You are super admin now.'
    ,debug: '👑 Debug information has printed in console.'
}

export const onJoin = {
    welcome: '📢 Welcome, ${playerName}#${playerID}! 📄 You can get informations by command !help'
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

export const onGoal = {
    goal: '⚽️ '
}