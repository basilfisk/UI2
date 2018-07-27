/**
 * @file connector.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for connectors handled by the administration server.
 */

/**
 * @namespace ConnectorCalls
 * @author Basil Fisk
 * @description API calls for connectors handled by the administration server.
 */
class ConnectorCalls {
	constructor () {
		// empty
	}


	/**
	 * @method connectorDelete
	 * @memberof ConnectorCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a connector document.
	 */
	connectorDelete (that, session) {
		var	id;

		id = session.params['_id'];
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').deleteOne({'_id':new that.ObjectID(id)}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR007', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR008', ['connector']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method connectorNew
	 * @memberof ConnectorCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Add a connector document.
	 */
	connectorNew (that, session) {
		var	data = {};

		// Extract data to be added
		data.company = session.params.company;
		data.name = session.params.name;
		data.service = session.params.service;

		// Insert document
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').insertOne(data, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR009', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR010', ['connector']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method connectorRead
	 * @memberof ConnectorCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all connector documents for a company.
	 */
	connectorRead (that, session) {
		var	filter;

		// Read filter to be applied
		filter = { "company" : session.params.filter };

		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').find(filter).sort({'name':1,'service':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('SVR011', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all connector data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method connectorUpdate
	 * @memberof ConnectorCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update a connector document.
	 */
	connectorUpdate (that, session) {
		var	docid;

		// Extract data to be updated
		docid = session.params.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').updateOne({'_id':new that.ObjectID(docid)}, {$set:{"name":session.params.name, "config":session.params.config}}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR012', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR013', ['connector']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method connectorUpdateName
	 * @memberof ConnectorCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update the name of a connector.
	 */
	connectorUpdateName (that, session) {
		that.mongoDB.db(that.admin.mongo.db).collection('va_connector').update({"company":session.params.company,"name":session.params.name},{$set:{"name":session.params.newname}}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('SVR012', ['connector', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('SVR013', ['connector']);
				that.sendResponse(session, msg);
			}
		});
	}
}

module.exports = ConnectorCalls;
