import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdStreak(byPlayer: PlayerObject): void {
    var placeholder ={
        streakTeamName: window.winningStreak.getName()
        ,streakTeamCount: window.winningStreak.getCount()
    }
    window.room.sendAnnouncement(Tst.maketext(LangRes.command.streak, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
