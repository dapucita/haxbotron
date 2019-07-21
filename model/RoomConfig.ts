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
        "lat": number,
        "lon": number
    };
    // token doesn't need if the bot is started from Headless page, not standalone.
    token?: string;
}