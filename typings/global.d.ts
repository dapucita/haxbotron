import { RoomConfig } from '../controller/RoomConfig';
declare global {
    interface Window {
        roomURIlink: string // bot // for sharing URI link of the room
        logQueue: string[] // bot // for sharing log message
        sendRoomChat(msg: string, playerID?: number): void // bot // for send chat message to the game

        HBInit(config: RoomConfig): any // haxball
        onHBLoaded(): void // haxball
    }
}