import { PlayerObject } from "../GameObject/PlayerObject";
import { TeamID } from "../GameObject/TeamID";

export function roomPlayersNumberCheck(): number {
    // return number of all players of this room (except bot host)
    return window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0).length;
}

export function roomActivePlayersNumberCheck(): number {
    // return number of players actually atcivated(not afk)
    return window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.permissions.afkmode !== true).length;
}

export function roomTeamPlayersNumberCheck(team: TeamID): number {
    // return number of players in each team
    return window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === team).length;
}

export function putTeamNewPlayerConditional(playerID: number, redPlayers?: number, bluePlayers?: number): TeamID {
    // check quorum of each team, and if there are any lacks then supplement automatically just one time
    let newTeamID: TeamID = 0;
    let teamPlayersNumber = {
        red: redPlayers || roomTeamPlayersNumberCheck(TeamID.Red),
        blue: bluePlayers || roomTeamPlayersNumberCheck(TeamID.Blue)
    }
    if(teamPlayersNumber.red <= teamPlayersNumber.blue) {
        // if red team members are equal or less than blues, move this player to red team.
        if(teamPlayersNumber.red < window.settings.game.rule.requisite.eachTeamPlayers) {
            // move only when team limitation is not reached.
            newTeamID = TeamID.Red;
            window.room.setPlayerTeam(playerID, TeamID.Red);
            window.logger.i(`The player #${playerID} is moved to Red Team by system.`);
        }
    } else {
        // or move to blue team.
        if(teamPlayersNumber.blue < window.settings.game.rule.requisite.eachTeamPlayers) {
            // move only when team limitation is not reached.
            newTeamID = TeamID.Blue;
            window.room.setPlayerTeam(playerID, TeamID.Blue);
            window.logger.i(`The player #${playerID} is moved to Blue Team by system.`);
        }
    }
    return newTeamID;
}

export function putTeamNewPlayerFullify(): void {
    // check quorum of each team, and if there are any lacks then supplement automatically
    let allActivePlayers: PlayerObject[] =  window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.permissions.afkmode === false);
    let specActivePlayers: PlayerObject[] = allActivePlayers.filter((player: PlayerObject) => player.team === TeamID.Spec);

    let redPlayersLack: number = window.settings.game.rule.requisite.eachTeamPlayers - allActivePlayers.filter((player: PlayerObject) => player.team === TeamID.Red).length;
    let bluePlayersLack: number = window.settings.game.rule.requisite.eachTeamPlayers - allActivePlayers.filter((player: PlayerObject) => player.team === TeamID.Blue).length;

    for(let i: number = 0; i < specActivePlayers.length; i++) {
        if(i < redPlayersLack) window.room.setPlayerTeam(specActivePlayers[i].id, TeamID.Red);
        if(i >= redPlayersLack && i < redPlayersLack + bluePlayersLack) window.room.setPlayerTeam(specActivePlayers[i].id, TeamID.Blue);
    }
}