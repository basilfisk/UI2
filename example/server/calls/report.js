/**
 * @file report.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description API calls for reports handled by the administration server.
 */

/**
 * @namespace ReportCalls
 * @author Basil Fisk
 * @description API calls for reports handled by the administration server.
 */
class ReportCalls {
	constructor () {
		// empty
	}


	/**
	 * @method report
	 * @memberof ReportCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Run an internal API administration report.
	 */
	report (that, session) {
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
			this.reportFilterParse(filter_obj);
		}
		catch (err) {
			msg = that.log('SVR014', [err.message]);
			that.sendResponse(session, msg);
			return;
		}

		// Run the query
		that.mongoDB.db(that.admin.mongo.db).collection(colln).find(filter_obj,flds).sort(seq).limit(max).toArray( (err, data) => {
			var msg = {};

			// Error trying to retrieve data
			if (err) {
				msg = that.log('SVR015', [colln, err.message]);
				that.sendResponse(session, msg);
			}
			// Return data
			else {
				that.log('SVR016', [session.command]);
				msg = that.responseData(data);
				that.sendResponse(session, msg);
			}
		});
	}


	/**
	 * @method reportFilterParse
	 * @memberof ReportCalls
	 * @param {object} session Filter statement as a string, but formatted as a JSON object.
	 * @description Parse the filter statement for items that can't be passed in via an object.
	 * Change 'ISODate(...)' string to a true date using to 'new Date'
	 * If $REGEX found, convert value delimiters from "..." to /.../
	 * If using Mongo $ functions, delimit with quotes (e.g. "$in")
	 */
	reportFilterParse (obj) {
		var keys, i, arr, value;

		// Loop through each element in the object
		keys = Object.keys(obj);
		for (i=0; i<keys.length; i++) {
			// If nested object found, recurse through it
			if (typeof(obj[keys[i]]) === 'object') {
				this.reportFilterParse(obj[keys[i]]);
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


	/**
	 * @method reportEventSummary
	 * @memberof ReportCalls
	 * @param {object} that Current scope.
	 * @param {object} session Session object.
	 * @description Generate the event summary report.
	 */
	reportEventSummary (that, session) {
		var	date, time, patt_date, patt_time, msg, start;

		// Read arguments and use last 30 mins if not provided
		// [1] Date YY-MM-DD [2] Time HH24:MI
		date = session.params.date || that.moment().format('YY-MM-DD');
		time = session.params.time || that.moment(that.moment().subtract(30, 'minutes')).format('HH:mm');

		// Validate and format the date and time
		patt_date = new RegExp('(16|17)-(01|02|03|04|05|06|07|08|09|10|11|12)-[0-3][0-9]');
		patt_time = new RegExp('[0-2][0-9]:[0-5][0-9]');
		if (!patt_date.test(date)) {
			msg = that.log('SVR028', [date]);
			that.sendResponse(session, msg);
		}
		else {
			if (!patt_time.test(time)) {
				msg = that.log('SVR029', [time]);
				that.sendResponse(session, msg);
			}
			else {
				// Start timestamp: '2016-11-20T14:00:00'
				start = new Date('20' + date + 'T' + time + ':00');

				// Read the recent events
				that.mongoDB.db(that.admin.mongo.db).collection('va_event').find({timestamp:{$gte:start}}).sort({timestamp:-1}).toArray( (err, result) => {
					var msg, i, sessions = {}, codes = [], data = {};
					if (err) {
						msg = that.log('SVR030', ['event', err.message]);
						that.sendResponse(session, msg);
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
						msg = that.responseData(data);
						that.sendResponse(session, msg);
					}
				});
			}
		}
	}
}

module.exports = ReportCalls;
