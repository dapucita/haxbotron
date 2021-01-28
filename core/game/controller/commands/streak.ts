import * as LangRes from "../../resource/strings";
import * as Tst from "../Translator";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name } from "../../model/GameObject/TeamID";

export function cmdStreak(byPlayer: PlayerObject): void {
    var placeholder ={
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    }
    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.streak, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
