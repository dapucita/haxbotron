export function superAdminLogin(loginKey: string): boolean { // return true if login succeed.
    let keydata: string | null = localStorage.getItem('_SuperAdminKeys');
    if(keydata !== null) {
        let keys: string[] = keydata.split(/\n|\r\n|\r/);
        if(keys.find((key) => key == loginKey) !== undefined) {
            return true; // if matched
        } else {
            return false;
        }
    } else {
        return false;
    }
}