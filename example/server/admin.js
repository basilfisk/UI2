// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// Interface to the administration HTTPS server
//
// *********************************************************************************************
// *********************************************************************************************
"use strict";

//var	amqp = require('amqplib/callback_api'),
var	fs = require('fs'),
	http = require('http'),
	https = require('https'),
	jwt = require('jsonwebtoken'),
	moment = require('moment'),
	mongo = require('mongodb').MongoClient,
	shortid = require('shortid'),
//	io = require('socket.io')(),
//	redis = require('redis'),
	redisClient, webSocket, admin = {}, mongoDB;

// Trap any uncaught exceptions
// Write error stack to STDERR, then exit process as state may be inconsistent
process.on('uncaughtException', function(err) {
	console.error('ERROR TRAPPED (admin): ' + moment().format('YYYY/MM/DD HH:mm:ss.SSS'));
	console.error(err.stack);
	process.exit(-1);
});

// Read configuration file, then open connection to Redis
load_config_file();



// ---------------------------------------------------------------------------------------------
// Check that the authorisation key is valid
// ---------------------------------------------------------------------------------------------
function admin_server () {
	var options, server;

	// Create the server
	if (Object.keys(admin.ssl).length > 0) {
		log('ADM001', ['HTTPS']);
		options = {
			ca: fs.readFileSync(admin.ssl.ca),
			cert: fs.readFileSync(admin.ssl.cert),
			key: fs.readFileSync(admin.ssl.key)
		};
		server = https.createServer(options);
	}
	else {
		log('ADM001', ['HTTP']);
		server = http.createServer();
	}

	// Start listening on the port
	server.listen(admin.port, function () {
		log('ADM002', [admin.port]);
	});

	// Listen for requests from admin users
	server.on('request', function (request, response) {
		var session = {}, url, msg, flds, str;

		// Intialise the session object
		session.id = shortid.generate();
		session.start = moment();
		session.response = response;

		// Split URL into an array with the path [0] and command parameters [1]
		url = request.url.split('?');

		// Stop if no command parameters have been provided
		if (url.length !== 2) {
			msg = log('ADM039', []);
			send_response(session, msg);
			return;
		}

		// Extract command name from path
		flds = url[0].split('/');
		if (flds.length !== 3) {
			msg = log('ADM029', []);
			send_response(session, msg);
			return;
		}
		session.command = flds[2];

		// Clean up command parameters (JSON format)
		str = url[1].replace(/%22/g, '"');
		str = str.replace(/%20/g," ");
		str = str.replace(/%7B/g,"{");
		str = str.replace(/%7D/g,"}");

		// Load parameters into an object and run the request
		try {
			session.params = JSON.parse(str);
			log('ADM030', [str]);
			run_request(session);
		}
		// JSON format error
		catch (err) {
			msg = log('ADM031', [err.message, str]);
			send_response(session, msg);
			return;
		}

		// Fire when request completes
		request.on('end', function (request, response) { // TIMING IN LOGS ???????????????????????????????????????
			log('ADM003', [session.id]);
		});
	});

	// Catch errors creating the socket
	server.on('error', function(err) {
		if (err.errno === 'EADDRINUSE') {
			log('ADM004', [admin.port]);
		}
		else {
			log('ADM005', [err.syscall, err.errno]);
		}

		// Close database connection
		mongoDB.close();
	});

	// Close database connection when server closes
	server.on('close', function(err) {
		mongoDB.close();
	});
}



// ---------------------------------------------------------------------------------------
// Create a JSON web token for the user, who will include it in the message header when
// sending messages to the API
//
// Argument 1 : Session object
// Argument 2 : Object holding user's details
// Argument 3 : Function to be called after JWT has been created
// ---------------------------------------------------------------------------------------
function jwt_create (session, user, callback) {
	var	access = {};

	// Read connector name and type of service for all connectors for user's company
	mongoDB.collection('connector').find({"company":user.company},{"name":1,"service":1}).toArray( function(err, result) {
		var connectors = {}, i;

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM024', ['connector', err]);
			send_response(session, msg);
		}
		else {
			// Create object linking connector to service, then read user's packages
			for (i=0; i<result.length; i++) {
				connectors[result[i].name] = result[i].service;
			}

			// Read the packages available to the user
			mongoDB.collection('package').find({"company":user.company,"name":{$in:user.packages}}).sort({"name":1, "command":1}).toArray( function(err, result) {
				var msg, access = {}, i, unique, pkg = [], cmd;

				// Error trying to retrieve data
				if (err) {
					msg = log('ADM024', ['package', err]);
					send_response(session, msg);
				}
				else {
					// User info to be included in token
					access.usr = user.username;
					access.org = user.company;
					access.ip4= user.clients;
					access.svc = [];

					// Add array of unique connector/service combinations to token
					for (i=0; i<result.length; i++) {
						unique = result[i].name + result[i].connector;
						if(pkg.indexOf(unique) === -1) {
							pkg.push(unique);
							access.svc.push({con:result[i].connector, svc:connectors[result[i].connector]});
						}
					}

					// Add commands to token
					access.cmd = {};
					for (i=0; i<result.length; i++) {
						cmd = result[i].command;
						access.cmd[cmd] = {};
						access.cmd[cmd].s = pkg.indexOf(result[i].name + result[i].connector);
						access.cmd[cmd].c = result[i].version.cmd;
						access.cmd[cmd].p = result[i].version.prms;
					}

					// Use access data to create token
					user.jwt = jwt.sign(access, admin.jwtSecret, { "noTimestamp":true });

					// Run the callback function
					callback(session, user);
				}
			});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read the configuration file to locate the Redis database to be used
// ---------------------------------------------------------------------------------------------
function load_config_file () {
	var buffer, line;

	// Read the configuration file
	buffer = fs.readFileSync(__dirname + '/config.json');
	admin = JSON.parse(buffer.toString());

	// Start new log file
	line = moment().format('YYYY/MM/DD HH:mm:ss.SSS') + ' Started\n';
	fs.writeFile(admin.log, line, function (err) {
		if (err) {
			console.error('admin.log: Could not write admin console log message to ' + file);
		}
	});

	// Open a connection to MongoDB
	// $USER:$PASS@$HOST/$DATA?ssl=true\&replicaSet=$RSET\&authSource=$AUTH
	admin.mongo.url = 'mongodb://' + admin.mongo.username + ':' + admin.mongo.password +
					  '@' + admin.mongo.host + '/' + admin.mongo.database +
					  '?ssl=true&replicaSet=' + admin.mongo.replicaset +
					  '&authSource=' + admin.mongo.authdb;

	open_mongo();

	// Redis access details
/*	options.host = config.redis.host;
	options.port = config.redis.port;

	// Open a connection to the Redis server
	redisClient = redis.createClient(options);

	// Connected OK
	redisClient.on('connect', function() {
		load();
	});

	// Error accessing Redis
	redisClient.on('error', function (err) {
		log_error("load_config_file", "Error accessing Redis: " + err.message);
	});*/
}



// ---------------------------------------------------------------------------------------------
// Start the load processes
// ---------------------------------------------------------------------------------------------
/*function load () {
	var ssl_ok = false;

	// Read data from Redis
	admin.mq = {};
	redisClient.hget('admin', 'logfile', saveAdmin);
	redisClient.hgetall('adminPorts', saveAdminPorts);
	redisClient.hget('jwt', 'secret', saveJwt);
	redisClient.hgetall('messages', saveMessages);
	redisClient.hgetall('mongo', saveMongo);
	redisClient.hgetall('mq', saveMq);
	redisClient.hgetall('ssl', saveSsl);

	function saveAdmin (err, result) {
	admin.log = result;
		check();
	}

	function saveAdminPorts (err, result) {
		admin.liveFeed = result.livefeed;
		admin.server = result.server;
		check();
	}

	function saveJwt (err, result) {
		admin.jwtSecret = result;
		check();
	}

	function saveMessages (err, result) {
		var regexp, keys, i;
		regexp = new RegExp('^ADM');
		admin.messages = {};
		keys = Object.keys(result);
		for (i=0; i<keys.length; i++) {
			if (keys[i].search(regexp) === 0) {
				admin.messages[keys[i]] = JSON.parse(result[keys[i]]);
			}
		}
		check();
	}

	function saveMongo (err, result) {
		admin.mongo = result;
		check();
	}

	function saveMq (err, result) {
		admin.mq = {
			host: result.host,
			event: result.event2console,
			notify: result.console2api
		};
		check();
	}

	function saveSsl (err, result) {
		if (result !== null) {
			admin.ssl = {
				ca: fs.readFileSync(result.ca, 'utf8'),
				cert: fs.readFileSync(result.cert, 'utf8'),
				key: fs.readFileSync(result.key, 'utf8')
			};
		}
		ssl_ok = true;
		check();
	}

	// Continue if all data returned
	function check () {
		if (admin.jwtSecret && admin.log && admin.messages && admin.mongo && admin.mq && admin.server && ssl_ok) {
			open_mongo();
		}
	}
}*/



// ---------------------------------------------------------------------------------------------
// Log a message from the admin console to file
//
// Argument 1 : Code of the message
// Argument 2 : Array of parameters to be substituted
//
// Return a response message object
//				result.status	= 0=error, 1=info
//				result.code		= Message code
//				result.text		= Message text
// ---------------------------------------------------------------------------------------------
function log (code, params) {
	var message, text, i, line, file, res = {};

	// Skip if message level is under the configured level
	message = admin.messages[code];
	if (message === undefined) {
		message = {
			"type": 'error',
			"code": code,
			"module": 'admin',
			"function": 'log',
			"internal": 'Message has not been defined'
		}
	}

	// Find message and substitute parameters
	text = message.internal;
	if (params.length > 0) {
		for (i=0; i<params.length; i++) {
			text = text.replace(new RegExp('_p'+(1+i),'g'), params[i]);
		}
	}

	// Build message
	line = moment().format('YYYY/MM/DD HH:mm:ss.SSS');
	line += ' [' + code + '] ' + message.module + '.' + message.function;
	line += ' (' + message.type + ') ' + text + '\n';

	// Append to log file
//	file = __dirname + '/' + admin.log;
	file = admin.log;
	fs.appendFile(file, line, function (err) {
		if (err) {
			console.error('admin.log: Could not write admin console log message to ' + file);
		}
	});

	// Message to be returned to the client
	res.result = {};
	res.result.status = (message.type === 'error') ? 0 : 1;
	res.result.code = code;
	res.result.text = text;
	return res;
}



// ---------------------------------------------------------------------------------------------
// Log an error message that has been raised before the Tracker module has been loaded
//
// Argument 1 : Function called from
// Argument 2 : Message text
// ---------------------------------------------------------------------------------------------
function log_error (fn, msg) {
	console.error('[' + fn + '] ' + msg);
}



// ---------------------------------------------------------------------------------------------
// Send a notification message to the API interface that data has changed
//
// Argument 1 : Notification message
//      {item:xxx, action:xxx}
// ---------------------------------------------------------------------------------------------
function notify_interface (message) {
	// If channel is open, send notification message
/*	if (admin.mq.notifyChannel) {
		admin.mq.notifyChannel.sendToQueue(admin.mq.notify, new Buffer(JSON.stringify(message), 'utf-8'), { persistent: true });
	}
	else {
		log('ADM036', [admin.mq.notify]);
	}*/
}



// ---------------------------------------------------------------------------------------------
// Connect to the Mongo database
// ---------------------------------------------------------------------------------------------
function open_mongo () {
	var options = {};

	// Connect to Mongo Atlas
	mongo.connect(admin.mongo.url, function(err, db) {
		if (err) {
			log('ADM017', [admin.mongo.url, err.message]);
		}
		else {
			// Save the database pointer for later use
			mongoDB = db;

			// Open a server that emits usage data
//			open_usage_publish();

			// Connect to RabbitMQ
//			rabbit_connect();

			// Start the admin server and accept connections
			admin_server();
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Open a server that emits usage data
// ---------------------------------------------------------------------------------------------
/*function open_usage_publish () {
	var server, socket;

	// Create an HTTPS server from which to emit usage data
	server = https.createServer(admin.ssl);

	// Open a port on which the web_monitor can publish updated usage data
	server.listen(admin.liveFeed, function () {
		log('ADM032', [admin.liveFeed]);
	});

	// Attach a socket to the HTTPS server
	socket = io.listen(server);

	// When attached, emit a socket ready message
	socket.on('connection', function(sock) {
		sock.emit('connect', {'message':'Tracker server ready'});
		// Save the web socket object for later use
		webSocket = sock;
	});

	// Errors
	socket.on('error', function() {
		log_error("open_usage_publish", "Socket.IO reported a generic error");
	});
}*/



// ---------------------------------------------------------------------------------------------
// Connect to the RabbitMQ server
// ---------------------------------------------------------------------------------------------
/*function rabbit_connect () {
	amqp.connect(admin.mq.host, function(err, conn) {
		if (err) {
			log_error("rabbit_connect", "Can't connect to RabbitMQ: " + err.message);
		}
		// Open a queues
		else {
			// Listen for incoming log messages from a RabbitMQ queue
			rabbit_log_listener(conn);

			// Send change notifications to a RabbitMQ queue
			rabbit_notifications(conn);
		}
	});
}*/



// ---------------------------------------------------------------------------------------------
// Listen for incoming log messages from a RabbitMQ queue
//
// Argument 1 : RabbitMQ connection object
//
// Message object format
//		action.timestamp	= Timestamp of action including milliseconds
//		action.pid			= Process ID
//		action.sid			= Session ID
//		action.connector	= Connector name
//		action.server		= Server name
//		action.username		= User name
//		action.command		= Command being run
//		action.type			= Type of message (error/info)
//		action.module		= Module name
//		action.fn			= Function name
//		action.code			= Message code
//		action.text			= Message text
//		tx.num				= Number of interactions in this transaction
//		tx.recs				= Number of records returned to caller: SQL,DML
//		tx.vol				= Amount of data (bytes) returned to caller: SQL,DML
// ---------------------------------------------------------------------------------------------
/*function rabbit_log_listener (conn) {
	conn.createChannel(function(err, ch) {
		if (err) {
			log_error("rabbit_log_listener", "Can't open RabbitMQ channel: " + err.message);
		}
		else {
			// Ensure the queue won't be lost even if RabbitMQ restarts
			ch.assertQueue(admin.mq.event, {durable: true});

			// Tell RabbitMQ not to send next message until we acknowledge previous one
			ch.prefetch(1);

			// On receipt of message, write to event and usage collections
			// Message acknowledgment enabled for load balancing
			// Argument 1 : Message object in buffer format
			ch.consume(admin.mq.event, function(message) {
				// Convert message back to object
				var usage = {},
					msg = JSON.parse(message.content.toString()),
					ts = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');

				// If transaction stats present, increment usage stats and add to action document
				if (webSocket && msg.tx !== undefined) {
					usage.server = msg.action.server;
					usage.connector = msg.action.connector;
					usage.username = msg.action.username;
					usage.command = msg.action.command;
					usage.time = ts.replace('T',' ');
					usage.tx = {};
					usage.tx.num = (msg.tx.num) ? parseInt(msg.tx.num) : 0;
					usage.tx.dur = (msg.tx.dur) ? parseInt(msg.tx.dur) : 0;
					usage.tx.vol = (msg.tx.vol) ? parseInt(msg.tx.vol) : 0;
					usage.tx.recs = (msg.tx.recs) ? parseInt(msg.tx.recs) : 0;
					webSocket.emit('usage', usage);
				}

				// Send acknowledgement to message server
				ch.ack(message);
			}, { noAck: false} );

			// Start the admin server and accept connections
			admin_server();
		}
	});
}*/



// ---------------------------------------------------------------------------------------------
// Create channel that sends change notifications to a RabbitMQ queue
//
// Argument 1 : RabbitMQ connection object
// ---------------------------------------------------------------------------------------------
/*function rabbit_notifications (conn) {
	conn.createChannel(function(err, ch) {
		if (err) {
			log_error("rabbit_notifications", "Can't open RabbitMQ channel: " + err.message);
		}
		else {
			// Save the channel object
			admin.mq.notifyChannel = ch;

			// Ensure the queue won't be lost even if RabbitMQ restarts
			ch.assertQueue(admin.mq.notify, {durable: true});
		}
	});
}*/



// ---------------------------------------------------------------------------------------------
// Package data in the correct response format
//
// Argument 1 : Data object
// ---------------------------------------------------------------------------------------------
function response_data (data) {
	var msg = {};
	msg.result = {};
	msg.result.status = 1;
	msg.data = {};
	msg.data = data;
	return msg;
}



// ---------------------------------------------------------------------------------------------
// Run the selected command
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function run_request (session) {
	var msg;

	switch (session.command) {
		case 'commandDelete':
			command_delete(session);
			break;
		case 'commandDeleteVersion':
			command_delete_version(session);
			break;
		case 'commandNew':
			command_new(session);
			break;
		case 'commandRead':
			command_read(session);
			break;
		case 'commandUpdate':
			command_update(session);
			break;
		case 'companyDelete':
			company_delete(session);
			break;
		case 'companyGroupDelete':
			company_group_delete(session);
			break;
		case 'companyGroupUpsert':
			company_group_upsert(session);
			break;
		case 'companyNew':
			company_new(session);
			break;
		case 'companyReadId':
			company_read(session, 'id');
			break;
		case 'companyRead':
			company_read(session, 'name');
			break;
		case 'companyUpdate':
			company_update(session);
			break;
		case 'connectorDelete':
			connector_delete(session);
			break;
		case 'connectorNew':
			connector_new(session);
			break;
		case 'connectorRead':
			connector_read(session);
			break;
		case 'connectorUpdate':
			connector_update(session);
			break;
		case 'connectorUpdateName':
			connector_update_name(session);
			break;
		case 'listPlans':
			list_plans(session);
			break;
		case 'listRoles':
			list_roles(session);
			break;
		case 'loginCheck':
			login_check(session);
			break;
		case 'packageDelete':
			package_delete(session);
			break;
		case 'packageNew':
			package_new(session);
			break;
		case 'packageRead':
			package_read(session);
			break;
		case 'packageRead1':
			package_read1(session);
			break;
		case 'packageUpdate':
			package_update(session);
			break;
		case 'report':
			report(session);
			break;
		case 'reportEventSummary':
			event_summary(session);
			break;
		case 'uiRead':
			ui_read(session);
			break;
		case 'userDelete':
			user_delete(session);
			break;
		case 'userNew':
			user_new(session);
			break;
		case 'userRead':
			user_read(session);
			break;
		case 'userUpdate':
			user_update(session);
			break;
		default:
			msg = log('ADM006', [session.command]);
			send_response(session, msg);
			break;
	}
}



// ---------------------------------------------------------------------------------------------
// Send the response to the client
//
// Argument 1 : Session object
// Argument 2 : Info in JSON format:  {result:{status:1,code:xxx,text:xxx}}
//              Error in JSON format: {result:{status:0,code:xxx,text:xxx}}
//              Data in JSON format:  {result:{status:1}, data:[{xxx},{yyy}]}
// ---------------------------------------------------------------------------------------------
function send_response (session, data) {
	var tx = {}, msg,
		response = session.response;

	// Set the headers in the response message
	response.setHeader('Content-Type', 'application/json');
	response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Allow-Methods', 'GET,POST');

	// Transaction information
	tx.num = 1;
	tx.dur = moment() - session.start;
	tx.vol = JSON.stringify(data).length;

	// Successful response
	if (data.result.status) {
		tx.recs = (data.data) ? data.data.length : 0;
		log('ADM027', [session.command], tx);
	}
	// Error response
	else {
		tx.recs = 1;
		log('ADM028', [session.command, data.result.code, data.result.text], tx);
	}

	// Response stsus is always success from an application point of view
	response.statusCode = 200;

	// Set status message in response header before data is sent
	msg = (data.status) ? '{"status":1}' : '{"status":0,"data":' + JSON.stringify(data.data) + '}';
	response.setHeader('API-Response', msg);

	// Write data/message to the response
	response.write(JSON.stringify(data));

	// Close the response
	response.end();
}



// *********************************************************************************************
// *********************************************************************************************
//
//		API CALLS
//
// *********************************************************************************************
// *********************************************************************************************

// *********************************************************************************************
//		COMMANDS
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a command document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function command_delete (session) {
	var	id;

	id = session.params['_id'];
	mongoDB.collection('command').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['command', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['command']);
			send_response(session, msg);
            notify_interface({"item":"command", "action":"delete"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Delete a version of a command or parameter from a command document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function command_delete_version (session) {
	var	id, ver, type;

	id = session.params.id;
    ver = session.params.ver;
    type = session.params.type;

    // Remove command version
    if (type === 'command') {
        mongoDB.collection('command').update({'_id':new mongo.ObjectID(id)}, {"$pull":{"command":{"ver":ver}}}, function(err, result) {
    		var msg = {};

    		// Error trying to insert data
    		if (err) {
    			msg = log('ADM037', [type, err]);
    			send_response(session, msg);
    		}
    		// Return result
    		else {
    			msg = log('ADM038', [type]);
    			send_response(session, msg);
                notify_interface({"item":"command", "action":"update"});
    		}
    	});
    }
    // Remove parameter version
    else {
        mongoDB.collection('command').update({'_id':new mongo.ObjectID(id)}, {"$pull":{"parameters":{"ver":ver}}}, function(err, result) {
    		var msg = {};

    		// Error trying to insert data
    		if (err) {
    			msg = log('ADM037', [type, err]);
    			send_response(session, msg);
    		}
    		// Return result
    		else {
    			msg = log('ADM038', [type]);
    			send_response(session, msg);
                notify_interface({"item":"command", "action":"update"});
    		}
    	});
    }
}



// ---------------------------------------------------------------------------------------------
// Add a command document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function command_new (session) {
	var	data = {};

	// Extract data to be added
	data.company = session.params.company;
	data.name = session.params.name;
	data.service = session.params.service;
	data.command = session.params.command;
	data.parameters = session.params.parameters;

	// Insert document
	mongoDB.collection('command').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['command', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['command']);
			send_response(session, msg);
            notify_interface({"item":"command", "action":"new"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all command documents for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function command_read (session) {
    var filter;

    // Read filter to be applied
	filter = { "company" : session.params.filter };

	// Run query
	mongoDB.collection('command').find(filter).sort({'name':1,'service':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['command', err]);
			send_response(session, msg);
		}
		// Return all command data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a command document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function command_update (session) {
	var	docid;

	// Extract then remove Mongo document ID from object
	docid = session.params._id;
	delete session.params._id;

	// Update document
	mongoDB.collection('command').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:session.params}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['command', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['command']);
			send_response(session, msg);
            notify_interface({"item":"command", "action":"update"});
		}
	});
}



// *********************************************************************************************
//		COMPANIES
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a company document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function company_delete (session) {
	var	id;

	id = session.params['_id'];
	mongoDB.collection('company').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['company', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['company']);
			send_response(session, msg);
            notify_interface({"item":"company", "action":"delete"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Delete a company group
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function company_group_delete (session) {
	var	group, data = {}, docid;

	// Extract data to be updated
    group = "groups." + session.params.name;
	data[group] = 1;
	docid = session.params.id;

	// Update document
	mongoDB.collection('company').updateOne({'_id':new mongo.ObjectID(docid)}, {$unset:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			send_response(session, msg);
            notify_interface({"item":"company", "action":"update"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Insert or update a company group
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function company_group_upsert (session) {
	var	group, data = {}, docid;

	// Extract data to be updated
    group = "groups." + session.params.name;
	data[group] = {};
    data[group].description = session.params.desc;
    data[group].plan = session.params.plan;
	docid = session.params.id;

	// Update document
	mongoDB.collection('company').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			send_response(session, msg);
            notify_interface({"item":"company", "action":"update"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Add a company document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function company_new (session) {
	var	data = {};

	// Extract data to be added
	data.name = session.params.name;
	data.groups= session.params.groups;

	// Insert document
	mongoDB.collection('company').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['company', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['company']);
			send_response(session, msg);
            notify_interface({"item":"company", "action":"new"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all company documents
//
// Argument 1 : Session object
// Argument 2 : Attribute to be filtered (name|id)
// ---------------------------------------------------------------------------------------------
function company_read (session, attr) {
	var	filter;

	// Read filter to be applied
	if (attr === 'name') {
		filter = (session.params.filter === 'all') ? {} : {"name":session.params.filter};
	}
	else {
		filter = (session.params.filter === 'all') ? {} : {"_id":new mongo.ObjectID(session.params.filter)};
	}

	// Run query
	mongoDB.collection('company').find(filter).sort({'name':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['company', err]);
			send_response(session, msg);
		}
		// Return all company data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a company document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function company_update (session) {
	var	data = {}, docid;

	// Extract data to be updated
	data.name = session.params.name;
	data.groups= session.params.groups;
	docid = session.params.id;

	// Update document
	mongoDB.collection('company').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			send_response(session, msg);
            notify_interface({"item":"company", "action":"update"});
		}
	});
}



// *********************************************************************************************
//		CONNECTORS
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a connector document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function connector_delete (session) {
	var	id;

	id = session.params['_id'];
	mongoDB.collection('connector').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['connector', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['connector']);
			send_response(session, msg);
            notify_interface({"item":"connector", "action":"delete"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Add a connector document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function connector_new (session) {
	var	data = {};

	// Extract data to be added
	data.company = session.params.company;
	data.name = session.params.name;
	data.service = session.params.service;

	// Insert document
	mongoDB.collection('connector').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['connector', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['connector']);
			send_response(session, msg);
            notify_interface({"item":"connector", "action":"new"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all connector documents for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function connector_read (session) {
	var	filter;

	// Read filter to be applied
	filter = { "company" : session.params.filter };

	// Run query
	mongoDB.collection('connector').find(filter).sort({'name':1,'service':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['connector', err]);
			send_response(session, msg);
		}
		// Return all connector data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a connector document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function connector_update (session) {
	var	docid;

	// Extract data to be updated
	docid = session.params.id;

	// Update document
	mongoDB.collection('connector').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:{"name":session.params.name, "config":session.params.config}}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['connector', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['connector']);
			send_response(session, msg);
            notify_interface({"item":"connector", "action":"update"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update the name of a connector
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function connector_update_name (session) {
	// Update document
	mongoDB.collection('connector').update({"company":session.params.company,"name":session.params.name},{$set:{"name":session.params.newname}}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['connector', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['connector']);
			send_response(session, msg);
            notify_interface({"item":"connector", "action":"update"});
		}
	});
}



// *********************************************************************************************
//		EVENTS
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Generate the event summary report
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function event_summary (session) {
	var	date, time, patt_date, patt_time, start;

    // Read arguments and use last 30 mins if not provided
    // [1] Date YY-MM-DD [2] Time HH24:MI
    date = session.params.date || moment().format('YY-MM-DD');
    time = session.params.time || moment(moment().subtract(30, 'minutes')).format('HH:mm');

    // Validate and format the date and time
    patt_date = new RegExp('(16|17)-(01|02|03|04|05|06|07|08|09|10|11|12)-[0-3][0-9]');
    patt_time = new RegExp('[0-2][0-9]:[0-5][0-9]');
    if (!patt_date.test(date)) {
        msg = log('ADM033', [date]);
        send_response(session, msg);
    }
    else {
    	if (!patt_time.test(time)) {
            msg = log('ADM034', [time]);
            send_response(session, msg);
    	}
    	else {
    		// Start timestamp: '2016-11-20T14:00:00'
    		start = new Date('20' + date + 'T' + time + ':00');

            // Read the recent events
        	mongoDB.collection('event').find({timestamp:{$gte:start}}).sort({timestamp:-1}).toArray( function(err, result) {
        		var msg, i, sessions = {}, codes = [], data = {};
        		if (err) {
                    msg = log('ADM035', ['event', err.message]);
        			send_response(session, msg);
        		}
        		else {
                    // Summarise the data and generate a unique list of message codes
        			for (i=0; i<result.length; i++) {
        				// Save session summary
        				if (sessions[result[i].sid] === undefined) {
        					sessions[result[i].sid] = {};
        				}
        				if (sessions[result[i].sid][result[i].code] === undefined) {
        					sessions[result[i].sid][result[i].code] = 0;
        				}
        				sessions[result[i].sid][result[i].code]++;

        				// Save a unique list of codes
        				if (codes.indexOf(result[i].code) === -1) {
        					codes.push(result[i].code);
        				}
        			}
                    data.header = codes.sort();
                    data.body = sessions;

                    // Format the response message
                    msg = response_data(data);
                    send_response(session, msg);
        		}
            });
        }
    }
}



// *********************************************************************************************
//		PACKAGES
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a package document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function package_delete (session) {
	var	id = session.params['_id'];

	mongoDB.collection('package').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['package', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['package']);
			send_response(session, msg);
            notify_interface({"item":"package", "action":"delete"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Add a package document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function package_new (session) {
	// Insert document
	mongoDB.collection('package').insertOne(session.params, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['package', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['package']);
			send_response(session, msg);
            notify_interface({"item":"package", "action":"new"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all package documents for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function package_read (session) {
	var	filter;

	// Read filter to be applied
	filter = { "company" : session.params.filter };

	// Run query
	mongoDB.collection('package').find(filter).sort({'name':1,'command':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['package', err]);
			send_response(session, msg);
		}
		// Return all package data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read 1 package document for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function package_read1 (session) {
	// Run query
	mongoDB.collection('package').find({'_id':new mongo.ObjectID(session.params.id)}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['package', err]);
			send_response(session, msg);
		}
		// Return all package data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a package document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function package_update (session) {
	var	docid;

	// Extract then remove Mongo document ID from object
	docid = session.params.id;
	delete session.params.id;

	// Update document
	mongoDB.collection('package').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:session.params}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['package', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['package']);
			send_response(session, msg);
            notify_interface({"item":"package", "action":"update"});
		}
	});
}



// *********************************************************************************************
//		USERS
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a user document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function user_delete (session) {
	var	id;

	id = session.params['_id'];
	mongoDB.collection('user').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['user', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['user']);
			send_response(session, msg);
            notify_interface({"item":"user", "action":"delete"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Add a user document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function user_new (session) {
	var	data = {};

	// Extract data to be added
	data.clients = session.params.clients;
	data.packages = session.params.packages;
	data.company = session.params.company;
	data.group = session.params.group;
	data.password = session.params.password;
	data.role = session.params.role;
	data.username = session.params.username;

    // Generate JSON web token
	jwt_create(session, data, user_new_jwt);
}

function user_new_jwt (session, data) {
	// Insert document
	mongoDB.collection('user').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['user', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['user']);
			send_response(session, msg);
            notify_interface({"item":"user", "action":"new"});
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all user documents for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function user_read (session) {
	var	filter;

	// Read filter to be applied
	filter = { "company" : session.params.filter };

	// Run query
	mongoDB.collection('user').find(filter).sort({'username':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['user', err]);
			send_response(session, msg);
		}
		// Return all user data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a user document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function user_update (session) {
	var	data = {};

	// Extract data to be updated
	data.clients = session.params.clients;
	data.packages = session.params.packages;
	data.company = session.params.company;
	data.group = session.params.group;
    data.id = session.params.id;
	data.password = session.params.password;
	data.role = session.params.role;
	data.username = session.params.username;

	// Generate JSON web token
	jwt_create(session, data, user_update_jwt);
}

function user_update_jwt (session, data) {
	var	docid;

	// Extract then remove Mongo document ID from object
	docid = data.id;
	delete data.id;

	// Update document
	mongoDB.collection('user').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to update data
		if (err) {
			msg = log('ADM012', ['user', err]);
			send_response(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['user']);
			send_response(session, msg);
            notify_interface({"item":"user", "action":"update"});
		}
	});
}



// *********************************************************************************************
//		MISCELLANEOUS FUNCTIONS
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Read list of plans
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function list_plans (session) {
	mongoDB.collection('plan').find().sort({'name':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM020', [err.message]);
			send_response(session, msg);
		}
		// Return data
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Return a list of roles
// TODO Where this comes from has yet to be decided
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function list_roles (session) {
	var data = [], msg = {};

    data.push({"code":"superuser", "name":"Super User", "level":1});
    data.push({"code":"manager", "name":"Manager", "level":2});
    data.push({"code":"user", "name":"User", "level":3});

    msg = response_data(data);
	send_response(session, msg);
}



// ---------------------------------------------------------------------------------------------
// Check the supplied login credientials against the user collection
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function login_check (session) {
	// Check whether user exists
	mongoDB.collection('user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM018', ['user', err]);
			send_response(session, msg);
		}
		// Check that only 1 user was returned
		else {
			if (data.length === 1) {
				login_group_users(session, data[0]);
			}
			else {
				msg = log('ADM022', []);
				send_response(session, msg);
			}
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all users in the same group as this user
//
// Argument 1 : Session object
// Argument 2 : User credentials object from login call
// ---------------------------------------------------------------------------------------------
function login_group_users (session, user) {
	// Read all users in the same company group as this user
	mongoDB.collection('user').find({"company":user.company,"group":user.group},{"username":1,"_id":-1}).toArray( function(err, data) {
		var msg = {}, i, grps = [];

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM021', ['user', err]);
			send_response(session, msg);
		}
		// Return all user data
		else {
			msg.result = {};
			msg.result.status = (Object.keys(data).length > 0) ? 1 : 0;
			msg.data = {};
			// Add user credentials from login query
			msg.data = user;
			// Add an array of users in this group
			for (i=0; i<data.length; i++) {
				grps.push(data[i].username);
			}
			msg.data.groupusers = grps;
			send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Run an internal API administration report
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function report (session) {
	var	colln, filter, filter_obj = {}, flds, seq, max, msg;

	// Assign default values
	colln = session.params.collection;
	filter = (session.params.filter) ? session.params.filter : {};
	flds = (session.params.fields) ? session.params.fields : {};
	seq = (session.params.order) ? session.params.order : {};
	max = (session.params.limit) ? parseInt(session.params.limit) : 10000;

	// Parse the filter statement for items that can't be passed in via an object
	try {
		filter_obj = JSON.parse(filter)
		report_filter_parse(filter_obj);
	}
	catch (err) {
		msg = log('ADM014', [err]);
		send_response(session, msg);
		return;
	}

	// Run the query
	mongoDB.collection(colln).find(filter_obj,flds).sort(seq).limit(max).toArray(function (err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM015', [colln, err]);
            send_response(session, msg);
		}
		// Return data
		else {
			log('ADM016', [session.command]);
            msg = response_data(data);
            send_response(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Parse the filter statement for items that can't be passed in via an object
//		Change 'ISODate(...)' string to a true date using to 'new Date'
//		If $REGEX found, convert value delimiters from "..." to /.../
//		If using Mongo $ functions, delimit with quotes (e.g. "$in")
//
// Argument 1 : Filter statement as a string, but formatted as a JSON object
// ---------------------------------------------------------------------------------------------
function report_filter_parse (obj) {
	var keys, i, arr, value;

	// Loop through each element in the object
	keys = Object.keys(obj);
	for (i=0; i<keys.length; i++) {
		// If nested object found, recurse through it
		if (typeof(obj[keys[i]]) === 'object') {
			report_filter_parse(obj[keys[i]]);
		}
		else {
			// Skip true/false, undefined and empty values
			if (!(obj[keys[i]] === true ||
				  obj[keys[i]] === false ||
				  obj[keys[i]] === undefined ||
				  obj[keys[i]] === "")) {
				// If ISODate found, convert value to true date
				if (obj[keys[i]].match('ISODate') !== null) {
					// Split on '(' then remove trailing ')'
					arr = obj[keys[i]].split(/\(/);
					value = arr[1].replace(')','');
					obj[keys[i]] = new Date(value);
				}
				// If $REGEX found, convert value delimiters from "..." to /.../
				if (keys[i].match('$regex') !== null) {
					obj[keys[i]] = obj[keys[i]].replace('"','/');
				}
			}
		}
	}
}



// ---------------------------------------------------------------------------------------------
// Read all UI documents
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function ui_read (session) {
    mongoDB.collection('ui').find({'access':{$in:[session.params.role]}}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM019', [session.params.role, err]);
			send_response(session, msg);
		}
		// Return all UI documents
		else {
            msg = response_data(data);
			send_response(session, msg);
		}
	});
}
