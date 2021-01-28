import * as LangRes from "../../resource/strings";
import * as Tst from "../Translator";
import * as TierClass from "../../resource/HElo/tiers.json";
import * as AvatarSet from "../../resource/HElo/avatars.json";
import { PlayerObject } from "../../model/GameObject/PlayerObject";

export function cmdTier(byPlayer: PlayerObject): void {
    var placeholder ={
        tierAvatar9: AvatarSet.avatar_tier_9
        ,tierAvatar8: AvatarSet.avatar_tier_8
        ,tierAvatar7: AvatarSet.avatar_tier_7
        ,tierAvatar6: AvatarSet.avatar_tier_6
        ,tierAvatar5: AvatarSet.avatar_tier_5
        ,tierAvatar4: AvatarSet.avatar_tier_4
        ,tierAvatar3: AvatarSet.avatar_tier_3
        ,tierAvatar2: AvatarSet.avatar_tier_2
        ,tierAvatar1: AvatarSet.avatar_tier_1
        ,tierCutoff9: TierClass.class_tier_9
        ,tierCutoff8: TierClass.class_tier_8
        ,tierCutoff7: TierClass.class_tier_7
        ,tierCutoff6: TierClass.class_tier_6
        ,tierCutoff5: TierClass.class_tier_5
        ,tierCutoff4: TierClass.class_tier_4
        ,tierCutoff3: TierClass.class_tier_3
        ,tierCutoff2: TierClass.class_tier_2
        ,tierCutoff1: TierClass.class_tier_1
    }
    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.command.tier, placeholder), byPlayer.id, 0x479947, "normal", 1);
}
