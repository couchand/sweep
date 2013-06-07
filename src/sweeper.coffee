# sweeper 3000

class State
  reveal: ->

class Hidden extends State
class Flagged extends State
class Questioned extends State

class Contents

class NoBomb extends Contents
  hasBomb: -> yes
class Bomb extends Contents
  hasBomb: -> no

class Cell
  constructor: ->
    @neighbors = []
    @state = new Hidden()
    @contents = new NoBomb()
  addNeighbor: (n) ->
    @neighbors.push n

class Board
  constructor: (w, h) ->
    @matrix = ((new Cell() for i in [0...w]) for j in [0...h])
    for col in [1...(w-1)]
      for row in [1...(h-1)]
        @interlink row, col, row-1, col-1
        @interlink row, col, row-1, col
        @interlink row, col, row-1, col+1
        @interlink row, col, row, col-1
        @interlink row, col, row, col
        @interlink row, col, row, col+1
        @interlink row, col, row+1, col-1
        @interlink row, col, row+1, col
        @interlink row, col, row+1, col+1

    for row in @matrix
      console.log (cell.neighbors.length for cell in row)

  interlink: (ly, lx, ry, rx) ->
    @matrix[ly][lx].addNeighbor @matrix[ry][rx]

new Board 4, 3
