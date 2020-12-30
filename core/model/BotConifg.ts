import { GameRule } from "./GameRules/GameRule";
import { RoomConfig } from "./RoomObject/RoomConfig";

export interface BotConfig {
    room: {
        config: RoomConfig;
    }
    game: {
        rule: GameRule;
    }
}