import { PlayerObject } from "../../model/PlayerObject";
import { gameRule } from "../../model/rules/rule";
import { setDefaultRoomLimitation, setDefaultStadiums } from "../RoomTools";


export function onGameStopListener(byPlayer: PlayerObject): void {
    /* Event called when a game stops.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    var placeholderStop = {
        playerID: 0,
        playerName: '',
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(1),
        possTeamBlue: window.ballStack.possCalculate(2),
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()
    };
    if(byPlayer !== null) {
        placeholderStop.playerID = byPlayer.id;
        placeholderStop.playerName = byPlayer.name;
    }

    window.isGamingNow = false; // turn off

    let msg = "The game has been stopped.";
    if (byPlayer !== null && byPlayer.id != 0) {
        msg += `(by ${byPlayer.name}#${byPlayer.id})`;
    }
    window.logger.i(msg);
    
    setDefaultStadiums(); // check number of players and auto-set stadium
    setDefaultRoomLimitation(); // score, time, teamlock set

    window.ballStack.initTouchInfo(); // clear touch info
    window.ballStack.clear(); // clear the stack.
    window.ballStack.possClear(); // clear possession count
}