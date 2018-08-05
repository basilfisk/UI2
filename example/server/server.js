/**
 * @file server.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description Interface to the administration HTTPS server.
 */

/**
 * @namespace Server
 * @author Basil Fisk
 * @description Interface to the administration HTTPS server.
 */
class Server {
	constructor () {
		this.fs = require('fs');
		this.http = require('http');
		this.https = require('https');
		this.jwt = require('jsonwebtoken');
		this.moment = require('moment');
		this.mongo = require('mongodb').MongoClient;
		this.ObjectID = require('mongodb').ObjectID;
		this.shortid = require('shortid');
		this.BundleCalls = require(__dirname + '/calls/bundle.js');
		this.CommandCalls = require(__dirname + '/calls/command.js');
		this.CompanyCalls = require(__dirname + '/calls/company.js');
		this.ConnectorCalls = require(__dirname + '/calls/connector.js');
		this.GeneralCalls = require(__dirname + '/calls/general.js');
		this.ReportCalls = require(__dirname + '/calls/report.js');
		this.UserCalls = require(__dirname + '/calls/user.js');
		this.admin = {};
		this.mongoDB;
	}


	/**
	 * @method adminServer
	 * @memberof Server
	 * @description Start the administration server.
	 */
	adminServer () {
		var options, server;
	
		// Create the server
		if (Object.keys(this.admin.ssl).length > 0) {
			this.log('SVR001', ['HTTPS']);
			options = {
				ca: this.fs.readFileSync(this.admin.ssl.ca),
				cert: this.fs.readFileSync(this.admin.ssl.cert),
				key: this.fs.readFileSync(this.admin.ssl.key)
			};
			server = this.https.createServer(options);
		}
		else {
			this.log('SVR001', ['HTTP']);
			server = this.http.createServer();
		}
	
		// Start listening on the port
		server.listen(this.admin.port, () => {
			this.log('SVR002', [this.admin.port]);
		});
	
		// Listen for requests from admin users
		server.on('request', (request, response) => {
			var session = {}, url, msg, flds, str;
	
			// Initialize the session object
			session.id = this.shortid.generate();
			session.start = this.moment();
			session.response = response;
	
			// Split URL into an array with the path [0] and command parameters [1]
			url = request.url.split('?');
	
			// Stop if no command parameters have been provided
			if (url.length !== 2) {
				msg = this.log('SVR033', []);
				this.sendResponse(session, msg);
				return;
			}
	
			// Extract command name from path
			flds = url[0].split('/');
			if (flds.length !== 3) {
				msg = this.log('SVR025', []);
				this.sendResponse(session, msg);
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
				this.log('SVR026', [str]);
				this.runRequest(session);
			}
			// JSON format error
			catch (err) {
				msg = this.log('SVR027', [err.message, str]);
				this.sendResponse(session, msg);
				return;
			}

			// Fire when request completes
			request.on('end', (request, response) => {
				this.log('SVR003', [session.id]);
			});
		});
	
		// Catch errors creating the socket
		server.on('error', (err) => {
			if (err.errno === 'EADDRINUSE') {
				this.log('SVR004', [this.admin.port]);
			}
			else {
				this.log('SVR005', [err.syscall, err.errno]);
			}
	
			// Close database connection
			this.mongoDB.close();
		});
	
		// Close database connection when server closes
		server.on('close', (err) => {
			this.mongoDB.close();
		});
	}


	/**
	 * @method init
	 * @memberof Server
	 * @description Create a JSON web token for the user, who will include it
	 * in the message header when sending messages to the API.
	 */
	init () {
		var buffer, line, url;

		// Read the configuration file
		buffer = this.fs.readFileSync(__dirname + '/config.json');
		this.admin = JSON.parse(buffer.toString());
	
		// Start new log file
		line = this.moment().format('YYYY/MM/DD HH:mm:ss.SSS') + ' Started\n';
		this.fs.writeFile(this.admin.log, line, (err) => {
			if (err) {
				console.error('init: Could not write admin console log message to ' + file);
			}
		});
	
		// Open a connection to MongoDB
		// $USER:$PASS@$HOST/$DATA?ssl=true\&replicaSet=$RSET\&authSource=$AUTH
		url = 'mongodb://' + this.admin.mongo.username + ':' + this.admin.mongo.password +
						  '@' + this.admin.mongo.host + '/' +
						  '?ssl=true&replicaSet=' + this.admin.mongo.replicaset +
						  '&authSource=' + this.admin.mongo.authdb;
		this.mongo.connect(url, (err, db) => {
			if (err) {
				this.log('SVR017', [this.admin.mongo.url, err.message]);
			}
			else {
				// Save the database pointer for later use
				this.mongoDB = db;
	
				// Start the admin server and accept connections
				this.adminServer();
			}
		});
	}


	/**
	 * @method log
	 * @memberof Server
	 * @param {string} code Code of the message.
	 * @param {object} params Array of parameters to be substituted.
	 * @param {function} callback Function to be called after JWT has been created.
	 * @return {object} Return a response message object.
	 * status: 0=error, 1=info
	 * code:   Message code
	 * text:   Message text
	 * @description Log a message from the admin console to file.
	 */
	log (code, params) {
		var message, text, i, line, res = {};

		// Skip if message level is under the configured level
		message = this.admin.messages[code];
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
		line = this.moment().format('YYYY/MM/DD HH:mm:ss.SSS');
		line += ' [' + code + '] ' + message.module + '.' + message.function;
		line += ' (' + message.type + ') ' + text + '\n';

		// Append to log file
		this.fs.appendFile(this.admin.log, line, (err) => {
			if (err) {
				console.error('log: Could not write admin console log message to ' + this.admin.log);
			}
		});

		// Message to be returned to the client
		res.result = {};
		res.result.status = (message.type === 'error') ? 0 : 1;
		res.result.code = code;
		res.result.text = text;
		return res;
	}


	/**
	 * @method responseData
	 * @memberof Server
	 * @param {object} data Data object.
	 * @description Bundle data in the correct response format.
	 */
	responseData (data) {
		return {
			result: {
				status: 1,
			},
			data: data
		};
	}


	/**
	 * @method runRequest
	 * @memberof Server
	 * @param {object} session Session object.
	 * @description Run the selected command.
	 */
	runRequest (session) {
		var calls, found = true, msg;

		switch (session.command) {
			case 'bundleAdd':
			case 'bundleDelete':
			case 'bundleRead':
			case 'bundleRead1':
			case 'bundleUpdate':
				calls = new this.BundleCalls();
				break;
			case 'commandAdd':
			case 'commandDelete':
			case 'commandDeleteVersion':
			case 'commandRead':
			case 'commandUpdate':
				calls = new this.CommandCalls();
				break;
			case 'companyAdd':
			case 'companyDelete':
			case 'companyGroupDelete':
			case 'companyGroupUpsert':
			case 'companyRead':
			case 'companyReadId':
			case 'companyUpdate':
				calls = new this.CompanyCalls();
				break;
			case 'connectorAdd':
			case 'connectorDelete':
			case 'connectorRead':
			case 'connectorUpdate':
			case 'connectorUpdateName':
				calls = new this.ConnectorCalls();
				break;
			case 'listPlans':
			case 'listRoles':
				calls = new this.GeneralCalls();
				break;
			case 'report':
			case 'reportEventSummary':
				calls = new this.ReportCalls();
				break;
			case 'userAdd':
			case 'userDelete':
			case 'userLogin':
			case 'userRead':
			case 'userUpdate':
				calls = new this.UserCalls();
				break;
			default:
				msg = this.log('SVR006', [session.command]);
				this.sendResponse(session, msg);
				found = false;
		}

		if (found) {
			calls[session.command](this, session);
		}
	}


	/**
	 * @method sendResponse
	 * @memberof Server
	 * @param {object} session Session object.
	 * @param {object} data Response message in JSON format.
	 * Info:  {result:{status:1,code:xxx,text:xxx}}
	 * Error: {result:{status:0,code:xxx,text:xxx}}
	 * Data:  {result:{status:1}, data:[{xxx},{yyy}]}
	 * @description Send the response to the client.
	 */
	sendResponse (session, data) {
		var tx = {}, msg,
			response = session.response;

		// Set the headers in the response message
		response.setHeader('Content-Type', 'application/json');
		response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'GET,POST');

		// Transaction information
		tx.num = 1;
		tx.dur = this.moment() - session.start;
		tx.vol = JSON.stringify(data).length;

		// Successful response
		if (data.result.status) {
			tx.recs = (data.data) ? data.data.length : 0;
			this.log('SVR023', [session.command], tx);
		}
		// Error response
		else {
			tx.recs = 1;
			this.log('SVR024', [session.command, data.result.code, data.result.text], tx);
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
}

var vaAdmin = new Server();
vaAdmin.init();
