export interface RoomConfig {
    // The name for the room.
    roomName?: string;
    // The name for the host player.
    playerName?: string;
    // The password for the room (no password if ommited).
    password?: string;
    // Max number of players the room accepts.
    maxPlayers?: number;
    // If true the room will appear in the room list.
    public?: boolean;
    // GeoLocation override for the room.
    geo?: {
        "code": string,
        "lat": number, // flat
        "lon": number // flat
    };
    // token doesn't need if the bot is started from Headless page, not standalone.
    token?: string;
    // If set to true the room player list will be empty, the playerName setting will be ignored.
    // Default value is false for backwards compatibility reasons but it's recommended to set this to true.
    noPlayer?: boolean;
}
/* 
Warning! events will have null as the byPlayer argument when the event is caused by the host, so make sure to check for null values!
*/