# Haxbotron

## What is this
Haxbotron is a bot application for launch Haxball game room.

This Project is open source and free for use.

Enjoy it :)

## Versions
### Released Version
Not yet :)

### Schduled Version
0.1.0 for first release

0.2.0 with new features like GUI, advanced game control

## Features
launch on Multi platforms: Windows, Linux, OS X and so on

Useful facilities for actual game

Built-in maps: especially popular in Korea


## How to Build
```
tsc index.ts bot.ts typings\global.d.ts
webpack
node index.js
```

## How to Use
Just launch and solve recaptcha.

It will change later.

## Player Hierarchy

All players who joined the game have their own player level.

There are 2 steps for common players, and 1 step for especial users who have authorization.

`Player` is basic level, `Admin` is administrative level who is able to operating the game, and `Super Admin` is super level who has permissions for operating the bot application wholly.

Admin players have yellow colored name tag in the spectator room, but Super Admin players don't have that yellow name tag.

## Game Commands for Players
If you(the player) type a command by chat...

`!help` shows you simple information about this bot.

`!help!usage COMMAND` shows you how to use COMMAND command.

`!stats` shows all players your stats.

`!stats!reset` resets your stats. It cannot be recovered.

`!streak` shows you which team is being on a winning streak.

`!poss` shows you possessions rate of both Read and Blue team.

`!level` shows you your hierarchy level.

`!afk MSG` switchses to idle status. If it contains MSG, the message as reason for away from keyboards is shown when others call the player.

`!unafk` switches to active status.

## Game Commands for Admin Players
`!mute` prohibits other all players to chat.

`!mute PLAYER` prohibits the player whose name is PLAYER to chat.

`!unmute PLAYER` permits the player whose name is PLAYER to chat.

`!unmute!all` clears all of muted players list.

`!kick PLAYER MSG` kicks the player whose name is PLAYER. If it contains MSG, the message as reason for kicking is shown for the user.

`!kick!last` kicks the player who joined most recently.

`!kick!og` kicks the player who made O.G. most recently.

`!kick!afk` kicks all players who are away from keyboards.

## Game Commands for Super Admin Players

If you(the super admin) type a command by chat...

`!super!thor` disqualify all admin players from admin permission, and makes admin player permission by self.

`!ban PLAYER MSG` bans PLAYER forever. If it contains MSG, the message as reason for banning is shown for the user.

`!unban PLAYER` unbans PLAYER.

`!unban!all` unbans all players who banned.

`!debug!brake` pauses the game, stops operating the bot, and just waiting until restart. The system only can be restared by reloading the application manually.

`!debug!log MSG` write a message contains MSG into loggin system.

## Contacts
https://github.com/dapucita/haxbotron

## Copyrights
MIT License.