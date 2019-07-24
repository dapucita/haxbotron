// TODO: 1. conn을 키로 하는 밴(영구퇴장) 시스템 구현(접속시 kick:ban true로 밴시킴) + 2. banclear 명령어 사용시 밴 시스템에서 삭제처리
interface BanList {
    conn: string;
    reason: string;
}