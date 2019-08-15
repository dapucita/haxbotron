import { BanList } from "../model/BanList";

// header

function bListLoad(): BanList[] { // init and load
    // init
    let list: BanList[] = [];
    // load
    let storage: string | null = localStorage.getItem('_BanList');
    if (storage !== null) { // if list in storage is,
        list = JSON.parse(storage); // load it
    }
    // return it
    return list; // it can be empty array
}

function bListSave(list: BanList[]): void {
    localStorage.setItem('_BanList', JSON.stringify(list)); // save(set) on localStorage
}

// exports

function bListAdd(banItem: BanList): void { // add or update
    // init
    let list: BanList[] = [];
    let itemIndex: number;
    // load
    list = bListLoad(); // load
    itemIndex = list.findIndex((element: BanList) => { // if the player is already banned, return index. Or return -1
        return element.conn === banItem.conn;
    });
    // check and add(update)
    if(itemIndex == -1) { // if not yet banned
        list.push(banItem); // register
    } else { // if banned already
        list[itemIndex] = banItem; // update
    }
    // save
    bListSave(list); // and save it
}

function bListDelete(conn: string): boolean { // if the player is not banned yet, return false
    // init
    let list: BanList[] = [];
    let itemIndex: number;
    // load
    list = bListLoad(); // load
    itemIndex = list.findIndex((element: BanList) => { // if the player is, return index. Or return -1
        return element.conn === conn;
    });
    // check and delete
    if(itemIndex == -1) {
        return false;
    } else {
        list.splice(itemIndex, 1); // delete
        bListSave(list); // and save it
        return true;
    }
}

function bListClear(): void {
    localStorage.removeItem('_BanList'); // clear it
}

function bListCheck(conn: string): string|boolean { // if banned, returns the reason by string type
    // init
    let list: BanList[] = [];
    let itemIndex: number;
    // load
    list = bListLoad(); // load
    itemIndex = list.findIndex((element: BanList) => { // if the player is, return index. Or return -1
        return element.conn === conn;
    });    
    // return
    if(itemIndex == -1) {
        return false; // if not banned, returns false(boolean value).
    } else {
        return list[itemIndex].reason;
    }
}

function bListGetArray(): BanList[] { // get all banned players and returns by array
    // init
    let list: BanList[] = [];
    // load
    list = bListLoad();
    // return
    return list; // it can be 0 size if there are no banned players.
}

export { bListAdd, bListDelete, bListClear, bListCheck, bListGetArray };