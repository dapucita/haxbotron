import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { putTeamNewPlayerFullify } from "../../model/OperateHelper/Quorum";

export function onGameUnpauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = true; // turn on

    // if auto emcee mode is enabled
    if(window.settings.game.rule.autoOperating === true) {
        if(window.isGamingNow === true) { // when game is in match
            putTeamNewPlayerFullify();
        }
    }
}
