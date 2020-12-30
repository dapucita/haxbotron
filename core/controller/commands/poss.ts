import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import { TeamID } from "../../model/GameObject/TeamID";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdPoss(byPlayer: PlayerObject): void {
    let placeholder = {
        possTeamRed: window.ballStack.possCalculate(TeamID.Red)
        ,possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
    }
    window.room.sendAnnouncement(Tst.maketext(LangRes.command.poss, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
