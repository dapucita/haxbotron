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
    team: number;
    // The player's position in the field, if the player is not in the field the value will be null.
    position: PlayerPosition;
}

export interface PlayerStats {
    totals: number; // total games include wins
    wins: number; // the game wins
    goals: number; // not contains OGs.
    ogs: number; // it means 'own goal'
}

export interface PlayerPosition {
    x: number;
    y: number;
}

export interface PlayerPermissions {
    mute: boolean; // Is this player muted? If true, his/her messages will ignored.
    afkmode: boolean; // Is this player away from keyboards? If the player sets afk mode, the value is true. It is not a mean for auto dectecting and kicking afk players.
    captain: boolean; //Is this player the captain of his/her team?
    superadmin: boolean; // Is this player super admin? It doesn't matter whether he/she is an admin.
    // admin permission is already decleared by admin: boolean.
}

export interface PlayerStorage {
    // object literal that will be stored in LocalStorage as JSON.
    // however, JSON stringify should be done in LocalStorage not Node.js Map() object.
    auth: string; // same meaning as in PlayerObject
    conn: string; // same meaning as in PlayerObject.
    name: string; // player's name used in previous game.
    totals: number; // total games include wins
    wins: number; // the game wins
    goals: number; // not contains OGs.
    ogs: number; // it means 'own goal'
    mute: boolean; // is this player muted?
    superadmin: boolean; // is this player super admin?
}