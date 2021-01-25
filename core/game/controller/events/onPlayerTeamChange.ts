import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { MatchKFactor } from "../../model/Statistics/HElo";

export function onPlayerTeamChangeListener(changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
    // Event called when a player team is changed.
    // byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    let placeholderTeamChange = {
        targetPlayerID: changedPlayer.id,
        targetPlayerName: changedPlayer.name,
        targetAfkReason: ''
    }

    if(window.settings.game.rule.autoOperating === true && window.playerList.has(changedPlayer.id) === true) {
        let matchEntryTime: number = window.room.getScores()?.time ?? 0; // get match time (it will be null if the game isn't in progress)
        window.playerList.get(changedPlayer.id)!.entrytime.matchEntryTime = matchEntryTime;
    }

    if (changedPlayer.id === 0) { // if the player changed into other team is host player(always id 0),
        window.room.setPlayerTeam(0, TeamID.Spec); // stay host player in Spectators team.
        window.logger.i(`Bot host is moved team but it is rejected.`);
    } else {
        if (byPlayer !== null && byPlayer.id !== 0) { // if changed by admin player
            if (window.playerList.get(changedPlayer.id)!.permissions.afkmode == true) { // if changed player is afk status
                placeholderTeamChange.targetAfkReason = window.playerList.get(changedPlayer.id)!.permissions.afkreason;
                window.room.setPlayerTeam(changedPlayer.id, TeamID.Spec); // stay the player in Spectators team.
                window.room.sendAnnouncement(Tst.maketext(LangRes.onTeamChange.afkPlayer, placeholderTeamChange), null, 0xFF0000, "normal", 0);
                window.logger.i(`${changedPlayer.name}#${changedPlayer.id} is moved team but it is rejected as afk mode.`);
                return; // exit this event
            }
        }
        if (window.settings.game.rule.statsRecord == true && window.isStatRecord == true) {
            if(window.isGamingNow === true && changedPlayer.team !== TeamID.Spec) { // In the case of a substitute for previous player who abscond
                window.playerList.get(changedPlayer.id)!.matchRecord.factorK = MatchKFactor.Replace; // set K Factor as a Replacement match
            }
        }

        window.playerList.get(changedPlayer.id)!.team = changedPlayer.team;
        window.logger.i(`${changedPlayer.name}#${changedPlayer.id} is moved team to ${convertTeamID2Name(changedPlayer.team)}.`);
    }
}
