// Generated by CoffeeScript 1.6.3
(function() {
  var Board, Bomb, Cell, Contents, Flagged, Game, Hidden, NoBomb, Questioned, Revealed, State, less, more, rand, randCell, same, _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  State = (function() {
    function State() {}

    State.prototype.revealed = function() {
      return false;
    };

    State.prototype.reveal = function(what) {
      what.reveal();
      return new Revealed(what);
    };

    return State;

  })();

  Hidden = (function(_super) {
    __extends(Hidden, _super);

    function Hidden() {
      _ref = Hidden.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Hidden.prototype.toString = function() {
      return "";
    };

    Hidden.prototype.toggleFlag = function() {
      return new Flagged();
    };

    Hidden.prototype.cls = function() {
      return "hidden";
    };

    return Hidden;

  })(State);

  Flagged = (function(_super) {
    __extends(Flagged, _super);

    function Flagged() {
      _ref1 = Flagged.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Flagged.prototype.toString = function() {
      return "F";
    };

    Flagged.prototype.toggleFlag = function() {
      return new Questioned();
    };

    Flagged.prototype.cls = function() {
      return "flagged";
    };

    Flagged.prototype.reveal = function() {
      return this;
    };

    return Flagged;

  })(State);

  Questioned = (function(_super) {
    __extends(Questioned, _super);

    function Questioned() {
      _ref2 = Questioned.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Questioned.prototype.toString = function() {
      return "Q";
    };

    Questioned.prototype.toggleFlag = function() {
      return new Hidden();
    };

    Questioned.prototype.cls = function() {
      return "questioned";
    };

    Questioned.prototype.reveal = function() {
      return this;
    };

    return Questioned;

  })(State);

  Revealed = (function(_super) {
    __extends(Revealed, _super);

    function Revealed(what) {
      this.what = what;
    }

    Revealed.prototype.revealed = function() {
      return true;
    };

    Revealed.prototype.cls = function() {
      return "revealed " + (this.what.cls());
    };

    Revealed.prototype.toString = function() {
      return this.what.toString();
    };

    Revealed.prototype.reveal = function() {
      return this;
    };

    Revealed.prototype.toggleFlag = function() {
      return this;
    };

    return Revealed;

  })(State);

  Contents = (function() {
    function Contents(parent) {
      this.parent = parent;
    }

    Contents.prototype.reveal = function() {};

    return Contents;

  })();

  NoBomb = (function(_super) {
    __extends(NoBomb, _super);

    function NoBomb() {
      _ref3 = NoBomb.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    NoBomb.prototype.toString = function() {
      var m;
      m = this.parent.neighborMines();
      if (m === 0) {
        return " ";
      } else {
        return "" + m;
      }
    };

    NoBomb.prototype.cls = function() {
      return "nobomb " + (this.parent.neighborMines()) + "mines";
    };

    NoBomb.prototype.hasBomb = function() {
      return false;
    };

    return NoBomb;

  })(Contents);

  Bomb = (function(_super) {
    __extends(Bomb, _super);

    function Bomb(endGame) {
      this.endGame = endGame;
    }

    Bomb.prototype.toString = function() {
      return "B";
    };

    Bomb.prototype.cls = function() {
      return "bomb";
    };

    Bomb.prototype.hasBomb = function() {
      return true;
    };

    Bomb.prototype.reveal = function() {
      var end;
      end = this.endGame;
      setTimeout(end, 0);
      return console.error("game over");
    };

    return Bomb;

  })(Contents);

  Cell = (function() {
    function Cell() {
      this.neighbors = [];
      this.state = new Hidden();
      this.contents = new NoBomb(this);
    }

    Cell.prototype.cls = function() {
      return this.state.cls();
    };

    Cell.prototype.addNeighbor = function(n) {
      return this.neighbors.push(n);
    };

    Cell.prototype.neighborMines = function() {
      var n;
      return ((function() {
        var _i, _len, _ref4, _results;
        _ref4 = this.neighbors;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          n = _ref4[_i];
          if (n.hasBomb()) {
            _results.push(n);
          }
        }
        return _results;
      }).call(this)).length;
    };

    Cell.prototype.toString = function() {
      return "" + (this.state.toString());
    };

    Cell.prototype.hasBomb = function() {
      return this.contents.hasBomb();
    };

    Cell.prototype.reveal = function() {
      var neighbor, _i, _len, _ref4, _results;
      if (this.state.revealed()) {
        return;
      }
      this.state = this.state.reveal(this.contents);
      if (this.neighborMines() === 0) {
        _ref4 = this.neighbors;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          neighbor = _ref4[_i];
          _results.push(neighbor.reveal());
        }
        return _results;
      }
    };

    Cell.prototype.expose = function() {
      return this.state = new Revealed(this.contents);
    };

    Cell.prototype.toggleFlag = function() {
      return this.state = this.state.toggleFlag();
    };

    return Cell;

  })();

  less = function(x) {
    return x - 1;
  };

  same = function(x) {
    return x;
  };

  more = function(x) {
    return x + 1;
  };

  Board = (function() {
    function Board(w, h) {
      var i, j, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results1, _results10, _results11, _results12, _results13, _results14, _results15, _results2, _results3, _results4, _results5, _results6, _results7, _results8, _results9, _s, _t, _u, _v, _w, _x;
      this.matrix = (function() {
        var _i, _results;
        _results = [];
        for (j = _i = 0; 0 <= h ? _i < h : _i > h; j = 0 <= h ? ++_i : --_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (i = _j = 0; 0 <= w ? _j < w : _j > w; i = 0 <= w ? ++_j : --_j) {
              _results1.push(new Cell());
            }
            return _results1;
          })());
        }
        return _results;
      })();
      this.link((function() {
        _results = [];
        for (var _i = 1; 1 <= h ? _i < h : _i > h; 1 <= h ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this), (function() {
        _results1 = [];
        for (var _j = 1; 1 <= w ? _j < w : _j > w; 1 <= w ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this), less, less);
      this.link((function() {
        _results2 = [];
        for (var _k = 1; 1 <= h ? _k < h : _k > h; 1 <= h ? _k++ : _k--){ _results2.push(_k); }
        return _results2;
      }).apply(this), (function() {
        _results3 = [];
        for (var _l = 0; 0 <= w ? _l < w : _l > w; 0 <= w ? _l++ : _l--){ _results3.push(_l); }
        return _results3;
      }).apply(this), less, same);
      this.link((function() {
        _results4 = [];
        for (var _m = 1; 1 <= h ? _m < h : _m > h; 1 <= h ? _m++ : _m--){ _results4.push(_m); }
        return _results4;
      }).apply(this), (function() {
        _results5 = [];
        for (var _n = 0, _ref4 = w - 1; 0 <= _ref4 ? _n < _ref4 : _n > _ref4; 0 <= _ref4 ? _n++ : _n--){ _results5.push(_n); }
        return _results5;
      }).apply(this), less, more);
      this.link((function() {
        _results6 = [];
        for (var _o = 0; 0 <= h ? _o < h : _o > h; 0 <= h ? _o++ : _o--){ _results6.push(_o); }
        return _results6;
      }).apply(this), (function() {
        _results7 = [];
        for (var _p = 1; 1 <= w ? _p < w : _p > w; 1 <= w ? _p++ : _p--){ _results7.push(_p); }
        return _results7;
      }).apply(this), same, less);
      this.link((function() {
        _results8 = [];
        for (var _q = 0; 0 <= h ? _q < h : _q > h; 0 <= h ? _q++ : _q--){ _results8.push(_q); }
        return _results8;
      }).apply(this), (function() {
        _results9 = [];
        for (var _r = 0, _ref5 = w - 1; 0 <= _ref5 ? _r < _ref5 : _r > _ref5; 0 <= _ref5 ? _r++ : _r--){ _results9.push(_r); }
        return _results9;
      }).apply(this), same, more);
      this.link((function() {
        _results10 = [];
        for (var _s = 0, _ref6 = h - 1; 0 <= _ref6 ? _s < _ref6 : _s > _ref6; 0 <= _ref6 ? _s++ : _s--){ _results10.push(_s); }
        return _results10;
      }).apply(this), (function() {
        _results11 = [];
        for (var _t = 1; 1 <= w ? _t < w : _t > w; 1 <= w ? _t++ : _t--){ _results11.push(_t); }
        return _results11;
      }).apply(this), more, less);
      this.link((function() {
        _results12 = [];
        for (var _u = 0, _ref7 = h - 1; 0 <= _ref7 ? _u < _ref7 : _u > _ref7; 0 <= _ref7 ? _u++ : _u--){ _results12.push(_u); }
        return _results12;
      }).apply(this), (function() {
        _results13 = [];
        for (var _v = 0; 0 <= w ? _v < w : _v > w; 0 <= w ? _v++ : _v--){ _results13.push(_v); }
        return _results13;
      }).apply(this), more, same);
      this.link((function() {
        _results14 = [];
        for (var _w = 0, _ref8 = h - 1; 0 <= _ref8 ? _w < _ref8 : _w > _ref8; 0 <= _ref8 ? _w++ : _w--){ _results14.push(_w); }
        return _results14;
      }).apply(this), (function() {
        _results15 = [];
        for (var _x = 0, _ref9 = w - 1; 0 <= _ref9 ? _x < _ref9 : _x > _ref9; 0 <= _ref9 ? _x++ : _x--){ _results15.push(_x); }
        return _results15;
      }).apply(this), more, more);
    }

    Board.prototype.link = function(rangeRow, rangeCol, dRow, dCol) {
      var col, row, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rangeCol.length; _i < _len; _i++) {
        col = rangeCol[_i];
        _results.push((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = rangeRow.length; _j < _len1; _j++) {
            row = rangeRow[_j];
            _results1.push(this.interlink(row, col, dRow(row), dCol(col)));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Board.prototype.interlink = function(ly, lx, ry, rx) {
      return this.matrix[ly][lx].addNeighbor(this.matrix[ry][rx]);
    };

    return Board;

  })();

  rand = function(n) {
    return Math.floor(n * Math.random());
  };

  randCell = function(b) {
    var pos;
    pos = {
      row: rand(b.matrix.length),
      col: rand(b.matrix[0].length)
    };
    if (b.matrix[pos.row][pos.col].hasBomb()) {
      return randCell(b);
    } else {
      return pos;
    }
  };

  Game = (function() {
    function Game(opts) {
      var mine, pos, t, _i, _ref4;
      if (opts == null) {
        opts = {};
      }
      if (opts.width == null) {
        opts.width = 20;
      }
      if (opts.height == null) {
        opts.height = 10;
      }
      if (opts.mines == null) {
        opts.mines = 7;
      }
      this.board = new Board(opts.width, opts.height);
      t = this;
      for (mine = _i = 0, _ref4 = opts.mines; 0 <= _ref4 ? _i < _ref4 : _i > _ref4; mine = 0 <= _ref4 ? ++_i : --_i) {
        pos = randCell(this.board);
        this.board.matrix[pos.row][pos.col].contents = new Bomb(function() {
          return t.showAll();
        });
      }
    }

    Game.prototype.toString = function() {
      var cell, row, _i, _len, _ref4, _results;
      _ref4 = this.board.matrix;
      _results = [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        row = _ref4[_i];
        _results.push(console.log(((function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
            cell = row[_j];
            _results1.push(cell.toString());
          }
          return _results1;
        })()).join(" ")));
      }
      return _results;
    };

    Game.prototype.showAll = function() {
      var cell, row, _i, _j, _len, _len1, _ref4;
      _ref4 = this.board.matrix;
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        row = _ref4[_i];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          cell = row[_j];
          cell.expose();
        }
      }
      return this.onEnd && this.onEnd();
    };

    return Game;

  })();

  new Game();

  module.exports = Game;

}).call(this);
