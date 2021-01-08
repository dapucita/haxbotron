import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { Player } from "../../model/GameObject/Player";
import { getUnixTimestamp } from "../Statistics";
import { roomPlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as BotSettings from "../../resources/settings.json";
import { setBanlistDataToDB } from "../Storage";

export function cmdVote(byPlayer: PlayerObject, message?: string): void {
    if (!BotSettings.banVoteEnable) {
        // if ban vote is not enabled
        window.room.sendAnnouncement(LangRes.command._ErrorDisabled, byPlayer.id, 0xFF7777, "normal", 1);
        return; //abort this command
    }
    if (message !== undefined) {
        if (message.charAt(0) == "#") {
            let targetVoteID: number = parseInt(message.substr(1), 10);
            if (isNaN(targetVoteID) !== true && window.playerList.has(targetVoteID) === true) {
                let placeholderVote = {
                    targetName: window.playerList.get(targetVoteID)!.name
                    ,targetID: targetVoteID
                }
                if (window.playerList.get(byPlayer.id)!.voteTarget === targetVoteID) { // if already voted, then cancel
                    window.playerList.get(byPlayer.id)!.voteTarget = -1; // reset vote
                    window.playerList.get(targetVoteID)!.voteGet--; // reduce voted count
                    window.room.sendAnnouncement(Tst.maketext(LangRes.command.vote.voteCancel, placeholderVote), byPlayer.id, 0x479947, "normal", 1);
                } else { // or vote
                    if (roomPlayersNumberCheck() >= BotSettings.banVoteAllowMinimum) { // check current players and vote
                        window.playerList.get(byPlayer.id)!.voteTarget = targetVoteID; // vote and set
                        window.playerList.get(targetVoteID)!.voteGet++; // increase voted count
                        window.room.sendAnnouncement(Tst.maketext(LangRes.command.vote.voteComplete, placeholderVote), byPlayer.id, 0x479947, "normal", 1);

                        const banTimeStamp: number = getUnixTimestamp(); // get current timestamp
                        window.playerList.forEach(async (player: Player) => {
                            if(player.voteGet >= BotSettings.banVoteExecuteMinimum) { // if the player got votes over minimum requirements, then kick (fixed-term ban)
                                //add into ban list (not permanent ban, but fixed-term ban)
                                await setBanlistDataToDB({ conn: player.conn, reason: LangRes.command.vote.voteBanMessage, register: banTimeStamp, expire: banTimeStamp+BotSettings.banVoteBanMillisecs });
                                window.room.kickPlayer(player.id, LangRes.command.vote.voteBanMessage, false); // and kick
                            }
                        });
                    } else { // if minimum requirement isn't met, cancel this vote and notify warning.
                        window.room.sendAnnouncement(LangRes.command.vote._ErrorNoPermission, byPlayer.id, 0xFF7777, "normal", 1);
                    }
                }
            } else {
                window.room.sendAnnouncement(LangRes.command.vote._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 1);
            }
        } else {
            window.room.sendAnnouncement(LangRes.command.vote._ErrorNoPlayer, byPlayer.id, 0xFF7777, "normal", 1);
        }
    } else {
        let statusMessage: string = LangRes.command.vote.voteIntroduce;
        let voteTargetID: number = window.playerList.get(byPlayer.id)!.voteTarget || -1;
        let placeholder = {
            targetName: '',
            targetID: voteTargetID,
            voteList: '',
        };

        if(window.banVoteCache.length >= 1) { // if there are some votes (include top voted players only)
            for(let i: number = 0; i < window.banVoteCache.length; i++) {
                if(window.playerList.has(window.banVoteCache[i])) {
                    placeholder.voteList += `${window.playerList.get(window.banVoteCache[i])!.name}#${window.banVoteCache[i]} `;
                }
            }
            statusMessage += '\n' + LangRes.command.vote.voteAutoNotify;
        }

        if(voteTargetID !== -1 && window.playerList.has(voteTargetID)) {
            statusMessage += '\n' + LangRes.command.vote.voteStatus;
            placeholder.targetName = window.playerList.get(voteTargetID)!.name;
        }
        window.room.sendAnnouncement(Tst.maketext(statusMessage, placeholder), byPlayer.id, 0x479947, "normal", 1);
    }
}
