import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { TeamID } from "../../model/GameObject/TeamID";

export function onGameUnpauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = true; // turn on

    // if auto emcee mode is enabled
    if(window.settings.game.rule.autoOperating === true) {
        if(window.isGamingNow === true) { // when game is in match
            let teamPlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.team !== TeamID.Spec);
            let redPlayers: PlayerObject[] = teamPlayers.filter((player: PlayerObject) => player.team === TeamID.Red);
            let bluePlayers: PlayerObject[] = teamPlayers.filter((player: PlayerObject) => player.team === TeamID.Blue);
            if(redPlayers.length < window.settings.game.rule.requisite.eachTeamPlayers) {
                // if lack of players in team
                let activeSpecPlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
                if(activeSpecPlayers.length >= 1) window.room.setPlayerTeam(activeSpecPlayers[0].id, TeamID.Red); // move to red
            }
            if(bluePlayers.length < window.settings.game.rule.requisite.eachTeamPlayers) {
                // if lack of players in team
                let activeSpecPlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);
                if(activeSpecPlayers.length >= 1) window.room.setPlayerTeam(activeSpecPlayers[0].id, TeamID.Blue); // move to red
            }
        }
    }
}
