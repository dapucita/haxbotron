import { PlayerObject } from "../../model/GameObject/PlayerObject";
import * as LangRes from "../../resources/strings";
import { setPlayerData } from "../Storage";

export function cmdStatsReset(byPlayer: PlayerObject): void {
    window.playerList.get(byPlayer.id)!.stats.totals = 0;
    window.playerList.get(byPlayer.id)!.stats.wins = 0;
    window.playerList.get(byPlayer.id)!.stats.goals = 0;
    window.playerList.get(byPlayer.id)!.stats.assists = 0;
    window.playerList.get(byPlayer.id)!.stats.ogs = 0;
    window.playerList.get(byPlayer.id)!.stats.losePoints = 0;
    window.playerList.get(byPlayer.id)!.stats.balltouch = 0;
    window.playerList.get(byPlayer.id)!.stats.passed = 0;
    setPlayerData(window.playerList.get(byPlayer.id)!);

    window.room.sendAnnouncement(LangRes.command.statsreset, byPlayer.id, 0x479947, "normal", 1);
}