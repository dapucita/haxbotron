export interface DiscPropertiesObject {
    //DiscPropertiesObject holds information about a game physics disc.
    
    x: number;
    //The x coordinate of the disc's position

    y: number;
    //The y coordinate of the disc's position

    xspeed: number;
    //The x coordinate of the disc's speed vector

    yspeed: number;
    //The y coordinate of the disc's speed vector

    xgravity: number;
    //The x coordinate of the disc's gravity vector

    ygravity: number;
    //The y coordinate of the disc's gravity vector

    radius: number;
    //The disc's radius

    bCoeff: number;
    //The disc's bouncing coefficient

    invMass: number;
    //The inverse of the disc's mass

    damping: number;
    //The disc's damping factor.

    color: number;
    //The disc's color expressed as an integer (0xFF0000 is red, 0x00FF00 is green, 0x0000FF is blue, -1 is transparent)

    cMask: number;
    //The disc's collision mask (Represents what groups the disc can collide with)

    cGroup: number;
    //The disc's collision groups
}