import { Logger } from "./controller/Logger";
import { RoomConfig } from '../model/RoomObject/RoomConfig';
import { KickStack } from "../model/GameObject/BallTrace";
import { Logger } from "../controller/Logger";
import { AdminKickTrace } from "../model/PlayerBan/AdminKickTrace";
import { Player } from "../model/GameObject/Player";
import { BotConfig } from "../model/BotConifg";
import { TeamID } from "../model/GameObject/TeamID";
import { Room } from "../model/RoomObject/RoomObject";
import { BanList } from "../model/PlayerBan/BanList";
import { PlayerStorage } from "../model/GameObject/PlayerObject";

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

        // CRUD with DB Server via REST API
        async createPlayerDB(player: PlayerStorage): Promise<void>
        async readPlayerDB(playerAuth: string): Promise<PlayerStorage|undefined>
        async updatePlayerDB(player: PlayerStorage): Promise<void>
        async deletePlayerDB(playerAuth: string):Promise<void>

        async createBanlistDB(banList: BanList): Promise<void>
        async readBanlistDB(playerConn: string): Promise<BanList|undefined>
        async updateBanlistDB(banList: BanList): Promise<void>
        async deleteBanlistDB(playerConn: string): Promise<void>

        async createSuperadminDB(key: string, description: string): Promise<void>
        async readSuperadminDB(key: string): Promise<string | undefined>
        //async updateSuperadminDB is not implemented.
        async deleteSuperadminDB(key: string): Promise<void>

        // on dev-console tools for emergency
        onEmergency: {
            list(): void
            chat(msg: string, playerID?: number): void
            kick(playerID: number, msg?: string): void
            ban(playerID: number, msg?: string): void
            //banclearall(): void
            //banlist(): void
            password(password?: string): void
        }

        // haxball
        room: Room // room container
        HBInit(config: RoomConfig): Room
        onHBLoaded(): void
    }
}