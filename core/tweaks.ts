// SOME TWEAKS FOR SUPPORT BOT PROBLEMS ON YOUR ENVIRONMENT

// tweaks_WebRTCAnoym : Local IP WebRTC Anonymization for the bot
// if you are suffering connection problem with vps server, disable this option
export const tweaks_WebRTCAnoym: boolean = true; //true: enable, false: disable

// tweaks_geoLocationOverride : GeoLocation overriding for the room
// if your bot has wrong location, enable this patch option
export const tweaks_geoLocationOverride = {
    patch: false // true: enable, false: disable
    // GeoLocation Setting for Seoul
    ,code: "KR"
    ,lat: 37.5665
    ,lon: 126.978
}