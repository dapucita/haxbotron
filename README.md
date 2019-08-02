# Haxbotron 🤖

## What is this
Haxbotron is a bot application for launch Haxball game room.

You can power your own host by electron-based launcher.

This Project is open source and free to use. Enjoy it :)

## Versions
### Released Version
Not yet :)

### Schduled Version
0.1.0 for first release

## Features
launch on Multi platforms: Windows, Linux, OS X and so on

Detailed player data

Useful facilities for actual game

Built-in maps: especially popular in Korea


## How to Build
You need to install dependencies if you didn't.

You don't have to build again if you did it already.

```
npm install
npm run build
npm start
```

## How to Use
You need to prepare `headless token key`. You can get it from [here](https://www.haxball.com/headlesstoken).

If you got the token, you have to launch the application and input your room's configuration values.

Then, you can launch your own game room.

## How to backup
If you want to backup players' data on your own bot, you should copy `.node-persist` directory and paste it when you need.

All data are reserved in that directory and you can also modify them using text editor.

## Player Hierarchy

All players who joined the game have their own player level.

There are 2 steps for common players, and 1 step for especial users who have authorization.

`Player` is basic level, `Admin` is administrative level who is able to operating the game, and `Super Admin` is super level who has permissions for operating the bot application wholly.

Admin players have yellow colored name tag in the spectator window, but Super Admin players don't have that yellow name tag.

Super admin players can ban other players, and use special `!super` commands.

## Game Commands for Players
If you(the player) type a command by chat...

`!help` shows you a simple list of commands you can use.

`!help COMMAND` shows you how to use COMMAND command.

`!help admin` shows you available commands when you are admin.

`!about` shows you simple inforamtion of the bot running now.

`!list TEAM` shows you that team's player list. (string red/blue/spec)

`!stats` shows all players your statistical information.

`!statsreset` resets your statistical information. It cannot be recovered.

`!streak` shows you which team is being on a winning streak.

`!poss` shows you possessions rate of both Read and Blue team.

`!afk MSG` switches to idle status, or return to active status if already in afk mode. MSG is the reason, and it can be skipped.

## Game Commands for Admin Players
`!freeze` prohibits all players without admin to chat. Or unmute if the players are already muted.

`!mute ID` prohibits the player whose id is ID to chat. Or unmute if the player is already muted. 

## Game Commands for Super Admin Players

If you(the super admin) type a command by chat...

`!super login KEY` makes you super admin. KEY is authentication key for login, and the keys can be made in the Electron-based UI.

`!super logout` disqualifies your super admin permission when you are loginned.

`!super thor` makes admin player permission by self.

`!super thor deprive` disqualify all admin players from admin permission, and makes admin player permission by self.

`!super kick ID` kicks that player whose numeric ID is ID.

## Emergency tools
You can use some tools for emergency on the devtools console in the puppeteer.

If you want to use these, you need to uncheck headless option for open the puppeteer window.

`window.onEmergency.list()`

`window.onEmergency.chat(msg: string, playerID?: number)`

`window.onEmergency.kick(playerID: number, msg?: string)`

`window.onEmergency.banclear()`

## Contacts
[Github](https://github.com/dapucita/haxbotron)

[Discord](https://discord.gg/qfg45B2)

## Special thanks to
`G.Buffon` made great custom maps and they are very popular in Korea.

## Copyrights
MIT License.

Some maps by `G.Buffon`.