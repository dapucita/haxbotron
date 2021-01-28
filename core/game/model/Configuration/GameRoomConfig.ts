import { GameRoomSettings } from "./GameRoomSettings";
import { RoomConfig } from "../RoomObject/RoomConfig";
import { GameRoomRule } from "./GameRoomRules";

export interface GameRoomConfig {
    _LaunchDate: Date; // date of this room created
    _RUID: string; // room unique identifier for this game room
    _config: RoomConfig; // room config data for set this new room
    settings: GameRoomSettings; // room settings data for set options
    rules: GameRoomRule; // game playing rule
}