var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var index = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new error('not found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// サーバーをポート3000番で起動
http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*------ sockets ------*/
var joinCount = 0,// 参加人数
    roomCount = 1;// ルーム数

// socket.ioのソケットを管理するオブジェクト
var socketsOf = {};

var room = io.sockets.on('connection', function (socket) {
	// コネクションが確立されたら実行
	socket.emit('connected', {});

	// 認証情報を確認する
	socket.on('join room', function (client) {
		
		var userName = uuid.v4();

	    joinCount += 1;
	    if (joinCount > 2) {
	        joinCount = 1;
	        roomCount += 1;
	        roomId = 'roomId' + roomCount;
	    } else {
	        roomId = 'roomId' + roomCount;
	    }
		
		// なければルーム生成
	    if (socketsOf[roomId] === undefined) {
	        socketsOf[roomId] = {};
	    }else{
	    	// ルームに同名ユーザー存在 再度生成
            if (socketsOf[roomId][userName] !== undefined) {
                joinCount -= 1;
                socket.emit('userName exists', {});
                return;
            }
        }

	    // ソケットにクライアントの情報をセット
		socketsOf[roomId][userName] = socket;

	    // 認証成功
	    // socket.emit('join ok', {});

	    // 既存クライアントにメンバーの変更を通知
	    var members = Object.keys(socketsOf[roomId]);
	    //emitToRoom(client.roomId, 'update members', members);
	    console.log(members);

	    if (members.length === 1) {
	        socket.emit('battle wait');
	    }else if(members.length === 2) {
	        socket.broadcast.emit('battle start');
	        socket.emit('battle start');
	    }
	});
});

module.exports = app;
