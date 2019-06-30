export class Parser {
    // written in Singleton Pattern
    // If the bot created Parser object once, never create ever until the bot instance dead. 
    private static instance: Parser = new Parser();
    private Parser() { }
    public static getInstance(): Parser {
        if (this.instance == null) {
            this.instance = new Parser();
        }
        return this.instance;
    }
    public seperate(message: string, limit: number): string[] {
        return message.split(" ", limit);
    }
    /*public recognise(token: string): void {
        switch(token) {
            case "help": 


        }
    }*/
    public isCommand(message: string): boolean {
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