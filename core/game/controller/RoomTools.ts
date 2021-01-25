import * as Tst from "./Translator";
import * as LangRes from "../resource/strings";
import { PlayerObject } from "../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../model/GameObject/TeamID";

export function setDefaultStadiums(): void {
    // set stadium maps as default setting
    if (window.settings.game.rule.statsRecord === true && window.isStatRecord === true) {
        window.room.setCustomStadium(window.settings.game.rule.defaultMap); // if game mode is 'stats'
    } else {
        window.room.setCustomStadium(window.settings.game.rule.readyMap); // if game mode is 'ready'
    }
}

export function setDefaultRoomLimitation(): void {
    window.room.setScoreLimit(window.settings.game.rule.requisite.scoreLimit);
    window.room.setTimeLimit(window.settings.game.rule.requisite.timeLimit);
    window.room.setTeamsLock(window.settings.game.rule.requisite.teamLock);
}

export function updateAdmins(): void {
    let placeholderUpdateAdmins = {
        playerID: 0,
        playerName: '',
        gameRuleName: window.settings.game.rule.ruleName,
        gameRuleDescription: window.settings.game.rule.ruleDescripttion,
        gameRuleLimitTime: window.settings.game.rule.requisite.timeLimit,
        gameRuleLimitScore: window.settings.game.rule.requisite.scoreLimit,
        gameRuleNeedMin: window.settings.game.rule.requisite.minimumPlayers,
        possTeamRed: window.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.winningStreak.teamID),
        streakTeamCount: window.winningStreak.count
    };

    // Get all players except the host (id = 0 is always the host)
    let players = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.permissions.afkmode !== true); // only no afk mode players
    if (players.length == 0) return; // If no players left, do nothing.
    if (players.find((player: PlayerObject) => player.admin) != null) return; // Do nothing if any admin player is still left.

    placeholderUpdateAdmins.playerID = players[0].id;
    placeholderUpdateAdmins.playerName = window.playerList.get(players[0].id)!.name;

    window.room.setPlayerAdmin(players[0]!.id, true); // Give admin to the first non admin player in the list
    window.playerList.get(players[0].id)!.admin = true;
    window.logger.i(`${window.playerList.get(players[0].id)!.name}#${players[0].id} has been admin(value:${window.playerList.get(players[0].id)!.admin},super:${window.playerList.get(players[0].id)!.permissions.superadmin}), because there were no admin players.`);
    window.room.sendAnnouncement(Tst.maketext(LangRes.funcUpdateAdmins.newAdmin, placeholderUpdateAdmins), null, 0x00FF00, "normal", 0);
}

export function shuffleArray<T>(array: T[]): T[] {
    if (!Array.isArray(array)) {
        throw new TypeError(`shuffleArray: Expected an Array, got ${typeof array} instead.`);
    }

    const oldArray = [...array];
    let newArray = new Array<T>();

    while (oldArray.length) {
        const i = Math.floor(Math.random() * oldArray.length);
        newArray = newArray.concat(oldArray.splice(i, 1));
    }

    return newArray;
}

export function getCookieFromHeadless(name: string): string {
    let result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
    return result ? result[1] : '';
}
