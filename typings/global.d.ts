import { RoomConfig } from '../controller/RoomConfig';
declare global {
    interface Window {
        roomURIlink: string
        HBInit(config: RoomConfig): any
        onHBLoaded(): void
    }
}