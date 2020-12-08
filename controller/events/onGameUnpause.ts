import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onGameUnpauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = true; // turn on
}