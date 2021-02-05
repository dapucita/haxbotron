import * as LangRes from "../../resource/strings";
import * as Tst from "../Translator";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdTier(byPlayer: PlayerObject): void {
    var placeholder ={
        tierAvatar9: window.gameRoom.config.HElo.avatar.avatar_tier_9
        ,tierAvatar8: window.gameRoom.config.HElo.avatar.avatar_tier_8
        ,tierAvatar7: window.gameRoom.config.HElo.avatar.avatar_tier_7
        ,tierAvatar6: window.gameRoom.config.HElo.avatar.avatar_tier_6
        ,tierAvatar5: window.gameRoom.config.HElo.avatar.avatar_tier_5
        ,tierAvatar4: window.gameRoom.config.HElo.avatar.avatar_tier_4
        ,tierAvatar3: window.gameRoom.config.HElo.avatar.avatar_tier_3
        ,tierAvatar2: window.gameRoom.config.HElo.avatar.avatar_tier_2
        ,tierAvatar1: window.gameRoom.config.HElo.avatar.avatar_tier_1
        ,tierCutoff9: window.gameRoom.config.HElo.tier.class_tier_9
        ,tierCutoff8: window.gameRoom.config.HElo.tier.class_tier_8
        ,tierCutoff7: window.gameRoom.config.HElo.tier.class_tier_7
        ,tierCutoff6: window.gameRoom.config.HElo.tier.class_tier_6
        ,tierCutoff5: window.gameRoom.config.HElo.tier.class_tier_5
        ,tierCutoff4: window.gameRoom.config.HElo.tier.class_tier_4
        ,tierCutoff3: window.gameRoom.config.HElo.tier.class_tier_3
        ,tierCutoff2: window.gameRoom.config.HElo.tier.class_tier_2
        ,tierCutoff1: window.gameRoom.config.HElo.tier.class_tier_1
    }
    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.tier, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
