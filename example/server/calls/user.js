/**
 * @file user.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for users handled by the administration server.
 */

/**
 * @namespace UserCalls
 * @author Basil Fisk
 * @description API calls for users handled by the administration server.
 */
class UserCalls {
	constructor () {
		// empty
	}


	/**
	 * @method jwtCreate
	 * @memberof Server
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @param {object} user Object holding user's details.
	 * @param {function} callback Function to be called after JWT has been created.
	 * @description Create a JSON web token for the user, who will include it
	 * in the message header when sending messages to the API.
	 */
	jwtCreate (that, session, user, callback) {
		var	access = {};
	
		// Read connector name and type of service for all connectors for user's company
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').find({"company":user.company},{"name":1,"service":1}).toArray( (err, result) => {
			var connectors = {}, i;
	
			// Error trying to retrieve data
			if (err) {
				msg = that.log('SVR022', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			else {
				// Create object linking connector to service, then read user's bundles
				for (i=0; i<result.length; i++) {
					connectors[result[i].name] = result[i].service;
				}
	
				// Read the bundles available to the user
				that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').find({"company":user.company,"name":{$in:user.bundles}}).sort({"name":1, "command":1}).toArray( (err, result) => {
					var msg, access = {}, i, unique, pkg = [], cmd;
	
					// Error trying to retrieve data
					if (err) {
						msg = that.log('SVR022', ['bundle', err.message]);
						that.sendResponse(session, msg);
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
						user.jwt = that.jwt.sign(access, that.admin.jwtSecret, { "noTimestamp":true });
	
						// Run the callback function
						callback(session, user);
					}
				});
			}
		});
	}


	/**
	 * @method userDelete
	 * @memberof UserCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a user document.
	 */
	userDelete (that, session) {
		var	id;

		id = session.params['_id'];
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').deleteOne({'_id':new that.ObjectID(id)}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR007', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR008', ['user']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method userLogin
	 * @memberof UserCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Check the supplied login credentials against the user collection.
	 */
	userLogin (that, session) {
		// Check whether user exists
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( (err, data) => {
			var msg = {};
	
			// Error trying to retrieve data
			if (err) {
				msg = that.log('SVR018', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Check that only 1 user was returned
			else {
				if (data.length === 1) {
					// Read all users in the same company group as this user
					that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"company":data[0].company,"group":data[0].group},{"username":1,"_id":-1}).toArray( (err, users) => {
						var msg = {}, i, grps = [];

						// Error trying to retrieve data
						if (err) {
							msg = that.log('SVR019', ['user', err.message]);
							that.sendResponse(session, msg);
						}
						// Return all user data
						else {
							msg.result = {};
							msg.result.status = (Object.keys(users).length > 0) ? 1 : 0;
							msg.data = {};
							// Add user credentials from login query
							msg.data = data[0];
							// Add an array of users in this group
							for (i=0; i<users.length; i++) {
								grps.push(users[i].username);
							}
							msg.data.groupusers = grps;
							that.sendResponse(session, msg);
						}
					});
				}
				else {
					msg = that.log('SVR020', []);
					that.sendResponse(session, msg);
				}
			}
		});
	}


	/**
	 * @method userNew
	 * @memberof UserCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Add a user document.
	 */
	userNew (that, session) {
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
		this.jwtCreate(that, session, data, this.userNewJWT);
	}


	/**
	 * @method userNewJWT
	 * @memberof UserCalls
	 * @description Update the user document with the new JWT.
	 */
	userNewJWT () {
		// Insert document
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').insertOne(data, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR009', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR010', ['user']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method userRead
	 * @memberof UserCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all user documents for a company.
	 */
	userRead (that, session) {
		var	filter;

		// Read filter to be applied
		filter = { "company" : session.params.filter };

		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').find(filter).sort({'username':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('SVR011', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all user data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method userUpdate
	 * @memberof UserCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update a user document.
	 */
	userUpdate (session) {
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
		this.jwtCreate(that, session, data, this.userUpdateJWT);
	}


	/**
	 * @method userUpdateJWT
	 * @memberof UserCalls
	 * @description Update the user document with the new JWT.
	 */
	userUpdateJWT () {
		var	docid;

		// Extract then remove Mongo document ID from object
		docid = data.id;
		delete data.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').updateOne({'_id':new that.ObjectID(docid)}, {$set:data}, (err, result) => {
			var msg = {};

			// Error trying to update data
			if (err) {
				msg = that.log('SVR012', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR013', ['user']);
				that.sendResponse(session, msg);
			}
		});
	}
}

module.exports = UserCalls;
