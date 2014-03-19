require(["dojo/on", "dojo/domReady!"], function (on) {


  var app = {
    status: 'hold',
    road: document.getElementById('road'),
    info: document.getElementById('info'),
    boom: document.createElement('div'),
    stopPauseBtn: document.createElement('button'),
    audio: document.createElement('audio')
  };

  app.insertAudio = function () {
    this.audio.src = 'audio/tetris.mp3';
    document.body.appendChild(this.audio);
  };

  app.createCar = function () {
    var div = document.createElement('div');
    div.id = 'car';
    this.car = div;
  };

  app.createScore = function () {
    var div = document.createElement('div');
    div.id = 'score';
    div.innerHTML = '0';
    this.score = div;
    document.body.appendChild(this.score);
  };

  app.stopPause = function () {
    if (this.status === 'end') {
      return;
    }
    var that = this;
    if (timer) {
      this.status = 'paue';
      clearInterval(timer);
      app.audio.pause();
      timer = null;
    } else {
      this.status = 'start';
      timer = setInterval(that.startGame, 2);
      app.audio.play();
    }
  };

  app.createStopPause = function () {
    var div = this.stopPauseBtn;
    var that = this;
    div.id = 'stopPause';
    div.innerHTML = 'stop/pause';
    document.getElementById('info').appendChild(div);
    div.onclick = function () {
      that.stopPause();
    }
  };

  app.insertCar = function () {
    document.body.appendChild(this.car);
  };

  app.move = function(){
    var that = this;
    on(document, "keydown", function (event) {
      if (event.keyCode === 37) {
        that.moveLeft();
      }
      if (event.keyCode === 39) {
        that.moveRight();
      }
    });

    on(document, "keypress", function (event) {
      if (event.keyCode === 32) {
        that.stopPause();
      }
    });
  };

  app.moveRight = function () {
    if (this.status !== 'start') {
      return;
    }
    var margin = parseInt(this.car.style.marginLeft) || 0;
    margin += 20;
    margin < this.road.offsetWidth - this.car.offsetWidth ?
      this.car.style.marginLeft = margin + 'px' :
      this.car.style.marginLeft = this.road.offsetWidth - this.car.offsetWidth + 'px'
  };

  app.moveLeft = function () {
    if (this.status !== 'start') {
      return;
    }
    var margin = parseInt(this.car.style.marginLeft) || 0;
    margin -= 20;
    margin > 0 ?
      this.car.style.marginLeft = margin + 'px' :
      this.car.style.marginLeft = '0px'
  };

  app.increseScore = function (inc) {
    var score = parseInt(this.score.innerHTML) || 0;
    score += Math.floor(inc * 0.1);
    this.score.innerHTML = score;
  };

  app.createWall = function () {
    var width = Math.floor(Math.random() * (400 - 10 + 1)) + 10;
    var positionX = Math.floor(Math.random() * (screen.width - screen.width * 0.2 - width + 1));
    var div = document.createElement('div');
    div.className = 'wall';
    div.style.width = width + 'px';
    div.style.height = 50 + 'px';
    div.style.backgroundColor = '#000';
    div.style.boxShadow = '0 0 1px #fff, 0 0 2px #ff9490, 0 0 3px #ff6246, 0 0 4px #ff6130, 0 0 5px #ff0200, 0 0 6px #00d2ff, 0 0 9px #00d2ff';
    div.style.position = 'absolute';
    div.style.left = positionX + 'px';
    document.body.appendChild(div);
  };

  app.endGame = function () {
    this.road.style.background = '#000';
    this.boom.innerHTML = 'Looooose<br>You score is ' + this.score.innerHTML;
    this.boom.style.color = '#fff';
    this.boom.style.fontSize = '40px';
    this.boom.style.position = 'absolute';
    this.boom.style.top = '200px';
    this.boom.style.left = '600px';
    document.body.appendChild(this.boom);
    this.audio.pause();
    this.status = 'end';
  };

  app.startGame = function () {
    app.audio.play();
    var walls = document.getElementsByClassName('wall');
    for (var i = 0; i < walls.length; i++) {
      var top = parseInt(walls[i].style.top) || 0;
      top += 1;

      if (top > window.innerHeight - 50) {
        app.increseScore(walls[i].offsetWidth);
        walls[i].remove();
      } else {
        walls[i].style.top = top + 'px';
      }

      var rect1Left = app.car.offsetLeft;
      var rect1Right = app.car.offsetLeft + app.car.offsetWidth;
      var rect1Top = app.car.offsetTop;
      var rect2Left = walls[i].offsetLeft;
      var rect2Right = walls[i].offsetLeft + walls[i].offsetWidth;
      var rect2Bottom = walls[i].offsetTop + walls[i].offsetHeight;

      overlap = overlap || (rect1Top < rect2Bottom &&
        ((rect1Left > rect2Left && rect1Left < rect2Right) ||
          (rect1Right > rect2Left && rect1Right < rect2Right))
        );

    }

    if (overlap) {
      clearInterval(timer);
      app.endGame();
    }
    overlap = false;
    tmp++;

    if (tmp % 100 == 0) {
      app.createWall();
    }

  };

  app.createScore();
  app.createCar();
  app.insertCar();
  app.createWall();
  app.createStopPause();
  app.move();
  app.insertAudio();
  app.status = 'start';


  app.road.style.height = window.innerHeight + 'px';
  app.info.style.height = window.innerHeight + 'px';

  var overlap = false;
  var tmp = 0;
  var timer = setInterval(app.startGame, 2);
});
