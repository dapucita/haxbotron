import { gameRule } from "../../model/rules/rule";
import { PlayerObject } from "../../model/PlayerObject";
import { TeamID } from "../../model/TeamID";

export function onPlayerBallKickListener(player: PlayerObject): void {
    // Event called when a player kicks the ball.
    // records player's id, team when the ball was kicked
    var placeholderBall = {
        playerID: player.id,
        playerName: player.name,
        gameRuleName: gameRule.ruleName,
        gameRuleDescription: gameRule.ruleDescripttion,
        gameRuleLimitTime: gameRule.requisite.timeLimit,
        gameRuleLimitScore: gameRule.requisite.scoreLimit,
        gameRuleNeedMin: gameRule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: window.winningStreak.getName(),
        streakTeamCount: window.winningStreak.getCount()
    };

    if (gameRule.statsRecord === true && window.isStatRecord === true) { // record only when stat record mode

        window.playerList.get(player.id).stats.balltouch++; // add count of ball touch

        if (window.ballStack.passJudgment(player.team) === true && window.playerList.has(window.ballStack.getLastTouchPlayerID()) === true) {
            window.playerList.get(window.ballStack.getLastTouchPlayerID()).stats.passed++;
        }

        window.ballStack.touchTeamSubmit(player.team);
        window.ballStack.touchPlayerSubmit(player.id); // refresh who touched the ball in last

        window.ballStack.push(player.id);
        window.ballStack.possCount(player.team); // 1: red team, 2: blue team

    }
}