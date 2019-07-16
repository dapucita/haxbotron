export class Logger {
    // written in Singleton Pattern
    // If the bot created Logger object once, never create ever until the bot instance dead. 
    private static instance: Logger = new Logger();

    private Parser() { } // not use
    
    public static getInstance(): Logger {
        if (this.instance == null) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    private push(msg: string): void {
        window.logQueue.push(msg);
    }
    private pop(): string | undefined {
        return window.logQueue.pop();
    }

    public c(msg: string): void { // for common log
        this.push(msg);
    }

    // TODO: implement methods using message type interface
    // not yet implemented
    /*
    public w(key: string, msg: string): void { // for warning log
        //log warning messages
        
    }

    public n(key: string, msg: string): void { // for normal log
        //log normal messages
        
    }

    public f(key: string, msg: string): void { // for fatal log
        //log fatal error messages
        
    }

    public e(key: string, msg: string): void { // for error log
        //log error messages
        
    }
    */
}

/*
export interface LogMessage {
    category: string;
    key: string;
    msg: string;
    date: string;
}
*/

/*
USAGE EXAMPLE

let something: Logger = new Logger(); // It makes an error: constructor of 'Singleton' is private.
let instance: Logger = Logger.getInstance(); instace.blahbalh(); // now do something with the instance.
*/