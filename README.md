# Haxbotron 🤖

## What is this
Haxbotron is a bot application for launch Haxball game room.

This Project is open source and free for use.

Enjoy it :)

## Versions
### Released Version
Not yet :)

### Schduled Version
0.1.0 for first release

## Features
launch on Multi platforms: Windows, Linux, OS X and so on

Useful facilities for actual game

Built-in maps: especially popular in Korea


## How to Build
You don't have to build again if you did it already.

```
npm run build
npm start
```

## How to Use
You need to prepare headless token key. You can get it from [here](https://www.haxball.com/headlesstoken).

If you got the token, you have to launch the application and input your room's configuration values.

Then, you can launch your own game room.

## Player Hierarchy

All players who joined the game have their own player level.

There are 2 steps for common players, and 1 step for especial users who have authorization.

`Player` is basic level, `Admin` is administrative level who is able to operating the game, and `Super Admin` is super level who has permissions for operating the bot application wholly.

Admin players have yellow colored name tag in the spectator room, but Super Admin players don't have that yellow name tag.

## Game Commands for Players
If you(the player) type a command by chat...

`!help` shows you a simple list of commands you can use.

`!help COMMAND` shows you how to use COMMAND command.

`!about` shows you simple inforamtion of the bot running now.

`!stats` shows all players your statistical information.

`!statsreset` resets your statistical information. It cannot be recovered.

`!streak` shows you which team is being on a winning streak.

`!poss` shows you possessions rate of both Read and Blue team.

`!level` shows you your hierarchy level.

`!afk MSG` switchses to idle status. If it contains MSG, the message as reason for away from keyboards is shown when others call the player.

`!unafk` switches to active status.

`!list TEAM` shows you list of specific team player's numeric ID. TEAM should be red/blue/spec.

## Game Commands for Admin Players
`!mute` prohibits all other players to chat.

`!mute PLAYER` prohibits the player whose name is PLAYER to chat.

`!unmute` clears all of muted players list.

`!unmute PLAYER` permits the player whose name is PLAYER to chat.

`!kick PLAYER MSG` kicks the player whose name is PLAYER. If it contains MSG, the message as reason for kicking is shown for the user.

## Game Commands for Super Admin Players

If you(the super admin) type a command by chat...

`!super thor` disqualify all admin players from admin permission, and makes admin player permission by self.

`!ban PLAYER MSG` bans PLAYER forever. If it contains MSG, the message as reason for banning is shown for the user.

`!unban PLAYER` unbans PLAYER.

`!unban!all` unbans all players who banned.

`!debug!brake` pauses the game, stops operating the bot, and just waiting until restart. The system only can be restared by reloading the application manually.

`!debug!log MSG` write a message contains MSG into logging system.

## Contacts
https://github.com/dapucita/haxbotron

## Copyrights
MIT License.