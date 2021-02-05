import { PlayerObject } from "../GameObject/PlayerObject";

export function refreshBanVoteCache(): void {
    let topVotedPlayers: PlayerObject[] = window.gameRoom._room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.gameRoom.playerList.get(player.id)!.voteGet >= Math.floor(window.gameRoom.config.settings.banVoteExecuteMinimum / 2));

    window.gameRoom.banVoteCache = []; // init

    topVotedPlayers.forEach((eachPlayer: PlayerObject) => {
        window.gameRoom.banVoteCache.push(eachPlayer.id); // update it
    });
}
