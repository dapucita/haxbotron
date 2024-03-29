import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { recuritBothTeamFully } from "../../model/OperateHelper/Quorum";
import { setDefaultRoomLimitation, setDefaultStadiums } from "../RoomTools";


export function onGameStopListener(byPlayer: PlayerObject): void {
    /*
    Event called when a game stops.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    Haxball developer Basro said, The game will be stopped automatically after a team victory. (victory -> stop)
    */
    var placeholderStop = {
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
    if(byPlayer !== null) {
        placeholderStop.playerID = byPlayer.id;
        placeholderStop.playerName = byPlayer.name;
    }

    window.gameRoom.isGamingNow = false; // turn off

    let msg = "The game has been stopped.";
    if (byPlayer !== null && byPlayer.id != 0) {
        msg += `(by ${byPlayer.name}#${byPlayer.id})`;
    }
    window.gameRoom.logger.i('onGameStop', msg);
    
    setDefaultStadiums(); // check number of players and auto-set stadium
    setDefaultRoomLimitation(); // score, time, teamlock set

    window.gameRoom.ballStack.initTouchInfo(); // clear touch info
    window.gameRoom.ballStack.clear(); // clear the stack.
    window.gameRoom.ballStack.possClear(); // clear possession count

    // stop replay record and send it
    const replay = window.gameRoom._room.stopRecording();
    
    if(replay && window.gameRoom.social.discordWebhook.feed && window.gameRoom.social.discordWebhook.replayUpload && window.gameRoom.social.discordWebhook.id && window.gameRoom.social.discordWebhook.token) {
        const placeholder = {
            roomName: window.gameRoom.config._config.roomName
            ,replayDate: Date().toLocaleString()
        }

        window._feedSocialDiscordWebhook(window.gameRoom.social.discordWebhook.id, window.gameRoom.social.discordWebhook.token, "replay", {
            message: Tst.maketext(LangRes.onStop.feedSocialDiscordWebhook.replayMessage, placeholder)
            ,data: JSON.stringify(Array.from(replay))
        });
    }

    // when auto emcee mode is enabled
    if(window.gameRoom.config.rules.autoOperating === true) {
        recuritBothTeamFully();
        window.gameRoom._room.startGame(); // start next new game
    }
}
