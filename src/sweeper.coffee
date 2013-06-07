# sweeper 3000

class State
  revealed: -> no
  reveal: (what) ->
    what.reveal()
    new Revealed(what)

class Hidden extends State
  toString: -> "H"
  toggleFlag: -> new Flagged()
  cls: -> "hidden"
class Flagged extends State
  toString: -> "F"
  toggleFlag: -> new Questioned()
  cls: -> "flagged"
  reveal: -> @
class Questioned extends State
  toString: -> "Q"
  toggleFlag: -> new Hidden()
  cls: -> "questioned"
  reveal: -> @
class Revealed extends State
  constructor: (@what) ->
  revealed: -> yes
  cls: -> "revealed #{@what.cls}"
  toString: -> @what.toString()
  reveal: -> @
  toggleFlag: -> @

class Contents
  constructor: (@parent) ->
  reveal: ->

class NoBomb extends Contents
  toString: ->
    m = @parent.neighborMines()
    if m is 0 then " " else "#{m}"
  cls: -> "nobomb"
  hasBomb: -> no
class Bomb extends Contents
  toString: -> "B"
  cls: -> "bomb"
  hasBomb: -> yes
  reveal: ->
    console.error "game over"

class Cell
  constructor: ->
    @neighbors = []
    @state = new Hidden()
    @contents = new NoBomb @
  addNeighbor: (n) ->
    @neighbors.push n
  neighborMines: ->
    (n for n in @neighbors when n.hasBomb()).length
  toString: -> "#{@state.toString()}"
  hasBomb: ->
    @contents.hasBomb()
  reveal: ->
    return if @state.revealed()
    @state = @state.reveal @contents
    neighbor.reveal() for neighbor in @neighbors if @neighborMines() is 0
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

  toString: ->
    for row in @board.matrix
      console.log (cell.toString() for cell in row).join " "

new Game()

module.exports = Game
