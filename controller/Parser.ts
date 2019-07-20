import { ActionTicket } from "./Action";
import { command as langCommand } from "../resources/strings";
import { setPlayerData } from "./Storage";

export class Parser {
    // written in Singleton Pattern
    // If the bot created Parser object once, never create ever until the bot instance dead. 
    private static instance: Parser = new Parser();

    private Parser() { } // not use
    public static getInstance(): Parser {
        if (this.instance == null) {
            this.instance = new Parser();
        }
        return this.instance;
    }
    

    public eval(message: string, playerID: number): ActionTicket {
        // evaluate given string
        // if given string is command chat, this function returns true, nor false.
        var ticket: ActionTicket = { type: "none", ownerPlayerID: playerID, messageString: message };
        if(this.isCommandString(message) == true) {
            // if given string is command chat
            let cutMsg: string[] = message.split(" ", 3); // divide into 3 parts by sperator. !COMMAND FIRST-ARG SECOND-ARG
            let cmd: string = cutMsg[0].substr(1, cutMsg[0].length); // remove first character of COMMAND part(it maybe '!')

            switch(cmd) {
                case "help": {
                    if(cutMsg[1] !== undefined) {
                        switch(cutMsg[1]) {
                            case "help": {
                                ticket.messageString = langCommand.helpman.help;
                                break;
                            }
                            case "about": {
                                ticket.messageString = langCommand.helpman.about;
                                break;
                            }
                            case "stats": {
                                ticket.messageString = langCommand.helpman.stats;
                                break;
                            }
                            case "statsreset": {
                                ticket.messageString = langCommand.helpman.statsreset;
                                break;
                            }
                            case "poss": {
                                ticket.messageString = langCommand.helpman.poss;
                                break;
                            }
                            default: {
                                ticket.messageString = langCommand.helpman._ErrorWrongMan;
                            }
                        }
                    } else {
                        ticket.messageString = langCommand.help;
                    }
                    ticket.type = "info";
                    ticket.targetPlayerID = playerID;
                    ticket.selfnotify = true;
                    break;
                }
                case "about": {
                    ticket.type = "info";
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.about;
                    ticket.selfnotify = true;
                    break;
                }
                case "poss": {
                    ticket.type = "stats";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.stats;
                    ticket.selfnotify = true;
                    break;
                }
                case "streak": {
                    ticket.type = "stats";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.streak;
                    ticket.selfnotify = true;
                    break;
                }
                case "stats": {
                    ticket.type = "stats";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.stats;
                    ticket.selfnotify = false;
                    break;
                }
                case "statsreset": {
                    ticket.type = "stats";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.statsreset;
                    ticket.selfnotify = true;
                    ticket.action = function(playerID: number, playerList: any): void {
                        playerList.get(playerID).stats.totals = 0;
                        playerList.get(playerID).stats.wins = 0;
                        playerList.get(playerID).stats.goals = 0;
                        playerList.get(playerID).stats.assists = 0;
                        playerList.get(playerID).stats.ogs = 0;
                        playerList.get(playerID).stats.losePoints = 0;
                        setPlayerData(playerList.get(playerID));
                    }
                    break;
                }
                case "super": { // temporal command in development stage. remove this command when you operate the bot with other players
                    ticket.type = "super";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.super;
                    ticket.selfnotify = true;
                    break;
                }   
                case "debug": { // temporal command in development stage. remove this command when you operate the bot with other players
                    ticket.type = "debug";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.debug;
                    ticket.selfnotify = true;
                    break;
                }
            }
        }
        return ticket;
    }

    private isCommandString(message: string): boolean {
        if(message.charAt(0) == "!") {
            // If message has '!' as first character in it's string, return true.
            return true;
        } else {
            return false;
        }
    }

    public maketext(str: string, placeholder: any): string {
        // find placeholer, and interpolate it.
        // if property not found string is not replaced
        // from https://stackoverflow.com/questions/19896511/how-to-replace-specific-parts-in-string-with-javascript-with-values-from-object
        return String(str).replace((/\\?\{([^{}]+)\}/g), function(match, name) {
            return (placeholder[name] != null) ? placeholder[name] : match;
        });
        /* usage
        var content ="Looks like you have {no_email} or {no_code} provided";
        var Lang = {
            'no_email' : "No email",
            'no_code' : "No code"
        }
        var formatted = replace(content, lang);
        */
    }
}

/*
USAGE EXAMPLE

let something: Parser = new Parser(); // It makes an error: constructor of 'Singleton' is private.
let instance: Parser = Parser.getInstance(); instace.blahbalh(); // now do something with the instance.

*/