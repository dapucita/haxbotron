import { GameRule } from "./GameRules/GameRule";
import { RoomConfig } from "./RoomObject/RoomConfig";

export interface BotConfig {
    room: {
        _LaunchDate: Date; // date of this room created
        _RUID: string; // room unique identifier for this game room
        config: RoomConfig; // room config data for set this new room
    }
    game: {
        rule: GameRule; // game rule for this game room
    }
}