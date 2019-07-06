export var stadiumText: string = `{
    "name": "Haxbotron Ready for next game",
    "width": 300,
    "height": 200,
    "bg": {
        "type": "grass",
        "width": 130,
        "height": 130
    },
    "vertexes": [{
        "x": 385,
        "y": -88
    }],
    "segments": [],
    "planes": [{
        "normal": [0, 1],
        "dist": -130,
        "cMask": ["ball"]
    }, {
        "normal": [0, -1],
        "dist": -130,
        "cMask": ["ball"]
    }, {
        "normal": [0, 1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [0, -1],
        "dist": -200,
        "bCoef": 0.1
    }, {
        "normal": [-1, 0],
        "dist": -130,
        "cMask": ["ball"]
    }, {
        "normal": [1, 0],
        "dist": -130,
        "cMask": ["ball"]
    }, {
        "normal": [-1, 0],
        "dist": -400,
        "bCoef": 0.1
    }, {
        "normal": [1, 0],
        "dist": -400,
        "bCoef": 0.1
    }],
    "goals": [],
    "discs": [],
    "playerPhysics": {
        "invMass": 0.3,
        "acceleration": 0.105,
        "kickingAcceleration": 0.073,
        "kickingDamping": 0.97,
        "kickStrength": 5.7
    },
    "ballPhysics": {
        "radius": 6.4,
        "color": "DEE8D1"
    },
    "spawnDistance": 130
}`;