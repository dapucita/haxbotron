import { ActionTicket } from "./Action";
import { command as langCommand } from "../resources/strings";

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
                            default: {
                                ticket.messageString = langCommand.helpman._ErrorWrongMan;
                            }
                        }
                    } else {
                        ticket.messageString = langCommand.help;
                    }
                    ticket.type = "selfnotice";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    break;
                }
                case "about": {
                    ticket.type = "selfnotice";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.about;
                    break;
                }
                case "super": { // temporal command in development stage. remove this command when you operate the bot with other players
                    ticket.type = "super";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.super;
                    break;
                }   
                case "debug": { // temporal command in development stage. remove this command when you operate the bot with other players
                    ticket.type = "debug";
                    ticket.ownerPlayerID = playerID;
                    ticket.targetPlayerID = playerID;
                    ticket.messageString = langCommand.debug;
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