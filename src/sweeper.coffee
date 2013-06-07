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

less = (x) -> x-1
same = (x) -> x
more = (x) -> x+1

class Board
  constructor: (w, h) ->
    @matrix = ((new Cell() for i in [0...w]) for j in [0...h])
    @link [1...h],     [0...w],     less, same
    @link [0...(h-1)], [0...w],     more, same
    @link [0...h],     [1...w],     same, less
    @link [0...h],     [0...(w-1)], same, more
    @link [1...h],     [1...w],     less, less
    @link [1...h],     [0...(w-1)], less, more
    @link [0...(h-1)], [1...w],     more, less
    @link [0...(h-1)], [0...(w-1)], more, more

    for row in @matrix
      console.log (cell.neighbors.length for cell in row)

  link: (rangeRow, rangeCol, dRow, dCol) ->
    for col in rangeCol
     for row in rangeRow
       @interlink row, col, dRow(row), dCol(col)

  interlink: (ly, lx, ry, rx) ->
    @matrix[ly][lx].addNeighbor @matrix[ry][rx]

new Board 20, 10
