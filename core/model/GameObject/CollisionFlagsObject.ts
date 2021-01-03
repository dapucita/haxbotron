export interface CollisionFlagsObject {
    /*
    CollisionFlagsObjects contains flag constants that are used as helpers for reading and writing collision flags.
    The flags are ball, red, blue, redKO, blueKO, wall, all, kick, score, c0, c1, c2 and c3
    https://github.com/haxball/haxball-issues/wiki/Collision-Flags

    e.g.
    >> var cf = room.CollisionFlags;
    >> // Check if disc 4 belongs to collision group "ball":
    >> var discProps = room.getDiscProperties(4);
    >> var hasBallFlag = (discProps.cGroup & cf.ball) != 0;
    >> // Add "wall" to the collision mask of disc 5 without changing any other of it's flags:
    >> var discProps = room.getDiscProperties(5);
    >> room.setDiscProperties(5, {cMask: discProps.cMask | cf.wall});
    */

    // Collision flags are what haxball's physics uses to determine which objects collide and which objects ignore each other.
    // Each flag represents a group or category.

    // This is the default collision group of the ball.
    ball: number;

    // This layer is automatically added to players of the red team.
    red: number;

    // This layer is automatically added to players of the blue team.
    blue: number;

    // This layer represents kickoff barriers that become active during kickOff for the red team.
    redKO: number;

    // This layer represents kickoff barriers that become active during kickOff for the blue team.
    blueKO: number;

    // This is the default collision group for vertexes segments and planes.
    wall: number;

    // Represents a set including ball, red, blue, redKO, blueKO and wall
    all: number;

    // Objects with this flag in their cGroup will become kickable by the players.
    kick: number;

    // Objects with this flag in their cGroup will score goals if they cross a goal line.
    score: number;

    // Has no special meaning and can be used for any purpose
    c0: number;

    // Has no special meaning and can be used for any purpose
    c1: number;

    // Has no special meaning and can be used for any purpose
    c2: number;

    // Has no special meaning and can be used for any purpose
    c3: number;
}
