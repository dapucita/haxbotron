import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as StatCalc from "../../controller/Statistics";
import { gameRule } from "../../model/GameRules/captain.rule";

export function cmdScout(byPlayer: PlayerObject): void {
    if (gameRule.statsRecord == true && window.isStatRecord == true) {
        let expectations: number[] = StatCalc.getTeamWinningExpectation();
        let placeholder = {
            teamExpectationSpec: expectations[0]
            ,teamExpectationRed: expectations[1]
            ,teamExpectationBlue: expectations[2]
        }
        window.room.sendAnnouncement(Tst.maketext(LangRes.command.scout.scouting, placeholder), byPlayer.id, 0x479947, "normal", 1);
    } else {
        window.room.sendAnnouncement(LangRes.command.scout._ErrorNoMode, byPlayer.id, 0xFF7777, "normal", 2);
    }
    
}