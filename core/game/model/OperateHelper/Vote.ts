import * as BotSettings from "../../resource/settings.json";
import { PlayerObject } from "../GameObject/PlayerObject";

export function refreshBanVoteCache(): void {
    let topVotedPlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.voteGet >= Math.floor(BotSettings.banVoteExecuteMinimum / 2));

    window.banVoteCache = []; // init

    topVotedPlayers.forEach((eachPlayer: PlayerObject) => {
        window.banVoteCache.push(eachPlayer.id); // update it
    });
}
