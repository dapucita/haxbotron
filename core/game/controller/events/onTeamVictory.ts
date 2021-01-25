import * as Tst from "../Translator";
import * as LangRes from "../../resource/strings";
import * as BotSettings from "../../resource/settings.json";
import { ScoresObject } from "../../model/GameObject/ScoresObject";
import { PlayerObject } from "../../model/GameObject/PlayerObject";
import { convertTeamID2Name, TeamID } from "../../model/GameObject/TeamID";
import { shuffleArray } from "../RoomTools";
import { roomActivePlayersNumberCheck } from "../../model/OperateHelper/Quorum";
import { HElo, MatchKFactor, MatchResult, StatsRecord } from "../../model/Statistics/HElo";
import { convertToPlayerStorage, setPlayerDataToDB } from "../Storage";

export async function onTeamVictoryListener(scores: ScoresObject): Promise<void> {
    // Event called when a team 'wins'. not just when game ended.
    // records vicotry in stats. total games also counted in this event.
    // Haxball developer Basro said, The game will be stopped automatically after a team victory. (victory -> stop)
    let placeholderVictory = {
        teamID: TeamID.Spec,
        teamName: '',
        redScore: scores.red,
        blueScore: scores.blue,
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

    let ratingHelper: HElo = HElo.getInstance(); // get HElo instance for calc rating

    let winningMessage: string = '';

    let allActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && window.playerList.get(player.id)!.permissions.afkmode === false); // non afk players
    let teamPlayers: PlayerObject[] = allActivePlayers.filter((eachPlayer: PlayerObject) => eachPlayer.team !== TeamID.Spec); // except Spectators players
    let redTeamPlayers: PlayerObject[] = teamPlayers.filter((eachPlayer: PlayerObject) => eachPlayer.team === TeamID.Red);
    let blueTeamPlayers: PlayerObject[] = teamPlayers.filter((eachPlayer: PlayerObject) => eachPlayer.team === TeamID.Blue);

    let winnerTeamID: TeamID;
    let loserTeamID: TeamID;

    if (scores.red > scores.blue) {
        winnerTeamID = TeamID.Red;
        loserTeamID = TeamID.Blue;
        placeholderVictory.teamName = 'Red';
    } else {
        winnerTeamID = TeamID.Blue;
        loserTeamID = TeamID.Red;
        placeholderVictory.teamName = 'Blue';
    }
    placeholderVictory.teamID = winnerTeamID;
    winningMessage = Tst.maketext(LangRes.onVictory.victory, placeholderVictory);

    window.isGamingNow = false; // turn off

    if (window.settings.game.rule.statsRecord == true && window.isStatRecord == true) { // records when game mode is for stats recording.
        // HElo rating part ================
        // make diffs array (key: index by teamPlayers order, value: number[])
        

        // make stat records
        let redStatsRecords: StatsRecord[] = ratingHelper.makeStasRecord(winnerTeamID===TeamID.Red?MatchResult.Win:MatchResult.Lose, redTeamPlayers);
        let blueStatsRecords: StatsRecord[] = ratingHelper.makeStasRecord(winnerTeamID===TeamID.Blue?MatchResult.Win:MatchResult.Lose, blueTeamPlayers);
        
        // calc average of team ratings
        let winTeamRatingsMean: number = ratingHelper.calcTeamRatingsMean(winnerTeamID===TeamID.Red?redTeamPlayers:blueTeamPlayers); 
        let loseTeamRatingsMean: number = ratingHelper.calcTeamRatingsMean(loserTeamID===TeamID.Red?redTeamPlayers:blueTeamPlayers);
        
        // get diff and update rating
        redStatsRecords.forEach((eachItem: StatsRecord, idx: number) => {
            let diffArray: number[] = []; 
            let oldRating: number = window.playerList.get(redTeamPlayers[idx].id)!.stats.rating;
            for(let i: number = 0; i < blueStatsRecords.length; i++) {
                diffArray.push(ratingHelper.calcBothDiff(eachItem, blueStatsRecords[i], winTeamRatingsMean, loseTeamRatingsMean, eachItem.matchKFactor));
            }
            let newRating: number = ratingHelper.calcNewRating(eachItem.rating, diffArray);
            window.playerList.get(redTeamPlayers[idx].id)!.stats.rating = newRating;
            window.logger.i(`Red Player ${redTeamPlayers[idx].name}#${redTeamPlayers[idx].id}'s rating has become ${newRating} from ${oldRating}.`);
        });
        blueStatsRecords.forEach((eachItem: StatsRecord, idx: number) => {
            let diffArray: number[] = []; 
            let oldRating: number = window.playerList.get(blueTeamPlayers[idx].id)!.stats.rating;
            for(let i: number = 0; i < redStatsRecords.length; i++) {
                diffArray.push(ratingHelper.calcBothDiff(eachItem, redStatsRecords[i], winTeamRatingsMean, loseTeamRatingsMean, eachItem.matchKFactor));
            }
            let newRating: number = ratingHelper.calcNewRating(eachItem.rating, diffArray);
            window.playerList.get(blueTeamPlayers[idx].id)!.stats.rating = newRating;
            window.logger.i(`Blue Player ${blueTeamPlayers[idx].name}#${blueTeamPlayers[idx].id}'s rating has become ${newRating} from ${oldRating}.`);
        });

        // record stats part ================
        teamPlayers.forEach(async (eachPlayer: PlayerObject) => {
            if (eachPlayer.team === winnerTeamID) { // if this player is winner
                window.playerList.get(eachPlayer.id)!.stats.wins++; //records a win
            }
            window.playerList.get(eachPlayer.id)!.stats.totals++; // records game count and other stats
            window.playerList.get(eachPlayer.id)!.stats.goals += window.playerList.get(eachPlayer.id)!.matchRecord.goals;
            window.playerList.get(eachPlayer.id)!.stats.assists += window.playerList.get(eachPlayer.id)!.matchRecord.assists;
            window.playerList.get(eachPlayer.id)!.stats.ogs += window.playerList.get(eachPlayer.id)!.matchRecord.ogs;
            window.playerList.get(eachPlayer.id)!.stats.losePoints += window.playerList.get(eachPlayer.id)!.matchRecord.losePoints;
            window.playerList.get(eachPlayer.id)!.stats.balltouch += window.playerList.get(eachPlayer.id)!.matchRecord.balltouch;
            window.playerList.get(eachPlayer.id)!.stats.passed += window.playerList.get(eachPlayer.id)!.matchRecord.passed;

            window.playerList.get(eachPlayer.id)!.matchRecord = { // init match record
                goals: 0,
                assists: 0,
                ogs: 0,
                losePoints: 0,
                balltouch: 0,
                passed: 0,
                factorK: MatchKFactor.Normal
            }

            await setPlayerDataToDB(convertToPlayerStorage(window.playerList.get(eachPlayer.id)!)); // updates stats
        });

        // win streak part ================
        if (winnerTeamID !== window.winningStreak.teamID) {
            // if winner team is changed
            window.winningStreak.count = 1; // init count and set to won one game
        } else {
            window.winningStreak.count++; // increase count
        }
        window.winningStreak.teamID = winnerTeamID; // set winner team id

        // update placeholder
        placeholderVictory.streakTeamName = convertTeamID2Name(window.winningStreak.teamID);
        placeholderVictory.streakTeamCount = window.winningStreak.count;

        window.logger.i(`${placeholderVictory.streakTeamName} team wins streak ${placeholderVictory.streakTeamCount} games.`); // log it

        if (window.winningStreak.count >= 3) {
            winningMessage += '\n' + Tst.maketext(LangRes.onVictory.burning, placeholderVictory);
        }
    }

    // when auto emcee mode is enabled
    if (window.settings.game.rule.autoOperating === true) {
        if (window.winningStreak.count >= BotSettings.rerollWinstreakCriterion) {
            // if winning streak count has reached limit
            if (BotSettings.rerollWinStreak === true && roomActivePlayersNumberCheck() >= window.settings.game.rule.requisite.minimumPlayers) {
                // if rerolling option is enabled, then reroll randomly

                window.winningStreak.count = 0; // init count

                // reroll randomly
                // get new active players list and shuffle it randomly
                let allPlayersList: PlayerObject[] = window.room.getPlayerList();
                let shuffledIDList: number[] = shuffleArray(allPlayersList
                    .filter((eachPlayer: PlayerObject) => eachPlayer.id !== 0 && window.playerList.get(eachPlayer.id)!.permissions.afkmode === false)
                    .map((eachPlayer: PlayerObject) => eachPlayer.id)
                );

                allPlayersList.forEach((eachPlayer: PlayerObject) => {
                    window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // move all to spec
                });

                for (let i: number = 0; i < shuffledIDList.length; i++) {
                    if (i < window.settings.game.rule.requisite.eachTeamPlayers) window.room.setPlayerTeam(shuffledIDList[i], TeamID.Red);
                    if (i >= window.settings.game.rule.requisite.eachTeamPlayers && i < window.settings.game.rule.requisite.eachTeamPlayers * 2) window.room.setPlayerTeam(shuffledIDList[i], TeamID.Blue);
                }

                winningMessage += '\n' + Tst.maketext(LangRes.onVictory.reroll, placeholderVictory);
                window.logger.i(`Whole players are shuffled. (${shuffledIDList.toString()})`);
            }
        } else { // or still under the limit, then change spec and loser team
            // this count is for determine how many players will be alive in loser team
            let outPlayersCount: number = window.settings.game.rule.requisite.eachTeamPlayers; // init as full count.

            teamPlayers
                .filter((player: PlayerObject) => player.team === loserTeamID)
                .forEach((eachPlayer: PlayerObject) => {
                    if (BotSettings.guaranteePlayingTime === true) {
                        // if guarantee playing time option is enabled
                        if ((scores.time - window.playerList.get(eachPlayer.id)!.entrytime.matchEntryTime) > BotSettings.guaranteedPlayingTimeSeconds) {
                            window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // move losers played enough time to Spec team
                        } else {
                            outPlayersCount--; // decrease count as this player will be alive in loser team
                        }
                    } else {
                        // if guarantee playing time option is disabled
                        window.room.setPlayerTeam(eachPlayer.id, TeamID.Spec); // just move all losers to Spec team
                    }
                });

            // get new spec player list
            let specActivePlayers: PlayerObject[] = window.room.getPlayerList().filter((player: PlayerObject) => player.id !== 0 && player.team === TeamID.Spec && window.playerList.get(player.id)!.permissions.afkmode === false);

            for (let i: number = 0; i < outPlayersCount && i < specActivePlayers.length; i++) {
                window.room.setPlayerTeam(specActivePlayers[i].id, loserTeamID); // move Specs to challenger team
            }
        }
    }

    // notify victory
    window.logger.i(`The game has ended. Scores ${scores.red}:${scores.blue}.`);
    window.room.sendAnnouncement(winningMessage, null, 0x00FF00, "bold", 1);
}
