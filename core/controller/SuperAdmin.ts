export async function superAdminLogin(loginKey: string): Promise<boolean> { 
    // superadmin key validation function
    const loginResult: string | undefined =  await window.readSuperadminDB(window.settings.room._RUID, loginKey);
    if(loginResult !== undefined) {
        // if login is succeed, then 'description' string value will be returned.
        return true; // return true if login is succeed.
    } else {
        return false; // or return false.
    }
}