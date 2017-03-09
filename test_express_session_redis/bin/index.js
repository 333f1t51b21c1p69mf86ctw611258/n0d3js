/**
 Loading all dependcies.
 **/
var express = require("express");
var redis = require("redis");
var mysql = require("mysql");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require("path");
var async = require("async");
var client = redis.createClient();
var app = express();
var router = express.Router();

// MySql connection
var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	port: '3306',
	user: 'tms_user',
	password: '123456',
	database: 'test',
	debug: false
});

// Param: views folder path
app.set('views', path.join(__dirname, '../', 'views'));
// Render html file
app.engine('html', require('ejs').renderFile);

// Redis database configuration
app.use(session({
	secret: 'ssshhhhh',
	store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
	saveUninitialized: false,
	resave: false
}));

// Cookie parser
app.use(cookieParser("secretSign#143_!223"));
app.use(bodyParser.urlencoded({extended: false}));
// Json BodyParser
app.use(bodyParser.json());

// Hander Database events
function handle_database(req, type, callback) {
	async.waterfall([
		function (callback) {
			pool.getConnection(function (err, connection) {
				if (err) {
					// if there is error, stop right away.
					// This will stop the async code execution and goes to last function.
					callback(true);
				} else {
					callback(null, connection);
				}
			});
		},
		function (connection, callback) {
			var SQLquery;

			// Choose sql query for corresponding action type
			switch (type) {
				case "login" :
					SQLquery = "SELECT * from user_login WHERE user_email='" + req.body.user_email + "' AND `user_password`='" + req.body.user_password + "'";
					break;
				case "checkEmail" :
					SQLquery = "SELECT * from user_login WHERE user_email='" + req.body.user_email + "'";
					break;
				case "register" :
					SQLquery = "INSERT into user_login(user_email,user_password,user_name) VALUES ('" + req.body.user_email + "','" + req.body.user_password + "','" + req.body.user_name + "')";
					break;
				case "addStatus" :
					SQLquery = "INSERT into user_status(user_id,user_status) VALUES (" + req.session.key["user_id"] + ",'" + req.body.status + "')";
					break;
				case "getStatus" :
					SQLquery = "SELECT * FROM user_status WHERE user_id=" + req.session.key["user_id"];
					break;
				default :
					break;
			}
			callback(null, connection, SQLquery);
		},
		function (connection, SQLquery, callback) {
			connection.query(SQLquery, function (err, rows) {
				connection.release();
				if (!err) {
					if (type === "login") {
						callback(rows.length === 0 ? false : rows[0]);
					} else if (type === "getStatus") {
						callback(rows.length === 0 ? false : rows);
					} else if (type === "checkEmail") {
						callback(rows.length === 0 ? false : true);
					} else {
						callback(false);
					}
				} else {
					// if there is error, stop right away.
					// This will stop the async code execution and goes to last function.
					callback(true);
				}
			});
		}
	], function (result) {
		// This function gets call after every async task finished.
		if (typeof(result) === "boolean" && result === true) {
			callback(null);
		} else {
			callback(result);
		}
	});
}

/**
 --- Router Code begins here.
 **/

// Router for root path '/'
router.get('/', function (req, res) {
	res.render('index.html');
});

// Router for login path '/login'
router.post('/login', function (req, res) {
	handle_database(req, "login", function (response) {
		if (response === null) {
			res.json({"error": "true", "message": "Database error occurred"});
		} else {
			if (!response) {
				res.json({"error": "true", "message": "Login failed ! Please register"});
			} else {
				req.session.key = response;
				res.json({"error": false, "message": "Login success."});
			}
		}
	});
});

// Router for home path '/home'
router.get('/home', function (req, res) {
	if (req.session.key) {
		res.render("home.html", {email: req.session.key["user_name"]});
	} else {
		res.redirect("/");
	}
});

// Router for fetchStatus path '/fetchStatus'
router.get("/fetchStatus", function (req, res) {
	if (req.session.key) {
		handle_database(req, "getStatus", function (response) {
			if (!response) {
				res.json({"error": false, "message": "There is no status to show."});
			} else {
				res.json({"error": false, "message": response});
			}
		});
	} else {
		res.json({"error": true, "message": "Please login first."});
	}
});

// Router for addStatus path '/addStatus'
router.post("/addStatus", function (req, res) {
	if (req.session.key) {
		handle_database(req, "addStatus", function (response) {
			if (!response) {
				res.json({"error": false, "message": "Status is added."});
			} else {
				res.json({"error": false, "message": "Error while adding Status"});
			}
		});
	} else {
		res.json({"error": true, "message": "Please login first."});
	}
});

// Router for register path '/register'
router.post("/register", function (req, res) {
	handle_database(req, "checkEmail", function (response) {
		if (response === null) {
			res.json({"error": true, "message": "This email is already present"});
		} else {
			handle_database(req, "register", function (response) {
				if (response === null) {
					res.json({"error": true, "message": "Error while adding user."});
				} else {
					res.json({"error": false, "message": "Registered successfully."});
				}
			});
		}
	});
});

// Router for logout path '/logout'
router.get('/logout', function (req, res) {
	if (req.session.key) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
});

app.use('/', router);

app.listen(3000, function () {
	console.log("I am running at 3000");
});