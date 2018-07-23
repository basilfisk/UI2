/**
 * @file company.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for companies handled by the administration server.
 */

/**
 * @namespace CompanyCalls
 * @author Basil Fisk
 * @description API calls for companies handled by the administration server.
 */
class CompanyCalls {
	constructor () {
		// empty
	}


	/**
	 * @method companyDelete
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a company document.
	 */
	companyDelete (that, session) {
		var	id;

		id = session.params['_id'];
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').deleteOne({'_id':new that.mongo.ObjectID(id)}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM007', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM008', ['company']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyGroupDelete
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a company group.
	 */
	companyGroupDelete (that, session) {
		var	group, data = {}, docid;

		// Extract data to be updated
		group = "groups." + session.params.name;
		data[group] = 1;
		docid = session.params.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').updateOne({'_id':new that.mongo.ObjectID(docid)}, {$unset:data}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM012', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM013', ['company']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyGroupUpsert
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Insert or update a company group.
	 */
	companyGroupUpsert (that, session) {
		var	group, data = {}, docid;

		// Extract data to be updated
		group = "groups." + session.params.name;
		data[group] = {};
		data[group].description = session.params.desc;
		data[group].plan = session.params.plan;
		docid = session.params.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').updateOne({'_id':new that.mongo.ObjectID(docid)}, {$set:data}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM012', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM013', ['company']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyNew
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Add a company document.
	 */
	companyNew (that, session) {
		var	data = {};

		// Extract data to be added
		data.name = session.params.name;
		data.groups= session.params.groups;

		// Insert document
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').insertOne(data, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM009', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM010', ['company']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyRead
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all company documents filtered by name.
	 */
	companyRead (that, session) {
		var	filter;

		// Read filter to be applied
		filter = (session.params.filter === 'all') ? {} : {"name":session.params.filter};

		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').find(filter).sort({'name':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM011', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all company data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyReadId
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all company documents filtered by ID.
	 */
	companyReadId (that, session) {
		var	filter;

		// Read filter to be applied
		filter = (session.params.filter === 'all') ? {} : {"_id":new that.mongo.ObjectID(session.params.filter)};

		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').find(filter).sort({'name':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM011', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all company data
			else {
				msg = that.log(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method companyUpdate
	 * @memberof CompanyCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update a company document.
	 */
	companyUpdate (that, session) {
		var	data = {}, docid;

		// Extract data to be updated
		data.name = session.params.name;
		data.groups= session.params.groups;
		docid = session.params.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_company').updateOne({'_id':new that.mongo.ObjectID(docid)}, {$set:data}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM012', ['company', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM013', ['company']);
				that.sendResponse(session, msg);
			}
		});
	}
}

module.exports = CompanyCalls;
