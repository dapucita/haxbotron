import { LogMessage } from "../model/LogMessage";

export class Logger {
    // written in Singleton Pattern
    // If the bot created Logger object once, never create ever until the bot instance dead. 
    private static instance: Logger = new Logger();

    private Logger() { } // not use
    
    public static getInstance(): Logger {
        if (this.instance == null) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    private push(messageObject: LogMessage): void {
        window.logQueue.push(messageObject)
        
    }
    private pop(): LogMessage | undefined {
        return window.logQueue.pop();
    }

    public i(msg: string): void { // for common info log
        this.push({type: 2, context: msg});
    }

    public e(msg: string): void { // for error log
        this.push({type: 0, context: msg});
    }

    public w(msg: string): void { // for warning log
        this.push({type: 1, context: msg});
    }
    
}

/*
USAGE EXAMPLE

let something: Logger = new Logger(); // It makes an error: constructor of 'Singleton' is private.
let instance: Logger = Logger.getInstance(); instace.blahbalh(); // now do something with the instance.
*/