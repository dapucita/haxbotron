import { PlayerObject } from "../../model/PlayerObject";

export function onPlayerActivityListener(player : PlayerObject): void {
    // Event called when a player gives signs of activity, such as pressing a key.
    // This is useful for detecting inactive players.
    window.playerList.get(player.id).afktrace.count = 0;
}