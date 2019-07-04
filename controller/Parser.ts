import { ActionTicket } from "./Action";

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
                    ticket.type = "selfnotice";
                    ticket.ownerPlayerID = playerID;
                    ticket.messageString = "help command test";
                    break;
                }
                case "super": {
                    ticket.type = "super";
                    ticket.ownerPlayerID = playerID;
                    ticket.messageString = "You are super admin now.";
                    break;
                }   
                case "debug": {
                    ticket.type = "debug";
                    ticket.ownerPlayerID = playerID;
                    ticket.messageString = "Debug information has printed in console.";
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
}

/*
USAGE EXAMPLE

let something: Parser = new Parser(); // It makes an error: constructor of 'Singleton' is private.
let instance: Parser = Parser.getInstance(); instace.blahbalh(); // now do something with the instance.

*/