export class Ban {
    // written in Singleton Pattern
    // If the bot created Parser object once, never create ever until the bot instance dead. 
    private static instance: Ban = new Ban();
    private _list = new Map();

    private Ban() { } // not use
    public static getInstance(): Ban {
        if (this.instance == null) {
            this.instance = new Ban();
        }
        return this.instance;
    }

    public init(): void {
        let tmpList: string|null = localStorage.getItem('_BanList');
        if(tmpList !== null) {
            this._list = JSON.parse(tmpList);
        }
    }

    public isBan(conn: string): boolean {
        if(this._list.has(conn)) {
            return true;
        } else {
            return false;
        }
    }

    public getReason(conn: string): string {
        if(this._list.has(conn)) {
            return this._list.get(conn);
        } else {
            return '';
        }
    }

    public setBan(item: BanList): void {
        this._list.set(item.conn, item.reason);
        this.save();
    }

    public deleteBan(conn: string): void {
        if(this._list.has(conn)) {
            this._list.delete(conn);
            this.save();
        }
    }

    public clearBan(): void {
        this._list.clear();
        this.save();
    }

    private save(): void {
        localStorage.setItem('_BanList', JSON.stringify(this._list));
    }
}