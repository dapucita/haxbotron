import { PlayerObject } from "../../model/PlayerObject";

export function onKickRateLimitSetListener(min: number, rate: number, burst: number, byPlayer: PlayerObject): void {
    let byPlayerInfo: string = "bot";
    if(byPlayer !== null) {
        byPlayerInfo = byPlayer.name + '#' + byPlayer.id;
    }
    window.logger.i(`The kick rate is changed by ${byPlayerInfo}. (min:${min},rate:${rate},burst:${burst})`);
}