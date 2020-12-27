import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onGamePauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = false; // turn off
}
