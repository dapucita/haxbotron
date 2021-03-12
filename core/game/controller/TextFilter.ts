export function isExistNickname(compare: string): boolean {
    for (let eachPlayer of window.gameRoom.playerList.values()) {
        if(eachPlayer.name.trim() === compare.trim()) {
            return true;
        }
    }
    return false;
}
