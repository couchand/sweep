# sweeper 3000

class State
  reveal: -> new Revealed()

class Hidden extends State
  toString: -> "H"
  toggleFlag: -> new Flagged()
class Flagged extends State
  toString: -> "F"
  toggleFlag: -> new Questioned()
class Questioned extends State
  toString: -> "Q"
  toggleFlag: -> new Hidden()
class Revealed extends State
  toString: -> "R"
  reveal: -> @
  toggleFlag: -> @

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
  toString: -> "#{@state.toString()}(#{@neighbors.length})"
  reveal: ->
    @state = @state.reveal()
  toggleFlag: ->
    @state = @state.toggleFlag()

less = (x) -> x-1
same = (x) -> x
more = (x) -> x+1

class Board
  constructor: (w, h) ->
    @matrix = ((new Cell() for i in [0...w]) for j in [0...h])
    @link [1...h],     [1...w],     less, less
    @link [1...h],     [0...w],     less, same
    @link [1...h],     [0...(w-1)], less, more
    @link [0...h],     [1...w],     same, less
    @link [0...h],     [0...(w-1)], same, more
    @link [0...(h-1)], [1...w],     more, less
    @link [0...(h-1)], [0...w],     more, same
    @link [0...(h-1)], [0...(w-1)], more, more

    @matrix[1][1].toggleFlag()

    for row in @matrix
      console.log (cell.toString() for cell in row).join ","

  link: (rangeRow, rangeCol, dRow, dCol) ->
    for col in rangeCol
     for row in rangeRow
       @interlink row, col, dRow(row), dCol(col)

  interlink: (ly, lx, ry, rx) ->
    @matrix[ly][lx].addNeighbor @matrix[ry][rx]

new Board 20, 10
