import * as Tst from "./Translator";
import * as LangRes from "../resource/strings";
import { PlayerObject } from "../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../model/GameObject/TeamID";

export function setDefaultStadiums(): void {
    // set stadium maps as default setting
    if (window.gameRoom.config.rules.statsRecord === true && window.gameRoom.isStatRecord === true) {
        window.gameRoom._room.setCustomStadium(window.gameRoom.stadiumData.default); // if game mode is 'stats'
    } else {
        window.gameRoom._room.setCustomStadium(window.gameRoom.stadiumData.training); // if game mode is 'ready'
    }
}

export function setDefaultRoomLimitation(): void {
    window.gameRoom._room.setScoreLimit(window.gameRoom.config.rules.requisite.scoreLimit);
    window.gameRoom._room.setTimeLimit(window.gameRoom.config.rules.requisite.timeLimit);
    window.gameRoom._room.setTeamsLock(window.gameRoom.config.rules.requisite.teamLock);
}

export function updateAdmins(): void {
    let placeholderUpdateAdmins = {
        playerID: 0,
        playerName: '',
        gameRuleName: window.gameRoom.config.rules.ruleName,
        gameRuleLimitTime: window.gameRoom.config.rules.requisite.timeLimit,
        gameRuleLimitScore: window.gameRoom.config.rules.requisite.scoreLimit,
        gameRuleNeedMin: window.gameRoom.config.rules.requisite.minimumPlayers,
        possTeamRed: window.gameRoom.ballStack.possCalculate(TeamID.Red),
        possTeamBlue: window.gameRoom.ballStack.possCalculate(TeamID.Blue),
        streakTeamName: convertTeamID2Name(window.gameRoom.winningStreak.teamID),
        streakTeamCount: window.gameRoom.winningStreak.count
    };

    // Get all players except the host (id = 0 is always the host)
    let players = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.permissions.afkmode !== true); // only no afk mode players
    if (players.length == 0) return; // If no players left, do nothing.
    if (players.find((player: PlayerObject) => player.admin) != null) return; // Do nothing if any admin player is still left.

    placeholderUpdateAdmins.playerID = players[0].id;
    placeholderUpdateAdmins.playerName = window.gameRoom.playerList.get(players[0].id)!.name;

    window.gameRoom._room.setPlayerAdmin(players[0]!.id, true); // Give admin to the first non admin player in the list
    window.gameRoom.playerList.get(players[0].id)!.admin = true;
    window.gameRoom.logger.i('updateAdmins', `${window.gameRoom.playerList.get(players[0].id)!.name}#${players[0].id} has been admin(value:${window.gameRoom.playerList.get(players[0].id)!.admin},super:${window.gameRoom.playerList.get(players[0].id)!.permissions.superadmin}), because there were no admin players.`);
    window.gameRoom._room.sendAnnouncement(Tst.maketext(LangRes.funcUpdateAdmins.newAdmin, placeholderUpdateAdmins), null, 0x00FF00, "normal", 0);
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
