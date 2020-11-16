import { PlayerObject } from "../../model/PlayerObject";

export function onGamePauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = false; // turn off
}