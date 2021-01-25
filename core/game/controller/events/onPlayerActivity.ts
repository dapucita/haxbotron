import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onPlayerActivityListener(player : PlayerObject): void {
    // Event called when a player gives signs of activity, such as pressing a key.
    // This is useful for detecting inactive players.
    if(window.playerList.has(player.id) === true) {
        window.playerList.get(player.id)!.afktrace.count = 0;
    } else {
        window.logger.e(`Error on onPlayerActivityListener: Cannot access to afktrace.count. ${player.name}#${player.id}(team ${player.team}, conn ${player.conn}) is not registered in playerList.`)
    }
    
}
