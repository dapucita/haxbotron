import { RoomConfig } from '../controller/RoomConfig';
declare global {
    interface Window {
        HBInit(config: RoomConfig): any
        onHBLoaded(): void
    }
}