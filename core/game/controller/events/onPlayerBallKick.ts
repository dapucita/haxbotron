import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";

export function onPlayerBallKickListener(player: PlayerObject): void {
    // Event called when a player kicks the ball.
    // records player's id, team when the ball was kicked
    var placeholderBall = {
        playerID: player.id,
        playerName: player.name,
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    if (window.gameRoom.config.rules.statsRecord === true && window.gameRoom.isStatRecord === true) { // record only when stat record mode

        window.gameRoom.playerList.get(player.id)!.matchRecord.balltouch++; // add count of ball touch in match record

        if (window.gameRoom.ballStack.passJudgment(player.team) === true && window.gameRoom.playerList.has(window.gameRoom.ballStack.getLastTouchPlayerID()) === true) {
            window.gameRoom.playerList.get(window.gameRoom.ballStack.getLastTouchPlayerID())!.matchRecord.passed++; // add count of pass success in match record
        }

        window.gameRoom.ballStack.touchTeamSubmit(player.team);
        window.gameRoom.ballStack.touchPlayerSubmit(player.id); // refresh who touched the ball in last

        window.gameRoom.ballStack.push(player.id);
        window.gameRoom.ballStack.possCount(player.team); // 1: red team, 2: blue team

    }
}
