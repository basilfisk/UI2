/**
 * @file command.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for commands handled by the administration server.
 */

/**
 * @namespace CommandCalls
 * @author Basil Fisk
 * @description API calls for commands handled by the administration server.
 */
class CommandCalls {
	constructor () {
		// empty
	}


	/**
	 * @method commandDelete
	 * @memberof CommandCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a command document.
	 */
	commandDelete (that, session) {
		var	id;
	
		id = session.params['_id'];
		that.mongoDB.db(that.admin.mongo.db).collection('va_command').deleteOne({'_id':new mongo.ObjectID(id)}, (err, result) => {
			var msg = {};
	
			// Error trying to insert data
			if (err) {
				msg = that.log('ADM007', ['command', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM008', ['command']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method commandDeleteVersion
	 * @memberof CommandCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a version of a command or parameter from a command document.
	 */
	commandDeleteVersion (that, session) {
		var	id, ver, type;
	
		id = session.params.id;
		ver = session.params.ver;
		type = session.params.type;
	
		// Remove command version
		if (type === 'command') {
			that.mongoDB.db(that.admin.mongo.db).collection('va_command').update({'_id':new that.mongo.ObjectID(id)}, {"$pull":{"command":{"ver":ver}}}, (err, result) => {
				var msg = {};
	
				// Error trying to insert data
				if (err) {
					msg = that.log('ADM037', [type, err.message]);
					that.sendResponse(session, msg);
				}
				// Return result
				else {
					msg = that.log('ADM038', [type]);
					that.sendResponse(session, msg);
				}
			});
		}
		// Remove parameter version
		else {
			that.mongoDB.db(that.admin.mongo.db).collection('va_command').update({'_id':new that.mongo.ObjectID(id)}, {"$pull":{"parameters":{"ver":ver}}}, (err, result) => {
				var msg = {};
	
				// Error trying to insert data
				if (err) {
					msg = that.log('ADM037', [type, err.message]);
					that.sendResponse(session, msg);
				}
				// Return result
				else {
					msg = that.log('ADM038', [type]);
					that.sendResponse(session, msg);
				}
			});
		}
	}


	/**
	 * @method commandNew
	 * @memberof CommandCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Add a command document.
	 */
	commandNew (that, session) {
		var	data = {};
	
		// Extract data to be added
		data.company = session.params.company;
		data.name = session.params.name;
		data.service = session.params.service;
		data.command = session.params.command;
		data.parameters = session.params.parameters;

		// Insert document
		that.mongoDB.db(that.admin.mongo.db).collection('va_command').insertOne(data, (err, result) => {
			var msg = {};
	
			// Error trying to insert data
			if (err) {
				msg = that.log('ADM009', ['command', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM010', ['command']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method commandRead
	 * @memberof CommandCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all command documents for a company.
	 */
	commandRead (that, session) {
		var filter;
	
		// Read filter to be applied
		filter = { "company" : session.params.filter };
	
		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_command').find(filter).sort({'name':1,'service':1}).toArray( (err, data) => {
			var msg = {};
	
			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM011', ['command', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all command data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method commandUpdate
	 * @memberof CommandCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update a command document.
	 */
	commandUpdate (that, session) {
		var	docid;
	
		// Extract then remove Mongo document ID from object
		docid = session.params._id;
		delete session.params._id;
	
		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_command').updateOne({'_id':new that.mongo.ObjectID(docid)}, {$set:session.params}, (err, result) => {
			var msg = {};
	
			// Error trying to insert data
			if (err) {
				msg = that.log('ADM012', ['command', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM013', ['command']);
				that.sendResponse(session, msg);
			}
		});
	}
}

module.exports = CommandCalls;
