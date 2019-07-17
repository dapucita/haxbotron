import { Player } from "./Player";
import { PlayerStorage } from "./PlayerObject";

export function getPlayerData(playerAuth: string): PlayerStorage | null {
    // load player's data from localStorage
    var jsonData: string | null = localStorage.getItem(playerAuth);
    if (jsonData !== null) {
        var convertedData: PlayerStorage = JSON.parse(jsonData);
        return convertedData;
    } else {
        return null;
    }
}

export function setPlayerData(player: Player): void {
    // store player's data in localStorage
    var playerData: PlayerStorage = {
        auth: player.auth, // same meaning as in PlayerObject. It can used for identify each of players.
        conn: player.conn, // same meaning as in PlayerObject.
        name: player.name, // save for compare player's current name and previous name.
        totals: player.stats.totals, // total games include wins
        wins: player.stats.wins, // the game wins
        goals: player.stats.goals, // not contains OGs.
        assists: player.stats.assists, // count for assist goal
        ogs: player.stats.ogs, // it means 'own goal' (in Korean, '자책골')
        losePoints: player.stats.losePoints, // it means the points this player lost (in Korean, '실점')
        mute: player.permissions.mute, // is this player muted?
        superadmin: player.permissions.superadmin // is this player super admin?
    }
    localStorage.setItem(player.auth, JSON.stringify(playerData)); // convert object to json for store in localStorage // for decode: JSON.parse
}