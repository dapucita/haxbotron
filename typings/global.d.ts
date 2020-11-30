import { Logger } from "./controller/Logger";
import { RoomConfig } from '../model/RoomConfig';
import { LogMessage } from "../model/LogMessage";
import { KickStack } from "../model/BallTrace";
import { Logger } from "../controller/Logger";
import { AdminKickTrace } from "../model/AdminKickTrace";

declare global {
    interface Window {
        // bot
        roomURIlink: string // for sharing URI link of the room

        logger: Logger; // logger for whole bot application
        //logQueue: LogMessage[] // for sharing log message //no more use

        isStatRecord: boolean // TRUE means that recording stats now
        isGamingNow: boolean // is playing now?
        isMuteAll: boolean // is All players muted?

        playerList: Map // playerList:Player[] is an Map object. // playerList.get(player.id).name; : usage for playerList
        ballStack: KickStack // stack for ball tracing
        winningStreak: any //  how many wins straight (streak)

        antiTrollingOgFloodCount: number[] // flood counter for OG (player id: number)
        antiTrollingChatFloodCount: number[] // flood counter for chat. (player id: number)
        antiInsufficientStartAbusingCount: number[] // ID record for start with insufficient players (player id: number)
        antiPlayerKickAbusingCount: AdminKickTrace[] // ID and Timestamp record for abusing kick other players (id:number, register date:number)

        sendRoomChat(msg: string, playerID?: number): void // for send chat message to the game

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
        room: any // room container
        HBInit(config: RoomConfig): any
        onHBLoaded(): void
    }
}