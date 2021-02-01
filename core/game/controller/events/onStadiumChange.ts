import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { setDefaultStadiums } from "../RoomTools";

export function onStadiumChangeListner(newStadiumName: string, byPlayer: PlayerObject): void {
    var placeholderStadium = { 
        playerID: 0,
        playerName: '',
        stadiumName: newStadiumName,
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    // Event called when the stadium is changed.
    if (byPlayer !== null && window.gameRoom.playerList.size != 0 && byPlayer.id != 0) { // if size == 0, that means there's no players. byPlayer !=0  means that the map is changed by system, not player.
        placeholderStadium.playerID = byPlayer.id;
        placeholderStadium.playerName = byPlayer.name;
        if (window.gameRoom.playerList.get(byPlayer.id)!.permissions['superadmin'] == true) {
            //There are two ways for access to map value, permissions['superadmin'] and permissions.superadmin.
            window.gameRoom.logger.i('onStadiumChange', `The map ${newStadiumName} has been loaded by ${byPlayer.name}#${byPlayer.id}.(super:${window.gameRoom.playerList.get(byPlayer.id)!.permissions['superadmin']})`);
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onStadium.loadNewStadium, placeholderStadium),null , 0x00FF00, "normal", 0);
        } else {
            // If trying for chaning stadium is rejected, reload default stadium.
            window.gameRoom.logger.i('onStadiumChange', `The map${byPlayer.name}#${byPlayer.id} tried to set a new stadium(${newStadiumName}), but it is rejected.(super:${window.gameRoom.playerList.get(byPlayer.id)!.permissions['superadmin']})`);
            // window.logger.i(`[DEBUG] ${playerList.get(byPlayer.id).name}`); for debugging
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onStadium.cannotChange, placeholderStadium), byPlayer.id, 0xFF0000, "bold", 2);
            setDefaultStadiums();
        }
    } else {
        window.gameRoom.logger.i('onStadiumChange', `The map ${newStadiumName} has been loaded as default map.`);
    }
}
