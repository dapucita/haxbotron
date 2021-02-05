import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";

export function onPlayerTeamChangeListener(changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
    // Event called when a player team is changed.
    // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    let placeholderTeamChange = {
        targetPlayerID: changedPlayer.id,
        targetPlayerName: changedPlayer.name,
        targetAfkReason: ''
    }

    if(window.gameRoom.config.rules.autoOperating === true && window.gameRoom.playerList.has(changedPlayer.id) === true) {
        let matchEntryTime: number = window.gameRoom._room.getScores()?.time ?? 0; // get match time (it will be null if the game isn't in progress)
        window.gameRoom.playerList.get(changedPlayer.id)!.entrytime.matchEntryTime = matchEntryTime;
    }

    if (changedPlayer.id === 0) { // if the player changed into other team is host player(always id 0),
        window.gameRoom._room.setPlayerTeam(0, TeamID.Spec); // stay host player in Spectators team.
        window.gameRoom.logger.i('onPlayerTeamChange', `Bot host is moved team but it is rejected.`);
    } else {
        if (byPlayer !== null && byPlayer.id !== 0) { // if changed by admin player
            if (window.gameRoom.playerList.get(changedPlayer.id)!.permissions.afkmode == true) { // if changed player is afk status
                placeholderTeamChange.targetAfkReason = window.gameRoom.playerList.get(changedPlayer.id)!.permissions.afkreason;
                window.gameRoom._room.setPlayerTeam(changedPlayer.id, TeamID.Spec); // stay the player in Spectators team.
                window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onTeamChange.afkPlayer, placeholderTeamChange), null, 0xFF0000, "normal", 0);
                window.gameRoom.logger.i('onPlayerTeamChange', `${changedPlayer.name}#${changedPlayer.id} is moved team but it is rejected as afk mode.`);
                return; // exit this event
            }
        }
        if (window.gameRoom.config.rules.statsRecord == true && window.gameRoom.isStatRecord == true) {
            if(window.gameRoom.isGamingNow === true && changedPlayer.team !== TeamID.Spec) { // In the case of a substitute for previous player who abscond
                window.gameRoom.playerList.get(changedPlayer.id)!.matchRecord.factorK = window.gameRoom.config.HElo.factor.factor_k_replace; // set K Factor as a Replacement match
            }
        }

        window.gameRoom.playerList.get(changedPlayer.id)!.team = changedPlayer.team;
        window.gameRoom.logger.i('onPlayerTeamChange', `${changedPlayer.name}#${changedPlayer.id} is moved team to ${convertTeamID2Name(changedPlayer.team)}.`);
    }
}
