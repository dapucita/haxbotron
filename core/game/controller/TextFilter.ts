import { AhoCorasick } from '../model/TextFilter/filter'

/**
 * Check if given string is already used in the game room (check duplicated nickname)
 * @param compare plain text to be compared
 * @returns return `true` when already in use
 */
export function isExistNickname(compare: string): boolean {
    for (let eachPlayer of window.gameRoom.playerList.values()) {
        if(eachPlayer.name.trim() === compare.trim()) {
            return true;
        }
    }
    return false;
}

/**
 * Check if given string includes banned words from nickname filter
 * @param pool banned words list
 * @param compare plain text to be compared
 * @returns return `true` when includes banned word(s)
 */
export function isIncludeBannedWords(pool: string[], compare: string): boolean {
    const ac = new AhoCorasick(pool);
    const results = ac.search(compare);

    if(Array.isArray(results) && results.length) {
        return true;
    } else {
        return false;
    }
}
