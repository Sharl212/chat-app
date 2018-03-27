// required modules
const  express      = require('express'),
       path         = require('path'),
       favicon      = require('serve-favicon'),
       logger       = require('morgan'),
       cookieParser = require('cookie-parser'),
       bodyParser   = require('body-parser'),
       http         = require('http'),
       cons         = require('consolidate'),
       app          = express();    // express
// routes
// const index = require('./routes/index'),
//       users = require('./routes/users');

// function {generateMessage}

const port = process.env.PORT || 4000;

const { generateMessage } = require('./public/javascripts/generateMessage');

// modules installed
const socketiO = require('socket.io'),
      server   = http.createServer(app),
      io       = socketiO(server);

// view engine setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './client/build')));


io.on('connection', (socket)=>{
  socket.on('disconnect', ()=> {
      console.log("disconnected from server!");
  });

  socket.emit('newMessage', generateMessage("Admin", "Welcome to our Chat room"));

  socket.on('createMessage', (message)=>{
    io.emit('newMessage', generateMessage(message.from, message.content));
  });

})

server.listen(port,()=>{
  console.log(`server is up on ${port}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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


module.exports = app;
