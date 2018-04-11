
'use strict';

const path = require('path');
const mysql = require('mysql');
const express = require('express');
const responseTime = require('response-time');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const ejs = require('ejs');
const compression = require('compression');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const finallyResp = require('../middlewares/finally-resp');

const router = require('../routes');

const app = express();

app.set('views', path.join(__dirname, '..', config.view.dir));
app.set('view engine', config.view.engine);
app.engine('.html', ejs.__express);
app.engine('.ejs', ejs.__express);

app.use(compression());
app.use(responseTime());
app.use(logger.log4js.connectLogger(logger, config.log));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
  proxy : true,
  resave : true,
  saveUninitialized : false,
  name : 'expressMVC',
  secret: 'expressMVC-secret',
  store : new RedisStore({
    host : config.redis.host,
    port : config.redis.port,
    db : config.redis.sessionDB,
    ttl : 3600
  }),
  cookied : {maxAge: 1000 * 60 * 60 * 7}
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  function(username, password, done) {
    if ( username !== password ) {
      return done( null, false, { message: 'Invalid user' } );
    };

    done( null, {user: 'ch'});
  }
)

passport.use( 'local', localStrategy );

// app.use(passport.initialize());
// app.use(passport.session());
app.get(
  '/login',
  passport.initialize(),
  // passport.session(),
  passport.authenticate( 'local', { session: true } ),
  function( req, res, next ) {
    console.log('????????')
    return next({code: 200, msg: 'logining'});
  }
);
app.use(router);

app.use((req, res, next) => {
  console.log('fuck!!!!!');
  return next();
});
app.use((req, res, next) => next({code:404}));
app.use(finallyResp.finallyResp({format: 'JSON'}));

function start() {
  return Promise.promisify(initDatabase)().then(() => {
    return app.listen(config.web.port, function () {
      logger.info(config.web.name, config.web.url, 'start');
    });
  }).catch((err) => {
    logger.error(err);
    process.exit(1);
  });
}

function initDatabase(cb) {
  let con = mysql.createConnection({
    host : config.mysql.host,
    database : config.mysql.database,
    user : config.mysql.username,
    password: config.mysql.password
  });
  con.connect();
  let sql = `create database if not exists ${config.mysql.database} default charset utf8 collate utf8_general_ci`;
  con.query(sql, (err, results) => {
    if (err) {
      return cb(err);
    } else {
      con.end();
      db.sequelize.sync({force: false}).then(() => cb(null, results)).catch((err) => cb(err));
    }
  });
}

if (!module.parent) {
  start();
} else {
  exports.start = start;
}
