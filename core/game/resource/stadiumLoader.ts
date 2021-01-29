// IMPORT MAP FILE
import * as mapBig from "./stadium/big.hbs"
import * as mapBigEasy from "./stadium/bigeasy.hbs"
import * as mapBigHockey from "./stadium/bighockey.hbs"
import * as mapBigRounded from "./stadium/bigrounded.hbs"
import * as mapClassic from "./stadium/classic.hbs"
import * as mapEasy from "./stadium/easy.hbs"
import * as mapRounded from "./stadium/rounded.hbs"
import * as mapSmall from "./stadium/small.hbs"
import * as mapHockey from "./stadium/hockey.hbs"
import * as mapHuge from "./stadium/huge.hbs"

import * as mapGBTraining from "./stadium/gbtraining.hbs"
import * as mapGBHotBig from "./stadium/gbhotbig.hbs"
import * as mapGBHotClassic from "./stadium/gbhotclassic.hbs"
import * as mapGBHotHuge from "./stadium/gbhothuge.hbs"
import * as mapGBHotSmall from "./stadium/gbhotsmall.hbs"
import * as mapGBSoHot from "./stadium/gbsohot.hbs"
import * as mapRealSoccer from "./stadium/realsoccer.hbs"

/**
* load stadium map (JSON stringified).
*/
export function loadStadiumData(mapName: string): string {
    // LINK MAP FILE
    switch (mapName) {
        case 'big':
            return mapBig.stadiumText;
        case 'bigeasy':
            return mapBigEasy.stadiumText;
        case 'bighockey':
            return mapBigHockey.stadiumText;
        case 'bigrounded':
            return mapBigRounded.stadiumText;
        case 'clssic':
            return mapClassic.stadiumText;
        case 'easy':
            return mapEasy.stadiumText;
        case 'rounded':
            return mapRounded.stadiumText;
        case 'small':
            return mapSmall.stadiumText;
        case 'hockey':
            return mapHockey.stadiumText;
        case 'huge':
            return mapHuge.stadiumText;

        case 'gbtraining':
            return mapGBTraining.stadiumText;
        case 'gbhotbig':
            return mapGBHotBig.stadiumText;
        case 'gbhotclassic':
            return mapGBHotClassic.stadiumText;
        case 'gbhothuge':
            return mapGBHotHuge.stadiumText;
        case 'gbhotsmall':
            return mapGBHotSmall.stadiumText;
        case 'gbsohot':
            return mapGBSoHot.stadiumText;
        case 'realSoccer':
            return mapRealSoccer.stadiumText;

        default:
            return mapGBTraining.stadiumText;
    }
}