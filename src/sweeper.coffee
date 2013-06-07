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
  toString: -> "N"
  hasBomb: -> no
class Bomb extends Contents
  toString: -> "B"
  hasBomb: -> yes

class Cell
  constructor: ->
    @neighbors = []
    @state = new Hidden()
    @contents = new NoBomb()
  addNeighbor: (n) ->
    @neighbors.push n
  toString: -> "#{@state.toString()}[#{@contents.toString()}](#{@neighbors.length})"
  hasBomb: ->
    @contents.hasBomb()
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

  link: (rangeRow, rangeCol, dRow, dCol) ->
    for col in rangeCol
     for row in rangeRow
       @interlink row, col, dRow(row), dCol(col)

  interlink: (ly, lx, ry, rx) ->
    @matrix[ly][lx].addNeighbor @matrix[ry][rx]

rand = (n) -> Math.floor n*Math.random()
randCell = (b) ->
  pos = {
    row: rand(b.matrix.length)
    col: rand(b.matrix[0].length)
  }
  if b.matrix[pos.row][pos.col].hasBomb() then randCell(b) else pos

class Game
  constructor: (opts) ->
    opts ?= {}
    opts.width ?= 20
    opts.height ?= 10
    opts.mines ?= 7
    @board = new Board opts.width, opts.height
    for mine in [0...opts.mines]
      pos = randCell @board
      @board.matrix[pos.row][pos.col].contents = new Bomb()

    for row in @board.matrix
      console.log (cell.toString() for cell in row).join ","

new Game()
