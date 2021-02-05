import { TeamID } from "./TeamID";

export interface PlayerObject {
    // PlayerObject holds information about a player

    // The id of the player, each player that joins the room gets a unique id that will never change.
    id: number;
    // The name of the player.
    name: string;
    /*
    The player's public ID. Players can view their own ID's here: https://www.haxball.com/playerauth
    The public ID is useful to validate that a player is who he claims to be, but can't be used to verify that a player isn't someone else. Which means it's useful for implementing user accounts, but not useful for implementing a banning system.
    Can be null if the ID validation fails.
    This property is only set in the RoomObject.onPlayerJoin event.
    */
    auth: string;
    /*
    A string that uniquely identifies the player's connection, if two players join using the same network this string will be equal.
    This property is only set in the RoomObject.onPlayerJoin event.
    */
    conn: string; 
    // Whether the player has admin rights.
    admin: boolean;
    // The team of the player.
    /* Spectators: 0
    Red Team: 1
    Blue Team: 2 */
    team: TeamID;
    // The player's position in the field, if the player is not in the field the value will be null.
    position: PlayerPosition;
}

export interface PlayerMatchRecord { // Temporary stat record for current match
    goals: number; // not contains OGs.
    assists: number; // count for assist goal
    ogs: number; // it means 'own goal' (in Korean, '자책골')
    losePoints: number; // it means the points this player lost (in Korean, '실점')
    balltouch: number; // total count of touch(kick) ball
    passed: number; // total count of pass success
    factorK: number; // K Factor for HElo rating
}

export interface PlayerStats {
    rating: number; // HElo Rating points
    totals: number; // total games include wins and disconns
    disconns: number; // disconnected games
    wins: number; // the game wins
    goals: number; // not contains OGs.
    assists: number; // count for assist goal
    ogs: number; // it means 'own goal' (in Korean, '자책골')
    losePoints: number; // it means the points this player lost (in Korean, '실점')
    balltouch: number; // total count of touch(kick) ball
    passed: number; // total count of pass success
}

export interface PlayerPosition {
    x: number | null;
    y: number | null;
}

export interface PlayerPermissions {
    mute: boolean; // Is this player muted? If true, his/her messages will ignored.
    muteExpire: number; // expiration date of mute. -1 means Permanent mute.. (unix timestamp)
    afkmode: boolean; // Is this player away from keyboards? If the player sets afk mode, the value is true. It is not a mean for auto dectecting and kicking afk players.
    afkreason: string; // the reason why this player is idle(afk) status.
    afkdate: number; // afk begin time stamp. 0 means no data.
    malActCount: number; // count for malicious behaviour like Brute force attack
    superadmin: boolean; // Is this player super admin? It doesn't matter whether he/she is an admin.
    // admin permission is already decleared by admin: boolean.
}

export interface PlayerAfkTrace {
    exemption: boolean; // deprecated // is this player exempted from detecting and tracing afk players?
    count: number; // afk detection count
}

export interface PlayerEntryTime {
    rejoinCount: number, // How many rejoins this player has made.
    joinDate: number, // player join time stamp. 0 means no data.
    leftDate: number, // player left time stamp. 0 means no data.
    matchEntryTime: number // the entry time by seconds of the recent game match (0 means entry as starting member or just no match)
}

export interface PlayerStorage {
    auth: string; // same meaning as in PlayerObject. It can used for identify each of players.
    conn: string; // same meaning as in PlayerObject.
    name: string; // player's name used in previous game.
    rating: number; // HElo Rating points
    totals: number; // total games include wins and disconns
    disconns: number; // disconnected games
    wins: number; // the game wins
    goals: number; // not contains OGs.
    assists: number; // count for assist goal
    ogs: number; // it means 'own goal' (in Korean, '자책골')
    losePoints: number; // it means the points this player lost (in Korean, '실점')
    balltouch: number; // total count of touch(kick) ball
    passed: number; // total count of pass success
    mute: boolean; // is this player muted?
    muteExpire: number; // expiration date of mute. -1 means Permanent mute.. (unix timestamp)
    //superadmin: boolean; // is this player super admin? // not save
    rejoinCount: number; // How many rejoins this player has made.
    joinDate: number; // player join time
    leftDate: number; // player left time
    malActCount: number; // count for malicious behaviour like Brute force attack
}