import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onPlayerActivityListener(player : PlayerObject): void {
    // Event called when a player gives signs of activity, such as pressing a key.
    // This is useful for detecting inactive players.
    if(player != null && window.gameRoom.playerList.has(player.id) === true) {
        window.gameRoom.playerList.get(player.id)!.afktrace.count = 0;

        // reflect position in the field
        window.gameRoom.playerList.get(player.id)!.position = {
            x: player.position?.x || null
            ,y: player.position?.y || null
        }
    } else {
        window.gameRoom.logger.e('onPlayerActivity', `Error on onPlayerActivityListener: Cannot access to afktrace.count. ${player.name}#${player.id}(team ${player.team}, conn ${player.conn}) is not registered in playerList.`)
    }
    
}
