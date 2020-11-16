export function maketext(str: string, placeholder: any): string {
    // find placeholer, and interpolate it.
    // if property not found string is not replaced
    // from https://stackoverflow.com/questions/19896511/how-to-replace-specific-parts-in-string-with-javascript-with-values-from-object
    return String(str).replace((/\\?\{([^{}]+)\}/g), function(match, name) {
        return (placeholder[name] != null) ? placeholder[name] : match;
    });
    /* usage
    var content ="Looks like you have {no_email} or {no_code} provided";
    var Lang = {
        'no_email' : "No email",
        'no_code' : "No code"
    }
    var formatted = replace(content, lang);
    */
}