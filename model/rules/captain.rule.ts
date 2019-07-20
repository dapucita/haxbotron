import { GameRule } from "../GameRule";
import * as huge from "../../stadium/huge.hbs";
// import * as tiny from "../../stadium/tiny.hbs";

export var gameRule: GameRule = {
    ruleName: "captain",
    ruleVersion: "0.0.1",
    ruleAuthor: "Haxbotron",
    ruleDescripttion: "Haxbotron default game rule",
    requisite: {
        minimumPlayers: 4,
        timeLimit: 3,
        scoreLimit: 3,
        teamLock: true
    },
    autoOperating: false,
    statsRecord: true,
    defaultMap: huge.stadiumText,
    readyMap: huge.stadiumText
}