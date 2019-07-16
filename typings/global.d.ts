import { RoomConfig } from '../controller/RoomConfig';
declare global {
    interface Window {
        roomURIlink: string // bot

        logQueue: string[] // bot

        HBInit(config: RoomConfig): any // haxball
        onHBLoaded(): void // haxball
    }
}