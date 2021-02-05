import { GameRoomSettings } from "./GameRoomSettings";
import { RoomConfig } from "../RoomObject/RoomConfig";
import { GameRoomRule } from "./GameRoomRules";
import { HEloConfig } from "./HEloConfig";
import { GameCommands } from "./GameCommands";

export interface GameRoomConfig {
    _LaunchDate: Date; // date of this room created
    _RUID: string; // room unique identifier for this room
    _config: RoomConfig; // room configuration data for set this new room
    settings: GameRoomSettings; // room settings data for set bot options
    rules: GameRoomRule; // game playing rule
    HElo: HEloConfig; // configuration for HElo rating and tier system
    commands: GameCommands;
}
