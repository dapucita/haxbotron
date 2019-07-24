import { RoomConfig } from '../model/RoomConfig';
declare global {
    interface Window {
        // bot
        roomURIlink: string // for sharing URI link of the room
        logQueue: string[] // for sharing log message
        sendRoomChat(msg: string, playerID?: number): void // for send chat message to the game

        // on dev-console tools for emergency
        onEmergency: {
            list(): void
            chat(msg: string, playerID?: number): void
            kick(playerID: number,  msg?: string): void
            banclear(): void
        }

        // haxball
        HBInit(config: RoomConfig): any
        onHBLoaded(): void
    }
}