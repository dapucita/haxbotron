import { PlayerObject } from "../../model/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as StatCalc from "../../controller/Statistics";
import { gameRule } from "../../model/rules/rule";

export function cmdPoss(byPlayer: PlayerObject): void {
    let placeholder = {
        possTeamRed: window.ballStack.possCalculate(1)
        ,possTeamBlue: window.ballStack.possCalculate(2),
    }
    window.room.sendAnnouncement(Tst.maketext(LangRes.command.poss, placeholder), byPlayer.id, 0x479947, "normal", 1);
}