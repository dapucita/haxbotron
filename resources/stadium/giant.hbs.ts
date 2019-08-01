export var stadiumText: string=` {
    "name":"Haxbotron Giant",
    "canBeStored": false,
    "width":920,
    "height":550,
    "spawnDistance":350,
    "bg": {
        "type": "grass", "width":800, "height":480, "kickOffRadius":80, "cornerRadius":0
    }

    ,
    "vertexes":[ {
        "x": -800, "y":480, "trait":"ballArea"
    }

    ,
        {
        "x": -800, "y":-480, "trait":"ballArea"
    }

    ,
        {
        "x": 800, "y":480, "trait":"ballArea"
    }

    ,
        {
        "x": 800, "y":-480, "trait":"ballArea"
    }

    ,
        {
        "x": 0, "y":550, "trait":"kickOffBarrier"
    }

    ,
        {
        "x": 0, "y":80, "trait":"kickOffBarrier"
    }

    ,
        {
        "x": 0, "y":-80, "trait":"kickOffBarrier"
    }

    ,
        {
        "x": 0, "y":-550, "trait":"kickOffBarrier"
    }

    ,
        {
        "bCoef": 1, "trait":"ballArea", "x":-800, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-800, "y":-130
    }

    ,
        {
        "bCoef": 1, "trait":"ballArea", "x":800, "y":130
    }

    ,
        {
        "bCoef": 1, "x":800, "y":-130, "trait":"ballArea"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"goalNet", "x":-800, "y":130, "curve":10, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"goalNet", "x":-845, "y":115, "curve":-20, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"goalNet", "x":-800, "y":-130, "curve":-10, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"goalNet", "x":-845, "y":-115, "curve":-20, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "x":845, "y":115, "curve":10, "trait":"goalNet"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "x":800, "y":130, "curve":10, "trait":"goalNet"
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "x":800, "y":-130, "trait":"goalNet", "curve":10
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "x":845, "y":-115, "trait":"goalNet", "curve":10
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-625, "y":-175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-625, "y":175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-450, "y":-255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-450, "y":255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-450, "y":-100, "curve":150
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-450, "y":100, "curve":150
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":175, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":625, "y":175, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":625, "y":-175
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":450, "y":-255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":450, "y":255
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":450, "y":-100, "curve":-150
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":450, "y":100, "curve":-150
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-770, "y":-480, "curve":90
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-450, "curve":90
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":450, "curve":90
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-770, "y":480, "curve":90
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":450
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":770, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":770, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-450
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-500, "y":10, "curve":100
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-500, "y":15, "curve":100
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":500, "y":10, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":500, "y":15, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-480, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":-130, "curve":0
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":130, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":480, "color":"C7E6BD"
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":-800, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["wall"], "x":800, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":801, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":801, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":800, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":800, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-801, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-801, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-802, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-802, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-803, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-803, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-801, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-801, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-802, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-802, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-803, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-803, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":800, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-800, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-800, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":800, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":801, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-814, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-814, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-807, "y":132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-807, "y":482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-805, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-805, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-810, "y":133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-810, "y":483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-819, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-819, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-816, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-812, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-812, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-805, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-805, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-816, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-816, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-808, "y":-479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-808, "y":-129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-809, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-809, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-814, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-814, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-815, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-813, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-807, "y":132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-807, "y":482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-818, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-810, "y":133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-810, "y":483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-817, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-811, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-819, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":-819, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":805, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":808, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":808, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":808, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":808, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":810, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":810, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":805, "y":-484
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":805, "y":-134
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":806, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":806, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":812, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":812, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":804, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":804, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":818, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":818, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":822, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":822, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":815, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":815, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":821, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":821, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":818, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":818, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-483
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":-133
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":822, "y":-480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":822, "y":-130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":815, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":815, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":821, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":821, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-482
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":-132
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":820, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":820, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":819, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":806, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":810, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":810, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":809, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":811, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":811, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":130
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":817, "y":480
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":806, "y":128
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":806, "y":478
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":131
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":814, "y":481
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":807, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":807, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":813, "y":479
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":805, "y":129
    }

    ,
        {
        "bCoef": 1, "cMask":["ball"], "trait":"ballArea", "x":805, "y":479
    }

    ],
    "segments":[ {
        "v0": 4, "v1":5, "trait":"kickOffBarrier"
    }

    ,
        {
        "v0": 5, "v1":6, "trait":"kickOffBarrier", "curve":180, "cGroup":["blueKO"]
    }

    ,
        {
        "v0": 5, "v1":6, "trait":"kickOffBarrier", "curve":-180, "cGroup":["redKO"]
    }

    ,
        {
        "v0": 6, "v1":7, "trait":"kickOffBarrier"
    }

    ,
        {
        "curve": 0, "vis":false, "bCoef":1, "trait":"ballArea", "v0":0, "v1":8
    }

    ,
        {
        "curve": 0, "vis":false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":1, "v1":9
    }

    ,
        {
        "curve": 0, "vis":false, "bCoef":1, "trait":"ballArea", "v0":2, "v1":10
    }

    ,
        {
        "curve": 0, "vis":false, "bCoef":1, "v0":11, "v1":3, "trait":"ballArea"
    }

    ,
        {
        "curve": 10, "vis":true, "bCoef":1, "cMask":["ball"], "trait":"goalNet", "v0":12, "v1":13, "color":"C7E6BD"
    }

    ,
        {
        "curve": -10, "vis":true, "bCoef":1, "cMask":["ball"], "trait":"goalNet", "v0":14, "v1":15, "color":"C7E6BD"
    }

    ,
        {
        "curve": -20, "vis":true, "color":"C7E6BD", "bCoef":1.5, "v0":15, "v1":13
    }

    ,
        {
        "curve": 10, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["ball"], "v0":16, "v1":17, "trait":"goalNet"
    }

    ,
        {
        "curve": 10, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["ball"], "v0":18, "v1":19, "trait":"goalNet"
    }

    ,
        {
        "curve": 20, "vis":true, "color":"C7E6BD", "bCoef":1, "v0":19, "v1":16
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":20, "v1":21
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":22, "v1":23
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":21, "v1":23
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":24, "v1":25
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":26, "v1":27
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":27, "v1":25
    }

    ,
        {
        "curve": 150, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":28, "v1":29
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":30, "v1":31
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":32, "v1":33
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":33, "v1":31
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":34, "v1":35
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":36, "v1":37
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":35, "v1":37
    }

    ,
        {
        "curve": -150, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":38, "v1":39
    }

    ,
        {
        "curve": 90, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":40, "v1":41
    }

    ,
        {
        "curve": 90, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":42, "v1":43
    }

    ,
        {
        "curve": -90, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":44, "v1":45
    }

    ,
        {
        "curve": -90, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":46, "v1":47
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":48, "v1":49
    }

    ,
        {
        "curve": 100, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":48, "v1":49
    }

    ,
        {
        "curve": 100, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":50, "v1":51, "x":500, "y":10
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":50, "v1":51, "x":500, "y":10
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":52, "v1":53
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":54, "v1":55
    }

    ,
        {
        "curve": 0, "vis":true, "bCoef":1, "cMask":["wall"], "v0":56, "v1":57, "color":"C7E6BD"
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":58, "v1":59
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":60, "v1":61
    }

    ,
        {
        "curve": 0, "vis":true, "color":"C7E6BD", "bCoef":1, "cMask":["wall"], "v0":62, "v1":63
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":64, "v1":65
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":68, "v1":69
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":70, "v1":71
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":72, "v1":73
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":74, "v1":75
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":76, "v1":77
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":78, "v1":79
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":80, "v1":81, "y":-481
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":82, "v1":83
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":86, "v1":87
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":88, "v1":89
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":90, "v1":91
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":92, "v1":93
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":94, "v1":95
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":96, "v1":97
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":98, "v1":99
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":100, "v1":101
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":102, "v1":103
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":104, "v1":105
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":106, "v1":107
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":109, "v1":110
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":111, "v1":112
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":113, "v1":114
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":115, "v1":116
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":117, "v1":118
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":119, "v1":120
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":121, "v1":122
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":123, "v1":124
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":125, "v1":126
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":127, "v1":128
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":130, "v1":131
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":132, "v1":133
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":134, "v1":135
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":136, "v1":137
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":138, "v1":139
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":140, "v1":141
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":142, "v1":143
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":144, "v1":145
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":146, "v1":147
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":148, "v1":149
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":151, "v1":152
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":153, "v1":154
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":155, "v1":156
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":157, "v1":158
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":159, "v1":160
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":161, "v1":162
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":163, "v1":164
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":165, "v1":166
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":167, "v1":168
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":170, "v1":171
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":172, "v1":173
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":174, "v1":175
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":176, "v1":177
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":178, "v1":179
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":180, "v1":181
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":182, "v1":183
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":184, "v1":185
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":186, "v1":187
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":189, "v1":190
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":191, "v1":192
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":193, "v1":194
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":195, "v1":196
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":197, "v1":198
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":199, "v1":200
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":201, "v1":202
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":203, "v1":204
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":205, "v1":206
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":207, "v1":208
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":209, "v1":210
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":212, "v1":213
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":214, "v1":215
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":216, "v1":217
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":218, "v1":219
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":220, "v1":221
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":222, "v1":223
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":224, "v1":225
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":226, "v1":227
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":228, "v1":229
    }

    ,
        {
        "vis": false, "bCoef":1, "cMask":["ball"], "trait":"ballArea", "v0":230, "v1":231
    }

    ],
    "goals":[ {
        "team": "red", "p0":[-800, -130], "p1":[-800, 130]
    }

    ,
        {
        "team": "blue", "p0":[800, -130], "p1":[800, 130]
    }

    ],
    "discs":[ {
        "radius": 5.5, "invMass":0, "pos":[-800, 130], "bCoef":1, "trait":"goalPost"
    }

    ,
        {
        "radius": 5.5, "invMass":0, "pos":[-800, -130], "bCoef":1, "trait":"goalPost"
    }

    ,
        {
        "radius": 5.5, "invMass":0, "pos":[800, -130], "bCoef":1, "trait":"goalPost"
    }

    ,
        {
        "radius": 5.5, "invMass":0, "pos":[800, 130], "bCoef":1, "trait":"goalPost"
    }

    ],
    "planes":[ {
        "normal": [0, 1], "dist":-480, "trait":"ballArea"
    }

    ,
        {
        "normal": [0, -1], "dist":-480, "trait":"ballArea"
    }

    ,
        {
        "normal": [0, 1], "dist":-550, "bCoef":0.1
    }

    ,
        {
        "normal": [0, -1], "dist":-550, "bCoef":0.1
    }

    ,
        {
        "normal": [1, 0], "dist":-920, "bCoef":0.1
    }

    ,
        {
        "dist": -920, "normal":[-1, 0]
    }

    ],
    "traits": {
        "ballArea": {
            "vis": false, "bCoef":1, "cMask":["ball"]
        }

        ,
        "goalPost": {
            "radius": 8, "invMass":0, "bCoef":0.5
        }

        ,
        "goalNet": {
            "vis": true, "bCoef":0.1, "cMask":["ball"]
        }

        ,
        "kickOffBarrier": {
            "vis": false, "bCoef":0.1, "cGroup":["redKO", "blueKO"], "cMask":["red", "blue"]
        }
    }

    ,
    "playerPhysics": {
        "bCoef": 0.5, "invMass":0.3, "damping":0.96, "acceleration":0.105, "kickingAcceleration":0.073, "kickingDamping":0.97, "kickStrength":5.7
    }

    ,
    "ballPhysics": {
        "radius": 6.4, "bCoef":0.5, "invMass":1, "damping":0.99, "color":"DEE8D1", "cMask":["all"], "cGroup":["ball"]
    }
}

`;