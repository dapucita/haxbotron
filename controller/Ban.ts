import { BanList } from "../model/PlayerBan/BanList";
import { clearStorageItem, saveStorageItem } from "./Storage";

// header ------------------------------------------------------------------------
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
    saveStorageItem('_BanList', JSON.stringify(list));
}
// ------------------------------------------------------------------------ header

// exports ------------------------------------------------------------------------
// export
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

// export
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

// export
function bListClear(): void {
    clearStorageItem('_BanList'); // clear it
}

// export
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

function bListCheckRegisterTime(conn: string): number {
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
        return 0; // if not banned, returns 0.
    } else {
        return list[itemIndex].register;
    }
}
function bListCheckExpireTime(conn: string): number {
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
        return 0; // if not banned, returns 0.
    } else {
        return list[itemIndex].expire;
    }
}

// export
function bListGetArray(): BanList[] { // get all banned players and returns by array
    // init
    let list: BanList[] = [];
    // load
    list = bListLoad();
    // return
    return list; // it can be 0 size if there are no banned players.
}
// ------------------------------------------------------------------------ exports


export { bListAdd, bListDelete, bListClear, bListCheck, bListGetArray, bListCheckRegisterTime, bListCheckExpireTime };