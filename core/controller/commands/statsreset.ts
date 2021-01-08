import * as LangRes from "../../resources/strings";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertToPlayerStorage, setPlayerDataToDB } from "../Storage";

export async function cmdStatsReset(byPlayer: PlayerObject): Promise<void> {
    window.playerList.get(byPlayer.id)!.stats.rating = 1000;
    window.playerList.get(byPlayer.id)!.stats.totals = 0;
    window.playerList.get(byPlayer.id)!.stats.wins = 0;
    window.playerList.get(byPlayer.id)!.stats.goals = 0;
    window.playerList.get(byPlayer.id)!.stats.assists = 0;
    window.playerList.get(byPlayer.id)!.stats.ogs = 0;
    window.playerList.get(byPlayer.id)!.stats.losePoints = 0;
    window.playerList.get(byPlayer.id)!.stats.balltouch = 0;
    window.playerList.get(byPlayer.id)!.stats.passed = 0;
    await setPlayerDataToDB(convertToPlayerStorage(window.playerList.get(byPlayer.id)!));

    window.room.sendAnnouncement(LangRes.command.statsreset, byPlayer.id, 0x479947, "normal", 1);
}
