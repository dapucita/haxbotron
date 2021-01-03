import * as TierClass from "../../resources/HElo/tiers.json";
import * as AvatarSet from "../../resources/HElo/avatars.json";

export function decideTier(rating: number): Tier {
    if(rating < TierClass.class_tier_2) return Tier.Tier1;
    if(rating < TierClass.class_tier_3 && rating >= TierClass.class_tier_2) return Tier.Tier2;
    if(rating < TierClass.class_tier_4 && rating >= TierClass.class_tier_3) return Tier.Tier3;
    if(rating < TierClass.class_tier_5 && rating >= TierClass.class_tier_4) return Tier.Tier4;
    if(rating < TierClass.class_tier_6 && rating >= TierClass.class_tier_5) return Tier.Tier5;
    if(rating < TierClass.class_tier_7 && rating >= TierClass.class_tier_6) return Tier.Tier6;
    if(rating < TierClass.class_tier_8 && rating >= TierClass.class_tier_7) return Tier.Tier7;
    if(rating < TierClass.class_tier_9 && rating >= TierClass.class_tier_8) return Tier.Tier8;
    if(rating >= TierClass.class_tier_9) return Tier.Tier9;
    return Tier.TierNew;
}

export function getAvatarByTier(tier: Tier): string {
    if(tier === Tier.TierNew) return AvatarSet.avatar_tier_new;
    if(tier === Tier.Tier1) return AvatarSet.avatar_tier_1;
    if(tier === Tier.Tier2) return AvatarSet.avatar_tier_2;
    if(tier === Tier.Tier3) return AvatarSet.avatar_tier_3;
    if(tier === Tier.Tier4) return AvatarSet.avatar_tier_4;
    if(tier === Tier.Tier5) return AvatarSet.avatar_tier_5;
    if(tier === Tier.Tier6) return AvatarSet.avatar_tier_6;
    if(tier === Tier.Tier7) return AvatarSet.avatar_tier_7;
    if(tier === Tier.Tier8) return AvatarSet.avatar_tier_8;
    if(tier === Tier.Tier9) return AvatarSet.avatar_tier_9;
    return AvatarSet.avatar_unknown;
}

export enum Tier {
    TierNew = 0,
    Tier1 = 1,
    Tier2 = 2,
    Tier3 = 3,
    Tier4 = 4,
    Tier5 = 5,
    Tier6 = 6,
    Tier7 = 7,
    Tier8 = 8,
    Tier9 = 9
}
