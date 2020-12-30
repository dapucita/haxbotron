export interface BanList {
    conn: string;
    reason: string;
    register: number; // registration date
    expire: number; // expiration date. -1 means Permanent ban..
}