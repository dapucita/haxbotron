import { GameRule } from "./GameRules/GameRule";
import { RoomConfig } from "./RoomObject/RoomConfig";

export interface BotConfig {
    room: {
        _LaunchDate: Date;
        config: RoomConfig;
    }
    game: {
        rule: GameRule;
    }
}