// header

function bListLoad(): Map < string, string > { // init and load
    let list: Map < string, string > = new Map(); // init
    let storage: string | null = localStorage.getItem('_BanList'); // get
    if (storage !== null) { // if list in storage is,
        list = JSON.parse(storage); // load it
    }
    return list; // return it
}

function bListSave(list: Map < string, string > ): void {
    localStorage.setItem('_BanList', JSON.stringify(list)); // set on localStorage
}

// exports

function bListAdd(item: BanList): void { // add or update
    let list: Map < string, string >; // init
    list = bListLoad(); // load
    list.set(item.conn, item.reason); // add
    bListSave(list); // and save it
}

function bListDelete(conn: string): boolean { // if the player is not banned yet, return false
    let list: Map < string, string >; // init
    list = bListLoad(); // load
    if(list.has(conn) == true) { // if the player is banned
        list.delete(conn); // delete
        bListSave(list); // and save it
        return true;
    } else {
        return false;
    }
}

function bListClear(): void {
    localStorage.removeItem('_BanList'); // clear it
}

function bListCheck(conn: string): string|undefined {
    // init
    let list: Map < string, string >;
    let reason: string|undefined;
    // load
    list = bListLoad();
    reason = list.get(conn);
    // return
    return reason; // if not banned, returns undefined.
}

export { bListAdd, bListDelete, bListClear, bListCheck };