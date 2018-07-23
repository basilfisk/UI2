/**
 * @file calls.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls handled by the administration server.
 */

/**
 * @namespace Calls
 * @author Basil Fisk
 * @description API calls handled by the administration server.
 */
class Calls {
	constructor () {
		// empty
	}


	/**
	 * @method loginCheck
	 * @memberof Calls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @param {function} callback Function to be run after processing is complete.
	 * @description Check the supplied login credentials against the user collection.
	 */
	loginCheck (that, session) {
		// Check whether user exists
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( function(err, data) {
			var msg = {};
	
			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM018', ['user', err.message]);
				that.sendResponse(session, msg);
			}
			// Check that only 1 user was returned
			else {
				if (data.length === 1) {
//					login_group_users(session, data[0]);
					// Read all users in the same company group as this user
					that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"company":data[0].company,"group":data[0].group},{"username":1,"_id":-1}).toArray( function(err, users) {
						var msg = {}, i, grps = [];

						// Error trying to retrieve data
						if (err) {
							msg = that.log('ADM021', ['user', err.message]);
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
					msg = that.log('ADM022', []);
					that.sendResponse(session, msg);
				}
			}
		});
	}
	ZZZloginCheck (that, session, callback) {
		var msg;
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( (err, data) => {
			// Error trying to retrieve data
			if (err) {
				msg = { code:'ADM018', prms:['user', err.message] }
				callback(that, session, false, msg);
			}
			// Check that only 1 user was returned
			else {
				if (data.length === 1) {
					// Read all users in the same company group as this user
					that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"company":data[0].company,"group":data[0].group},{"username":1,"_id":-1}).toArray( (err, result) => {
						var msg, i;
						// Error trying to retrieve data
						if (err) {
							msg = { code:'ADM021', prms:['user', err.message] }
							callback(that, session, false, msg);
						}
						// Return all user data
						// Add user credentials from login query
						// Add an array of users in this group
						else {
							msg = data[0];
							msg.groupusers = [];
							for (i=0; i<result.length; i++) {
								msg.groupusers.push(result[i].username);
							}
							callback(that, session, true, msg);
						}
					});
				}
				else {
					msg = { code:'ADM022', prms:[] }
					callback(that, session, false, msg);
				}
			}
		});
	}
}

module.exports = Calls;
