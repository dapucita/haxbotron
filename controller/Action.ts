// DEPRECATED at v0.1.0 (legacy for under v0.0.9)


export interface ActionTicket {
    type: string;
    ownerPlayerID?: number;
    targetPlayerID?: number;
    targetTeamID?: number;
    messageString?: string;
    selfnotify?: boolean;
    action?: Function;
    makeplaceholder?: Function;
}

export class ActionQueue<T extends ActionTicket> {
    // single ton pattern 
    private static instance: ActionQueue<ActionTicket> = new ActionQueue<ActionTicket>();
    private _store: T[] = [];

    private ActionQueue<ActionTicket>() { } // not use
    public static getInstance(): ActionQueue<ActionTicket> {
        if (this.instance == null) {
            this.instance = new ActionQueue<ActionTicket>();
        }
        return this.instance;
    }
    
    push(act: T): void {
        this._store.push(act);
    }
    pop(): T | undefined {
        return this._store.shift();
    }
}

/*
USAGE EXAMPLE

let something: ActionQueue<ActionTicket> = new ActionQueue<ActionTicket>(); // It makes an error: constructor of 'Singleton' is private.
let instance: ActionQueue<ActionTicket> = ActionQueue.getInstance(); instace.blahbalh(); // now do something with the instance.

*/