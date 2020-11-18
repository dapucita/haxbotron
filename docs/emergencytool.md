# Emergency tools
You can use some tools for emergency on the devtools console in the puppeteer.

If you want to use these, you need to uncheck headless option for open the puppeteer window.

`window.onEmergency.list()`

`window.onEmergency.chat(msg: string, playerID?: number)`

`window.onEmergency.kick(playerID: number, msg?: string)`

`window.onEmergency.ban(playerID: number, msg?: string)`

`window.onEmergency.banclearall()`

`window.onEmergency.banlist()`

`window.onEmergency.password(password?: string)`