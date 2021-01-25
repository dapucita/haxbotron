import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";

export function cmdAbout(byPlayer: PlayerObject): void {
    var placeholder ={
        _LaunchTime: window.settings.room._LaunchDate.toLocaleString()
    }
    window.room.sendAnnouncement(Tst.maketext(LangRes.command.about, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
