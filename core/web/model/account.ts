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
export async function checkPassword(givenData: string, encryptedCompare: string): Promise<boolean> {
    return await bcrypt.compare(givenData, encryptedCompare);
}

/**
 * Check is correct password for given admin account.
 */
export async function isCorrectPassword(accounts: IAdminAccount[], account: IAdminAccount): Promise<boolean> {
    for(const acc of accounts) {
        if(acc.accountName === account.accountName && await checkPassword(account.hashedPassword, acc.hashedPassword) === true) return true;
    }
    return false;
}

/**
 * Check whether exist admin account.
 */
export function isExistAdminAccount(accounts: IAdminAccount[], account: IAdminAccount): boolean {
    for(const acc of accounts) {
        if(acc.accountName === account.accountName) return true;
    }
    return false;
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
