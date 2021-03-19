import { CollisionFlagsObject } from "../GameObject/CollisionFlagsObject";
import { DiscPropertiesObject } from "../GameObject/DiscPropertiesObject";
import { PlayerObject, PlayerPosition } from "../GameObject/PlayerObject";
import { ScoresObject } from "../GameObject/ScoresObject";
import { TeamID } from "../GameObject/TeamID";

export interface Room {
    /*
    IMPLEMENTATION OF HAXBALL HEADLESS HOST SPECIFICATION
    https://github.com/haxball/haxball-issues/wiki/Headless-Host
    RoomObject is the main interface which lets you control the room and listen to it's events
    */

    /*
    Sends a chat message using the host player
    If targetId is null or undefined the message is sent to all players.
    If targetId is defined the message is sent only to the player with a matching id.
    */
    sendChat(message: string, targetId?: number): void;

    /*
    Changes the admin status of the specified player
    */
    setPlayerAdmin(playerId: number, admin: boolean): void;

    /*
    Moves the specified player to a team
    */
    setPlayerTeam(playerId: number, team: number): void;

    /*
    Kicks the specified player from the room
    */
    kickPlayer(playerId: number, reason: string, ban: boolean): void;

    /*
    Clears the ban for a playerId that belonged to a player that was previously banned.
    */
    clearBan(playerId: number): void;

    /*
    Clears the list of banned players.
    */
    clearBans(): void;

    /*
    Sets the score limit of the room
    If a game is in progress this method does nothing.
    */
    setScoreLimit(limit: number): void;

    /*
    Sets the time limit of the room. The limit must be specified in number of minutes.
    If a game is in progress this method does nothing.
    */
    setTimeLimit(limitInMinutes: number): void;

    /*
    Parses the stadiumFileContents as a .hbs stadium file and sets it as the selected stadium.
    There must not be a game in progress, If a game is in progress this method does nothing
    e.g. https://github.com/haxball/haxball-issues/blob/master/headless/examples/setCustomStadium.js
    */
    setCustomStadium(stadiumFileContents: string): void;

    /*
    Sets the selected stadium to one of the default stadiums. The name must match exactly (case sensitive)
    There must not be a game in progress, If a game is in progress this method does nothing
    */
    setDefaultStadium(stadiumName: string): void;

    /*
    Sets the teams lock.
    When teams are locked players are not able to change team unless they are moved by an admin.
    */
    setTeamsLock(locked: boolean): void;

    /*
    Sets the colors of a team.
    Colors are represented as an integer, for example a pure red color is 0xFF0000.
    */
    setTeamColors(team: number, angle: number, textColor: number, colors: number[]): void;

    /*
    Starts the game, if a game is already in progress this method does nothing
    */
    startGame(): void;

    /*
    Stops the game, if no game is in progress this method does nothing
    */
    stopGame(): void;

    /*
    Sets the pause state of the game. true = paused and false = unpaused
    */
    pauseGame(pauseState: boolean): void;

    /*
    Returns the player with the specified id. Returns null if the player doesn't exist.
    */
    getPlayer(playerId: number): PlayerObject;

    /*
    Returns the current list of players
    */
    getPlayerList(): PlayerObject[];

    /*
    If a game is in progress it returns the current score information. Otherwise it returns null
    */
    getScores(): ScoresObject | null;

    /*
    Returns the ball's position in the field or null if no game is in progress.
    */
    getBallPosition(): PlayerPosition;

    /*
    Starts recording of a haxball replay.
    Don't forget to call stop recording or it will cause a memory leak.
    */
    startRecording(): void;

    /*
    Stops the recording previously started with startRecording and returns the replay file contents as a Uint8Array.
    Returns null if recording was not started or had already been stopped.
    */
    stopRecording(): Uint8Array | null;

    /*
    Changes the password of the room, if pass is null the password will be cleared.
    */
    setPassword(password: string | null): void;

    /*
    Activates or deactivates the recaptcha requirement to join the room.
    */
    setRequireRecaptcha(required: boolean): void;

    /*
    First all players listed are removed, then they are reinserted in the same order they appear in the playerIdList.
    If moveToTop is true players are inserted at the top of the list, otherwise they are inserted at the bottom of the list.
    */
    reorderPlayers(playerIdList: number[], moveToTop: boolean): void;

    /*
    Sends a host announcement with msg as contents.
    Unlike sendChat, announcements will work without a host player and has a larger limit on the number of characters.
    If targetId is null or undefined the message is sent to all players, otherwise it's sent only to the player with matching targetId.
    color will set the color of the announcement text, it's encoded as an integer (0xFF0000 is red, 0x00FF00 is green, 0x0000FF is blue).
    If color is null or undefined the text will use the default chat color.
    style will set the style of the announcement text, it must be one of the following strings: "normal","bold","italic", "small", "small-bold", "small-italic"
    If style is null or undefined "normal" style will be used.
    If sound is set to 0 the announcement will produce no sound.
    If sound is set to 1 the announcement will produce a normal chat sound. If set to 2 it will produce a notification sound.
    */
    sendAnnouncement(msg: string, targetId: number | null, color: number | null, style: string | null, sound: number | null): void;

    /*
    Sets the room's kick rate limits.
    min is the minimum number of logic-frames between two kicks. It is impossible to kick faster than this.
    rate works like min but lets players save up extra kicks to use them later depending on the value of burst.
    burst determines how many extra kicks the player is able to save up.
    */
    setKickRateLimit(min: number, rate: number, burst: number): void;

    /*
    Overrides the avatar of the target player.
    If avatar is set to null the override is cleared and the player will be able to use his own avatar again.
    */
    setPlayerAvatar(playerId: number, avatar: string): void;

    /*
    Sets properties of the target disc.
    Properties that are null or undefined will not be set and therefor will preserve whatever value the disc already had.
    For example room.setDiscProperties(0, {x: 0, y: 0}); will set the position of disc 0 to <0,0> while leaving any other value intact.
    */
    setDiscProperties(discIndex: number, properties: DiscPropertiesObject): void;

    /*
    Gets the properties of the disc at discIndex. Returns null if discIndex is out of bounds.
    */
    getDiscProperties(discIndex: number): DiscPropertiesObject;

    /*
    Same as setDiscProperties but targets the disc belonging to a player with the given Id.
    */
    setPlayerDiscProperties(playerId: number, properties: DiscPropertiesObject): void;

    /*
    Same as getDiscProperties but targets the disc belonging to a player with the given Id.
    */
    getPlayerDiscProperties(playerId: number): DiscPropertiesObject;

    /*
    Gets the number of discs in the game including the ball and player discs.
    */
    getDiscCount(): number;

    /*
    Object filled with the collision flags constants that compose the cMask and cGroup disc properties.
    Read more about collision flags: https://github.com/haxball/haxball-issues/wiki/Collision-Flags
    e.g.
    >> // Check if disc 4 belongs to collision group "ball":
    >> var discProps = room.getDiscProperties(4);
    >> var hasBallFlag = (discProps.cGroup & room.CollisionFlags.ball) != 0;
    >> // Add "wall" to the collision mask of disc 5 without changing any other of it's flags:
    >> var discProps = room.getDiscProperties(5);
    >> room.setDiscProperties(5, {cMask: discProps.cMask | room.CollisionFlags.wall});
    */
    readonly CollisionFlags: CollisionFlagsObject;

    /*
    Event called when a new player joins the room.
    */
    onPlayerJoin: (player: PlayerObject) => void;

    /*
    Event called when a player leaves the room.
    */
    onPlayerLeave: (player: PlayerObject) => void;

    /*
    Event called when a team wins.
    */
    onTeamVictory: (scores: ScoresObject) => void;

    /*
    Event called when a player sends a chat message.
    The event function can return false in order to filter the chat message.
    This prevents the chat message from reaching other players in the room.
    */
    onPlayerChat: (player: PlayerObject, message: string) => boolean;

    /*
    Event called when a player kicks the ball.
    */
    onPlayerBallKick: (player: PlayerObject) => void;

    /*
    Event called when a team scores a goal.
    */
    onTeamGoal: (team: TeamID) => void;

    /*
    Event called when a game starts.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    */
    onGameStart: (byPlayer: PlayerObject) => void;

    /*
    Event called when a game stops.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    */
    onGameStop: (byPlayer: PlayerObject) => void;

    /*
    Event called when a player's admin rights are changed.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    */
    onPlayerAdminChange: (changedPlayer: PlayerObject, byPlayer: PlayerObject) => void;

    /*
    Event called when a player team is changed.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    */
    onPlayerTeamChange: (changedPlayer: PlayerObject, byPlayer: PlayerObject) => void;

    /*
    Event called when a player has been kicked from the room. This is always called after the onPlayerLeave event.
    byPlayer is the player which caused the event (can be null if the event wasn't caused by a player).
    */
    onPlayerKicked: (kickedPlayer: PlayerObject, reason: string, ban: boolean, byPlayer: PlayerObject) => void;

    /*
    Event called once for every game tick (happens 60 times per second). This is useful if you want to monitor the player and ball positions without missing any ticks.
    This event is not called if the game is paused or stopped.
    */
    onGameTick: () => void;

    /*
    Event called when the game is paused.
    */
    onGamePause: (byPlayer: PlayerObject) => void;

    /*
    Event called when the game is unpaused.
    After this event there's a timer before the game is fully unpaused,
    to detect when the game has really resumed you can listen for the first onGameTick event after this event is called.
    */
    onGameUnpause: (byPlayer: PlayerObject) => void;

    /*
    Event called when the players and ball positions are reset after a goal happens.
    */
    onPositionsReset: () => void;

    /*
    Event called when a player gives signs of activity, such as pressing a key.
    This is useful for detecting inactive players.
    */
    onPlayerActivity: (player: PlayerObject) => void;

    /*
    Event called when the stadium is changed.
    */
    onStadiumChange: (newStadiumName: string, byPlayer: PlayerObject) => void;

    /*
    Event called when the room link is obtained.
    */
    onRoomLink: (url: string) => void;

    /*
    Event called when the kick rate is set.
    */
    onKickRateLimitSet: (min: number, rate: number, burst: number, byPlayer: PlayerObject) => void;
}
