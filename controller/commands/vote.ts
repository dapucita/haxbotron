import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { Player } from "../../model/GameObject/Player";
import { roomPlayersNumberCheck } from "../RoomTools";
import { getUnixTimestamp } from "../Statistics";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as BotSettings from "../../resources/settings.json";
import * as Ban from "../Ban";

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
                if (window.playerList.get(byPlayer.id)!.voteTarget === targetVoteID) { // if already voted, then cancel
                    window.playerList.get(byPlayer.id)!.voteTarget = -1; // reset vote
                    window.playerList.get(targetVoteID)!.voteGet--; // reduce voted count
                    window.room.sendAnnouncement(LangRes.command.vote.voteCancel, byPlayer.id, 0x479947, "normal", 1);
                } else { // or vote
                    if (roomPlayersNumberCheck() >= BotSettings.banVoteAllowMinimum) { // check current players and vote
                        window.playerList.get(byPlayer.id)!.voteTarget = targetVoteID; // vote and set
                        window.playerList.get(targetVoteID)!.voteGet++; // increase voted count
                        window.room.sendAnnouncement(LangRes.command.vote.voteComplete, byPlayer.id, 0x479947, "normal", 1);

                        const banTimeStamp: number = getUnixTimestamp(); // get current timestamp
                        window.playerList.forEach((player: Player) => {
                            if(player.voteGet >= BotSettings.banVoteExecuteMinimum) { // if the player got votes over minimum requirements, then kick (fixed-term ban)
                                //add into ban list (not permanent ban, but fixed-term ban)
                                Ban.bListAdd({ conn: player.conn, reason: LangRes.command.vote.voteBanMessage, register: banTimeStamp, expire: banTimeStamp+BotSettings.banVoteBanMillisecs });
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
            targetID: voteTargetID
        };
        if(voteTargetID !== -1 && window.playerList.has(voteTargetID)) {
            statusMessage += '\n' + LangRes.command.vote.voteStatus;
            placeholder.targetName = window.playerList.get(voteTargetID)!.name;
        }
        window.room.sendAnnouncement(Tst.maketext(statusMessage, placeholder), byPlayer.id, 0x479947, "normal", 1);
    }
}
