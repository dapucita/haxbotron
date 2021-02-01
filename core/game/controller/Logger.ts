export class Logger {
    // written in Singleton Pattern
    // If the bot created Logger object once, never create ever until the bot instance dead. 
    private static instance: Logger;

    private Logger() { } // not use
    
    public static getInstance(): Logger {
        if (this.instance == null) {
            this.instance = new Logger();
        }
        return this.instance;
    }

    public i(origin: string, msg: string): void { // for common info log
        console.info(msg);
        window._emitSIOLogEvent(origin, 'info', msg);
    }

    public e(origin: string, msg: string): void { // for error log
        console.error(msg);
        window._emitSIOLogEvent(origin, 'error', msg);
    }

    public w(origin: string, msg: string): void { // for warning log
        console.warn(msg);
        window._emitSIOLogEvent(origin, 'warn', msg);
    }
}