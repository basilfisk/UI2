/**
 * @file bundle.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for bundles handled by the administration server.
 */

/**
 * @namespace BundleCalls
 * @author Basil Fisk
 * @description API calls for bundles handled by the administration server.
 */
class BundleCalls {
	constructor () {
		// empty
	}


	/**
	 * @method bundleDelete
	 * @memberof BundleCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Delete a bundle document.
	 */
	bundleDelete (that, session) {
		var	id = session.params['_id'];

		that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').deleteOne({'_id':new that.mongo.ObjectID(id)}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM007', ['bundle', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM008', ['bundle']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method bundleNew
	 * @memberof BundleCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Add a bundle document.
	 */
	bundleNew (that, session) {
		that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').insertOne(session.params, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM009', ['bundle', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM010', ['bundle']);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method bundleRead
	 * @memberof BundleCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read all bundle documents for a company.
	 */
	bundleRead (that, session) {
		var	filter;

		// Read filter to be applied
		filter = { "company" : session.params.filter };

		// Run query
		that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').find(filter).sort({'name':1,'command':1}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM011', ['bundle', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all bundle data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method bundleRead1
	 * @memberof BundleCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Read 1 bundle document for a company.
	 */
	bundleRead1 (that, session) {
		that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').find({'_id':new that.mongo.ObjectID(session.params.id)}).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('ADM011', ['bundle', err.message]);
				that.sendResponse(session, msg);
			}
			// Return all bundle data
			else {
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method bundleUpdate
	 * @memberof BundleCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Update a bundle document.
	 */
	bundleUpdate (session) {
		var	docid;

		// Extract then remove Mongo document ID from object
		docid = session.params.id;
		delete session.params.id;

		// Update document
		that.mongoDB.db(that.admin.mongo.db).collection('va_bundle').updateOne({'_id':new that.mongo.ObjectID(docid)}, {$set:session.params}, (err, result) => {
			var msg = {};

			// Error trying to insert data
			if (err) {
				msg = that.log('ADM012', ['bundle', err.message]);
				that.sendResponse(session, msg);
			}
			// Return result
			else {
				msg = that.log('ADM013', ['bundle']);
				that.sendResponse(session, msg);
			}
		});
	}
}

module.exports = BundleCalls;
