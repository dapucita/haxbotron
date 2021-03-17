import { PlayerObject } from "../GameObject/PlayerObject";
import { TeamID } from "../GameObject/TeamID";

export function roomPlayersNumberCheck(): number {
    // return number of all players of this room (except bot host)
    return window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0).length;
}

export function roomActivePlayersNumberCheck(): number {
    // return number of players actually atcivated(not afk)
    return window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode === false).length;
}

export function roomTeamPlayersNumberCheck(team: TeamID): number {
    // return number of players in each team
    return window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === team).length;
}

export function fetchActiveSpecPlayers(): PlayerObject[] {
    return window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode === false && player.team === TeamID.Spec);
}

export function recuritByOne() {
    const activePlayersList: PlayerObject[] = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode === false);
    const activeSpecPlayersList: PlayerObject[] = activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Spec);

    const redInsufficiency: number = window.gameRoom.config.rules.requisite.eachTeamPlayers - activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Red).length;
    const blueInsufficiency: number = window.gameRoom.config.rules.requisite.eachTeamPlayers - activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Blue).length;

    if(redInsufficiency >= blueInsufficiency && redInsufficiency > 0) {
        window.gameRoom._room.setPlayerTeam(activeSpecPlayersList[0].id, TeamID.Red);
    }
    if(redInsufficiency < blueInsufficiency && blueInsufficiency > 0) {
        window.gameRoom._room.setPlayerTeam(activeSpecPlayersList[0].id, TeamID.Blue);
    }
}

export function recuritBothTeamFully() {
    const activePlayersList: PlayerObject[] = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode === false);
    let activeSpecPlayersList: PlayerObject[] = activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Spec);

    const redInsufficiency: number = window.gameRoom.config.rules.requisite.eachTeamPlayers - activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Red).length;
    const blueInsufficiency: number = window.gameRoom.config.rules.requisite.eachTeamPlayers - activePlayersList.filter((player: PlayerObject) => player.team === TeamID.Blue).length;

    for(let i=0; i < redInsufficiency && i < activeSpecPlayersList.length; i++) {
        window.gameRoom._room.setPlayerTeam(activeSpecPlayersList[i].id, TeamID.Red);
    }

    activeSpecPlayersList = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode === false && player.team === TeamID.Spec);

    for(let i=0; i < blueInsufficiency && i < activeSpecPlayersList.length; i++) {
        window.gameRoom._room.setPlayerTeam(activeSpecPlayersList[i].id, TeamID.Blue);
    }
}
