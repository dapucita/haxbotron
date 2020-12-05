import { PlayerObject } from "../../model/PlayerObject";
import { setDefaultStadiums } from "../RoomTools";
import { gameRule } from "../../model/rules/rule";
import * as Tst from "../Translator";
import * as LangRes from "../../resources/strings";
import { TeamID } from "../../model/TeamID";

export function onStadiumChangeListner(newStadiumName: string, byPlayer: PlayerObject): void {
    var placeholderStadium = { 
        playerID: 0,
        playerName: '',
        stadiumName: newStadiumName,
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

    // Event called when the stadium is changed.
    if (byPlayer !== null && window.playerList.size != 0 && byPlayer.id != 0) { // if size == 0, that means there's no players. byPlayer !=0  means that the map is changed by system, not player.
        placeholderStadium.playerID = byPlayer.id;
        placeholderStadium.playerName = byPlayer.name;
        if (window.playerList.get(byPlayer.id).permissions['superadmin'] == true) {
            //There are two ways for access to map value, permissions['superadmin'] and permissions.superadmin.
            window.logger.i(`The map ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${window.playerList.get(byPlayer.id).permissions['superadmin']})`);
            window.room.sendAnnouncement(Tst.maketext(LangRes.onStadium.loadNewStadium, placeholderStadium),null , 0x00FF00, "normal", 0);
        } else {
            // If trying for chaning stadium is rejected, reload default stadium.
            window.logger.i(`The map${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.(super:${window.playerList.get(byPlayer.id).permissions['superadmin']})`);
            // window.logger.i(`[DEBUG] ${playerList.get(byPlayer.id).name}`); for debugging
            window.room.sendAnnouncement(Tst.maketext(LangRes.onStadium.cannotChange, placeholderStadium), byPlayer.id, 0xFF0000, "bold", 2);
            setDefaultStadiums();
        }
    } else {
        window.logger.i(`The map ${newStadiumName} has been loaded as default map.`);
    }
}