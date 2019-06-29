export class Logger {
    // written in Singleton Pattern
    // If the bot created Logger object once, never create ever until the bot instance dead. 
    private static instance: Logger = new Logger();

    private Parser() { }

    public static getInstance(): Logger {
        if (this.instance == null) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public w(key: string, msg: string): void {
        //log warning messages
        
    }

    public n(key: string, msg: string): void {
        //log normal messages
        
    }

    public f(key: string, msg: string): void {
        //log fatal error messages
        
    }

    public e(key: string, msg: string): void {
        //log error messages
        
    }
}

interface LogMessage {
    category: string;
    key: string;
    msg: string;
    date: string;
}

/*
USAGE EXAMPLE

let something: Logger = new Logger(); // It makes an error: constructor of 'Singleton' is private.
let instance: Logger = Parser.getInstance(); instace.blahbalh(); // now do something with the instance.

*/