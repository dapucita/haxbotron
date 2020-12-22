import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";
import * as Tst from "../Translator";
import * as StatCalc from "../../controller/Statistics";

export function cmdVote(byPlayer: PlayerObject, message?: string): void {
    if (message !== undefined) {
        if (message.charAt(0) == "#") {
            let targetVoteID: number = parseInt(message.substr(1), 10);
            if (isNaN(targetVoteID) !== true && window.playerList.has(targetVoteID) === true) {
                //TODO: 투표/투표취소 구현 (인원체크 필요)
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
            statusMessage += LangRes.command.vote.voteStatus;
            placeholder.targetName = window.playerList.get(voteTargetID)!.name;
        }
        window.room.sendAnnouncement(Tst.maketext(statusMessage, placeholder), byPlayer.id, 0x479947, "normal", 1);
    }
}