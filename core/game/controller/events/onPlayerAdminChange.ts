import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { updateAdmins } from "../RoomTools";
import { PlayerObject } from "../../model/GameObject/PlayerObject";


export function onPlayerAdminChangeListener(changedPlayer: PlayerObject, byPlayer: PlayerObject): void {
    /* Event called when a player's admin rights are changed.
            byPlayer is the player which caused the event (can be null if the event wasn't caused by a player). */
    let placeholderAdminChange = {
        playerID: changedPlayer.id,
        playerName: changedPlayer.name
    }

    window.gameRoom.playerList.get(changedPlayer.id)!.admin = changedPlayer.admin; // update

    if (changedPlayer.admin == true) { // if this event means that the player has been admin
        if (window.gameRoom.playerList.get(changedPlayer.id)!.permissions.afkmode == true) {
            // if changedPlayer is in afk mode, reject
            window.gameRoom._room.setPlayerAdmin(changedPlayer.id, false);
            window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.onAdminChange.afknoadmin, placeholderAdminChange), null, 0xFF0000, "normal", 2);
            return;
        } else {
            // make this player admin
            if (byPlayer !== null) {
                window.gameRoom.logger.i('onPlayerAdminChange', `${changedPlayer.name}#${changedPlayer.id} has been admin(super:${window.gameRoom.playerList.get(changedPlayer.id)!.permissions.superadmin}) by ${byPlayer.name}#${byPlayer.id}`);
            }
            return;
        }
    }
    
    if(window.gameRoom.config.rules.autoAdmin === true) { // if auto admin option is enabled
        updateAdmins(); // check when the last admin player disqulified by self
    }

    window._emitSIOPlayerStatusChangeEvent(changedPlayer.id);
}
