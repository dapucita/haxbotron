import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onKickRateLimitSetListener(min: number, rate: number, burst: number, byPlayer: PlayerObject): void {
    let byPlayerInfo: string = "bot";
    if(byPlayer !== null) {
        byPlayerInfo = byPlayer.name + '#' + byPlayer.id;
    }
    window.gameRoom.logger.i('onKickRateLimitSet', `The kick rate is changed by ${byPlayerInfo}. (min:${min},rate:${rate},burst:${burst})`);
}
