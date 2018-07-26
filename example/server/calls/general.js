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
				msg = that.log('SVR021', [err.message]);
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
}

module.exports = GeneralCalls;
