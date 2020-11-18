# Commands available in Game
## Game Commands for Players
If you(the player) type a command by chat...

`!help` shows you a simple list of commands you can use.

`!help COMMAND` shows you how to use COMMAND command.

`!help admin` shows you available commands when you are admin.

`!about` shows you simple inforamtion of the bot running now.

`!list TEAM` shows you that team's player list. (string red/blue/spec)

`!stats` shows all players your statistical information.

`!stats #ID` shows you statistical information of the player whose id is ID.

`!statsreset` resets your statistical information. It cannot be recovered.

`!streak` shows you which team is being on a winning streak.

`!poss` shows you possessions rate of both Read and Blue team.

`!afk MSG` switches to idle status, or return to active status if already in afk mode. MSG is the reason, and it can be skipped.

## Game Commands for Captain Players
`!auto` picks players from spectators by descending order when you are captain.

`!rand` picks players from spectators by random when you are captain.

## Game Commands for Admin Players
`!freeze` prohibits all players without admin to chat. Or unmute if the players are already muted.

`!mute #ID` prohibits the player whose id is ID to chat. Or unmute if the player is already muted. 

## Game Commands for Super Admin Players

If you(the super admin) type a command by chat...

`!super login KEY` makes you super admin. KEY is authentication key for login, and the keys can be made in the Electron-based UI.

`!super logout` disqualifies your super admin permission when you are loginned.

`!super thor` makes admin player permission by self.

`!super thor deprive` disqualify all admin players from admin permission, and makes admin player permission by self.

`!super kick ID` kicks that player whose numeric ID is ID.

`!super ban ID` bans that player whose numeric ID is ID.

`!super banclear all` clears the list of banned players.