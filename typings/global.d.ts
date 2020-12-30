import { Logger } from "./controller/Logger";
import { RoomConfig } from '../model/RoomObject/RoomConfig';
import { KickStack } from "../model/GameObject/BallTrace";
import { Logger } from "../controller/Logger";
import { AdminKickTrace } from "../model/PlayerBan/AdminKickTrace";
import { Player } from "../model/GameObject/Player";
import { BotConfig } from "../model/BotConifg";
import { TeamID } from "../model/GameObject/TeamID";
import { Room } from "../model/RoomObject/RoomObject";

declare global {
    interface Window {
        // bot
        settings: BotConfig // bot settings collection

        roomURIlink: string // for sharing URI link of the room

        logger: Logger; // logger for whole bot application

        isStatRecord: boolean // TRUE means that recording stats now
        isGamingNow: boolean // is playing now?
        isMuteAll: boolean // is All players muted?

        playerList: Map<number, Player> // player list (key: player.id, value: Player), usage: playerList.get(player.id).name

        ballStack: KickStack // stack for ball tracing

        banVoteCache: number[] // top voted players list, value: player.id

        winningStreak: { // how many wins straight (streak)
            count: number
            teamID: TeamID
        } 

        antiTrollingOgFloodCount: number[] // flood counter for OG (player id: number)
        antiTrollingChatFloodCount: number[] // flood counter for chat. (player id: number)
        antiInsufficientStartAbusingCount: number[] // ID record for start with insufficient players (player id: number)
        antiPlayerKickAbusingCount: AdminKickTrace[] // ID and Timestamp record for abusing kick other players (id:number, register date:number)

        sendRoomChat(msg: string, playerID: number | null): void // for send chat message to the game
        uploadStorageData(key: string, stringfiedData: string): void // upload and save on node-persist
        clearStorageData(key: string): void // clear data in node-persist

        // on dev-console tools for emergency
        onEmergency: {
            list(): void
            chat(msg: string, playerID?: number): void
            kick(playerID: number, msg?: string): void
            ban(playerID: number, msg?: string): void
            banclearall(): void
            banlist(): void
            password(password?: string): void
        }

        // haxball
        room: Room // room container
        HBInit(config: RoomConfig): Room
        onHBLoaded(): void
    }
}