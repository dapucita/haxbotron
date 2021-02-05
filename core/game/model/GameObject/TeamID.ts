import * as LangRes from "../../resource/strings";

export enum TeamID {
    Spec = 0,
    Red = 1,
    Blue = 2
}

export function convertTeamID2Name(teamID: TeamID): string {
    switch(teamID) {
        case TeamID.Spec: {
            return LangRes.teamName.specTeam;
        }
        case TeamID.Red: {
            return LangRes.teamName.redTeam;
        }
        case TeamID.Blue: {
            return LangRes.teamName.blueTeam;
        }
    }
}