import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resource/strings";
import * as Tst from "../Translator";

export function cmdAbout(byPlayer: PlayerObject): void {
    var placeholder ={
        _LaunchTime: window.gameRoom.config._LaunchDate.toLocaleString()
        ,RoomName: window.gameRoom.config._config.roomName || "Untitled"
    }
    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.about, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
