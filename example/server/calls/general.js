/**
 * @file general.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description General API calls handled by the administration server.
 */

/**
 * @namespace GeneralCalls
 * @author Basil Fisk
 * @description General API calls handled by the administration server.
 */
class GeneralCalls {
	constructor () {
		// empty
	}


	/**
	 * @method listPlans
	 * @memberof GeneralCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read the list of subscriber plans.
	 */
	listPlans (that, session) {
		that.mongoDB.db('qott').collection('plan').find().sort({'name':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM020', [err.message]);
				that.sendResponse(session, msg);
			}
			// Return data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method listRoles
	 * @memberof GeneralCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Return the list of roles.
	 * TODO Where this comes from has yet to be decided.
	 */
	listRoles (that, session) {
		var data = [], msg = {};

		data.push({"code":"superuser", "name":"Super User", "level":1});
		data.push({"code":"manager", "name":"Manager", "level":2});
		data.push({"code":"user", "name":"User", "level":3});

		msg = that.responseData(data);
		that.sendResponse(session, msg);
	}


	/**
	 * @method loginCheck
	 * @memberof GeneralCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Check the supplied login credentials against the user collection.
	 */
	loginCheck (that, session) {
		// Check whether user exists
		that.mongoDB.db(that.admin.mongo.db).collection('va_user').find({"username":session.params.username, "password":session.params.password},{"password":0}).toArray( (err, data) => {
			var msg = {};
	
			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM018', ['user', err.message]);
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
}

module.exports = GeneralCalls;
