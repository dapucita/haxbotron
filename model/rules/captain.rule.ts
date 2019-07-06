import { GameRule } from "../GameRule";
import * as huge from "../../stadium/huge.hbs";
import * as miniready from "../../stadium/miniready.hbs";

export var gameRule: GameRule = {
    ruleName: "captain",
    ruleVersion: "0.0.1",
    ruleAuthor: "Haxbotron",
    ruleDescripttion: "Haxbotron default game rule",
    requisite: {
        minimumPlayers: 4,
        timeLimit: 3,
        scoreLimit: 3,
        timeLock: true
    },
    autoOperating: false,
    statsRecord: true,
    defaultMap: huge.stadiumText,
    readyMap: miniready.stadiumText
}