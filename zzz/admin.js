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

var	fs = require('fs'),
	http = require('http'),
	https = require('https'),
	jwt = require('jsonwebtoken'),
	moment = require('moment'),
	mongo = require('mongodb').MongoClient,
	shortid = require('shortid'),
	admin = {}, mongoDB;

// Trap any uncaught exceptions
// Write error stack to STDERR, then exit process as state may be inconsistent
process.on('uncaughtException', function(err) {
	console.error('ERROR TRAPPED (admin): ' + moment().format('YYYY/MM/DD HH:mm:ss.SSS'));
	console.error(err.stack);
	process.exit(-1);
});

// Read configuration file, then open connection to Redis
loadConfigFile();



// ---------------------------------------------------------------------------------------------
// Check that the authorisation key is valid
// ---------------------------------------------------------------------------------------------
function adminServer () {
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
			sendResponse(session, msg);
			return;
		}

		// Extract command name from path
		flds = url[0].split('/');
		if (flds.length !== 3) {
			msg = log('ADM029', []);
			sendResponse(session, msg);
			return;
		}
		session.command = flds[2];

		// Clean up command parameters (JSON format)
		str = url[1].replace(/%22/g, '"');
		str = str.replace(/%20/g," ");
		str = str.replace(/%7B/g,"{");
		str = str.replace(/%7D/g,"}");

		// Load parameters into an object and run the request
//		try {
			session.params = JSON.parse(str);
			log('ADM030', [str]);
			runRequest(session);
/*		}
		// JSON format error
		catch (err) {
			msg = log('ADM031', [err.message, str]);
			sendResponse(session, msg);
			return;
		}
*/
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
function jwtCreate (session, user, callback) {
	var	access = {};

	// Read connector name and type of service for all connectors for user's company
	mongoDB.db(admin.mongo.db).collection('va_connector').find({"company":user.company},{"name":1,"service":1}).toArray( function(err, result) {
		var connectors = {}, i;

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM024', ['connector', err.message]);
			sendResponse(session, msg);
		}
		else {
			// Create object linking connector to service, then read user's bundles
			for (i=0; i<result.length; i++) {
				connectors[result[i].name] = result[i].service;
			}

			// Read the bundles available to the user
			mongoDB.db(admin.mongo.db).collection('va_bundle').find({"company":user.company,"name":{$in:user.bundles}}).sort({"name":1, "command":1}).toArray( function(err, result) {
				var msg, access = {}, i, unique, pkg = [], cmd;

				// Error trying to retrieve data
				if (err) {
					msg = log('ADM024', ['bundle', err.message]);
					sendResponse(session, msg);
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
function loadConfigFile () {
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
//					  '@' + admin.mongo.host + '/' + admin.mongo.database +
					  '@' + admin.mongo.host + '/' +
					  '?ssl=true&replicaSet=' + admin.mongo.replicaset +
					  '&authSource=' + admin.mongo.authdb;
	mongo.connect(admin.mongo.url, function(err, db) {
		if (err) {
			log('ADM017', [admin.mongo.url, err.message]);
		}
		else {
			// Save the database pointer for later use
			mongoDB = db;

			// Start the admin server and accept connections
			adminServer();
		}
	});
}



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
	var message, text, i, line, res = {};

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
	fs.appendFile(admin.log, line, function (err) {
		if (err) {
			console.error('admin.log: Could not write admin console log message to ' + admin.log);
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
// Bundle data in the correct response format
//
// Argument 1 : Data object
// ---------------------------------------------------------------------------------------------
function responseData (data) {
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
function runRequest (session) {
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
		case 'bundleDelete':
			bundle_delete(session);
			break;
		case 'bundleNew':
			bundle_new(session);
			break;
		case 'bundleRead':
			bundle_read(session);
			break;
		case 'bundleRead1':
			bundle_read1(session);
			break;
		case 'bundleUpdate':
			bundle_update(session);
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
			sendResponse(session, msg);
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
function sendResponse (session, data) {
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
	mongoDB.db(admin.mongo.db).collection('va_command').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['command', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['command']);
			sendResponse(session, msg);
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
        mongoDB.db(admin.mongo.db).collection('va_command').update({'_id':new mongo.ObjectID(id)}, {"$pull":{"command":{"ver":ver}}}, function(err, result) {
    		var msg = {};

    		// Error trying to insert data
    		if (err) {
    			msg = log('ADM037', [type, err.message]);
    			sendResponse(session, msg);
    		}
    		// Return result
    		else {
    			msg = log('ADM038', [type]);
    			sendResponse(session, msg);
    		}
    	});
    }
    // Remove parameter version
    else {
        mongoDB.db(admin.mongo.db).collection('va_command').update({'_id':new mongo.ObjectID(id)}, {"$pull":{"parameters":{"ver":ver}}}, function(err, result) {
    		var msg = {};

    		// Error trying to insert data
    		if (err) {
    			msg = log('ADM037', [type, err.message]);
    			sendResponse(session, msg);
    		}
    		// Return result
    		else {
    			msg = log('ADM038', [type]);
    			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_command').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['command', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['command']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_command').find(filter).sort({'name':1,'service':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['command', err.message]);
			sendResponse(session, msg);
		}
		// Return all command data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_command').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:session.params}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['command', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['command']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['company']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').updateOne({'_id':new mongo.ObjectID(docid)}, {$unset:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['company']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').find(filter).sort({'name':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return all company data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_company').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['company', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['company']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_connector').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['connector', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['connector']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_connector').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['connector', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['connector']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_connector').find(filter).sort({'name':1,'service':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['connector', err.message]);
			sendResponse(session, msg);
		}
		// Return all connector data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_connector').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:{"name":session.params.name, "config":session.params.config}}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['connector', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['connector']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_connector').update({"company":session.params.company,"name":session.params.name},{$set:{"name":session.params.newname}}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['connector', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['connector']);
			sendResponse(session, msg);
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
        sendResponse(session, msg);
    }
    else {
    	if (!patt_time.test(time)) {
            msg = log('ADM034', [time]);
            sendResponse(session, msg);
    	}
    	else {
    		// Start timestamp: '2016-11-20T14:00:00'
    		start = new Date('20' + date + 'T' + time + ':00');

            // Read the recent events
        	mongoDB.db(admin.mongo.db).collection('va_event').find({timestamp:{$gte:start}}).sort({timestamp:-1}).toArray( function(err, result) {
        		var msg, i, sessions = {}, codes = [], data = {};
        		if (err) {
                    msg = log('ADM035', ['event', err.message]);
        			sendResponse(session, msg);
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
                    msg = responseData(data);
                    sendResponse(session, msg);
        		}
            });
        }
    }
}



// *********************************************************************************************
//		BUNDLES
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Delete a bundle document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function bundle_delete (session) {
	var	id = session.params['_id'];

	mongoDB.db(admin.mongo.db).collection('va_bundle').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['bundle', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['bundle']);
			sendResponse(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Add a bundle document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function bundle_new (session) {
	// Insert document
	mongoDB.db(admin.mongo.db).collection('va_bundle').insertOne(session.params, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['bundle', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['bundle']);
			sendResponse(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read all bundle documents for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function bundle_read (session) {
	var	filter;

	// Read filter to be applied
	filter = { "company" : session.params.filter };

	// Run query
	mongoDB.db(admin.mongo.db).collection('va_bundle').find(filter).sort({'name':1,'command':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['bundle', err.message]);
			sendResponse(session, msg);
		}
		// Return all bundle data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Read 1 bundle document for a company
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function bundle_read1 (session) {
	// Run query
	mongoDB.db(admin.mongo.db).collection('va_bundle').find({'_id':new mongo.ObjectID(session.params.id)}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['bundle', err.message]);
			sendResponse(session, msg);
		}
		// Return all bundle data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
		}
	});
}



// ---------------------------------------------------------------------------------------------
// Update a bundle document
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function bundle_update (session) {
	var	docid;

	// Extract then remove Mongo document ID from object
	docid = session.params.id;
	delete session.params.id;

	// Update document
	mongoDB.db(admin.mongo.db).collection('va_bundle').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:session.params}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM012', ['bundle', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['bundle']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_user').deleteOne({'_id':new mongo.ObjectID(id)}, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM007', ['user', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM008', ['user']);
			sendResponse(session, msg);
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
	data.bundles = session.params.bundles;
	data.company = session.params.company;
	data.group = session.params.group;
	data.password = session.params.password;
	data.role = session.params.role;
	data.username = session.params.username;

    // Generate JSON web token
	jwtCreate(session, data, user_new_jwt);
}

function user_new_jwt (session, data) {
	// Insert document
	mongoDB.db(admin.mongo.db).collection('va_user').insertOne(data, function(err, result) {
		var msg = {};

		// Error trying to insert data
		if (err) {
			msg = log('ADM009', ['user', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM010', ['user']);
			sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_user').find(filter).sort({'username':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM011', ['user', err.message]);
			sendResponse(session, msg);
		}
		// Return all user data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
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
	data.bundles = session.params.bundles;
	data.company = session.params.company;
	data.group = session.params.group;
    data.id = session.params.id;
	data.password = session.params.password;
	data.role = session.params.role;
	data.username = session.params.username;

	// Generate JSON web token
	jwtCreate(session, data, user_update_jwt);
}

function user_update_jwt (session, data) {
	var	docid;

	// Extract then remove Mongo document ID from object
	docid = data.id;
	delete data.id;

	// Update document
	mongoDB.db(admin.mongo.db).collection('va_user').updateOne({'_id':new mongo.ObjectID(docid)}, {$set:data}, function(err, result) {
		var msg = {};

		// Error trying to update data
		if (err) {
			msg = log('ADM012', ['user', err.message]);
			sendResponse(session, msg);
		}
		// Return result
		else {
			msg = log('ADM013', ['user']);
			sendResponse(session, msg);
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
	mongoDB.db('qott').collection('plan').find().sort({'name':1}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM020', [err.message]);
			sendResponse(session, msg);
		}
		// Return data
		else {
            msg = responseData(data);
			sendResponse(session, msg);
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

    msg = responseData(data);
	sendResponse(session, msg);
}



// ---------------------------------------------------------------------------------------------
// Check the supplied login credientials against the user collection
//
// Argument 1 : Session object
// ---------------------------------------------------------------------------------------------
function login_check (session) {
	// Check whether user exists
	mongoDB.db(admin.mongo.db).collection('va_user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM018', ['user', err.message]);
			sendResponse(session, msg);
		}
		// Check that only 1 user was returned
		else {
			if (data.length === 1) {
				login_group_users(session, data[0]);
			}
			else {
				msg = log('ADM022', []);
				sendResponse(session, msg);
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
	mongoDB.db(admin.mongo.db).collection('va_user').find({"company":user.company,"group":user.group},{"username":1,"_id":-1}).toArray( function(err, data) {
		var msg = {}, i, grps = [];

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM021', ['user', err.message]);
			sendResponse(session, msg);
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
			sendResponse(session, msg);
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
		msg = log('ADM014', [err.message]);
		sendResponse(session, msg);
		return;
	}

	// Run the query
	mongoDB.db(admin.mongo.db).collection(colln).find(filter_obj,flds).sort(seq).limit(max).toArray(function (err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM015', [colln, err.message]);
            sendResponse(session, msg);
		}
		// Return data
		else {
			log('ADM016', [session.command]);
            msg = responseData(data);
            sendResponse(session, msg);
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
/*function ui_read (session) {
    mongoDB.db(admin.mongo.db).collection('ui').find({'access':{$in:[session.params.role]}}).toArray( function(err, data) {
		var msg = {};

		// Error trying to retrieve data
		if (err) {
			msg = log('ADM019', [session.params.role, err.message]);
			sendResponse(session, msg);
		}
		// Return all UI documents
		else {
            msg = responseData(data);
			sendResponse(session, msg);
		}
	});
}*/
