import { PlayerObject } from "../../model/PlayerObject";

export function onGameUnpauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = true; // turn on
}