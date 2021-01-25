import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function onGamePauseListener(byPlayer: PlayerObject | null): void {
    window.isGamingNow = false; // turn off

    if(byPlayer === null && window.settings.game.rule.autoOperating === true) { // if game rule is set as auto operating mode
        window.room.sendAnnouncement(LangRes.onGamePause.readyForStart, null, 0x00FF00, "normal", 2); // notify for order prepare game
        setTimeout(() => {
            window.room.pauseGame(false); // resume(unpause) (and will call onGameUnpause event)
        }, 5000); // 5secs
    }
}
