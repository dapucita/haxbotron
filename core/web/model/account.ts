import bcrypt from "bcrypt";
import nodeStorage from "node-persist";

/**
 * Interface for Admin account.
 */
export interface IAdminAccount {
    accountName: string;
    hashedPassword: string;
}

/**
 * Make hashed-password for accounts.
 */
export async function makeHashedPassword(given: string): Promise<string> {
    return await bcrypt.hash(given, 10);
}

/**
 * Check whether correct or not hashed-password.
 */
/*
export async function checkPassword(given: string, compare: string): Promise<boolean> {
    return await bcrypt.compare(given, compare);
}
*/

/**
 * Check is correct password for given admin account.
 */
export async function isCorrectPassword(accounts: IAdminAccount[], account: IAdminAccount): Promise<boolean> {
    if (account.hashedPassword === accounts.find(acc => acc.accountName === account.accountName)?.hashedPassword) { return true; }
    else { return false; }
}

/**
 * Check whether exist admin account.
 */
export async function isExistAdminAccount(accounts: IAdminAccount[], account: IAdminAccount): Promise<boolean> {
    if (accounts.includes(account)) { return true; }
    else { return false }
}

/**
 * Check whether need for install step.
 */
export async function isNeedInstallation(): Promise<boolean> {
    const stringified: string | undefined = await nodeStorage.getItem("admin");
    if (stringified !== undefined) {
        return false; // NOT NEED TO INSTALL
    } else {
        return true; // NEED TO INSTALL
    }
}

/**
 * Load all admin accounts data from node-persist.
 */
export async function loadAdminAccounts(): Promise<IAdminAccount[] | undefined> {
    const stringified: string | undefined = await nodeStorage.getItem("admin");
    if (stringified !== undefined) {
        const storage: IAdminAccount[] = JSON.parse(stringified);
        return storage;
    }
}

/**
 * Add and save new admin account data on node-persist.
 */
export async function saveAdminAccount(account: IAdminAccount): Promise<void> {
    const stringified: string | undefined = await nodeStorage.getItem("admin");
    let newStorage: IAdminAccount[] = [];
    if (stringified !== undefined) {
        newStorage = JSON.parse(stringified);
    }
    newStorage.push(account)
    await nodeStorage.setItem("admin", JSON.stringify(newStorage));
}

/**
 * Remove exist admin accounts data on node-persist.
 */
export async function clearAdminAccounts(): Promise<void> {
    await nodeStorage.removeItem("admin");
}
