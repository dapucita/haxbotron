import { GameRule } from "../GameRule";
import * as gbhothuge from "../../../resources/stadium/gbhothuge.hbs";
import * as gbtraining from "../../../resources/stadium/gbtraining.hbs";

export var gameRule: GameRule = {
    ruleName: "relay",
    ruleVersion: "0.0.1",
    ruleAuthor: "Haxbotron",
    ruleDescripttion: "Haxbotron auto relay game rule",
    requisite: {
        minimumPlayers: 8,
        maximumTeamLimit: 4,
        minimumTeamLimit: 4,
        timeLimit: 3,
        scoreLimit: 3,
        teamLock: true
    },
    autoAdmin: false,
    autoOperating: true,
    captain: false,
    statsRecord: true,
    defaultMap: gbhothuge.stadiumText,
    readyMap: gbtraining.stadiumText
}