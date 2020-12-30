import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";

export function onPlayerBallKickListener(player: PlayerObject): void {
    // Event called when a player kicks the ball.
    // records player's id, team when the ball was kicked
    var placeholderBall = {
        playerID: player.id,
        playerName: player.name,
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count
    };

    if (window.settings.game.rule.statsRecord === true && window.isStatRecord === true) { // record only when stat record mode

        window.playerList.get(player.id)!.stats.balltouch++; // add count of ball touch

        if (window.ballStack.passJudgment(player.team) === true && window.playerList.has(window.ballStack.getLastTouchPlayerID()) === true) {
            window.playerList.get(window.ballStack.getLastTouchPlayerID())!.stats.passed++;
        }

        window.ballStack.touchTeamSubmit(player.team);
        window.ballStack.touchPlayerSubmit(player.id); // refresh who touched the ball in last

        window.ballStack.push(player.id);
        window.ballStack.possCount(player.team); // 1: red team, 2: blue team

    }
}
