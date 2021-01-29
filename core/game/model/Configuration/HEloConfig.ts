export interface HEloConfig {
    factor: {
        placement_match_chances: number
        factor_k_placement: number
        factor_k_normal: number
        factor_k_replace: number
    }
    tier: {
        class_tier_1: number
        class_tier_2: number
        class_tier_3: number
        class_tier_4: number
        class_tier_5: number
        class_tier_6: number
        class_tier_7: number
        class_tier_8: number
        class_tier_9: number
    }
    avatar: {
        avatar_unknown: string
        avatar_tier_new: string
        avatar_tier_1: string
        avatar_tier_2: string
        avatar_tier_3: string
        avatar_tier_4: string
        avatar_tier_5: string
        avatar_tier_6: string
        avatar_tier_7: string
        avatar_tier_8: string
        avatar_tier_9: string
    }
}
