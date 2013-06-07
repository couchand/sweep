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

class Board
  constructor: (w, h) ->
    @matrix = ((new Cell() for i in [0...w]) for j in [0...h])
    console.log JSON.stringify @matrix, null, 2

new Board 4, 2
