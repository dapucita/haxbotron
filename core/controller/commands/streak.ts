import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name } from "../../model/GameObject/TeamID";

export function cmdStreak(byPlayer: PlayerObject): void {
    var placeholder ={
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count
    }
    window.room.sendAnnouncement(Tst.maketext(LangRes.command.streak, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
