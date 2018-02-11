// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// Reports for the administration console
//
// *********************************************************************************************
// *********************************************************************************************

// ---------------------------------------------------------------------------------------------
// Add commas into a number string. If undefined, return 0.
//
// Argument 1 : String of digits
// ---------------------------------------------------------------------------------------------
function format_number (str) {
	if (str !== undefined) {
		str = str + '';
		return str.replace(new RegExp("^(\\d{" + (str.length%3 ? str.length%3 : 0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim().replace(/\s/g, ',');
	}
	else {
		return '0';
	}
}



// ---------------------------------------------------------------------------------------
// Build a key from the provided array of values
//
// Argument 1 : Array of values
//
// Return a key with only alphanumeric characters
// ---------------------------------------------------------------------------------------
function generate_key (data) {
	var i, key = '';
	for (i=0; i<data.length; i++) {
		key += (data[i]) ? data[i] : '_';
	}
	key = key.replace(/\s+/g,'');
	key = key.replace(/[^a-z0-9]/gmi,'');
	return key;
}



// ---------------------------------------------------------------------------------------
// Display a table of events for a single code
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : If 'action' is 'default', message code from link
//				If 'action' is 'result', result returned from database
// ---------------------------------------------------------------------------------------
function codes (action, result) {
	var json = {}, defn, i, cols,
		id = 'codes';

	// First pass: Run query
	if (action === 'default') {
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1, 'pid':1, 'server':1, 'username':1, 'connector':1 };
		json.filter = '{ "code":"' + result + '" }';
		json.order = { 'timestamp':-1 };
		json.limit = system.filters.codes.limit;
		api_call('report', json, codes);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP001', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'PID', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Server', justify:'l'} );
			defn.push( {title:'Connector', justify:'l'} );
			defn.push( {title:'Username', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : '', link:"sessions('default','" + result.data[i].sid + "');"} );
				cols.push( {data: result.data[i].pid} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: result.data[i].server} );
				cols.push( {data: result.data[i].connector} );
				cols.push( {data: result.data[i].username} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : ''} );
				cols.push( {data: result.data[i].module + ':' + result.data[i].fn} );
				cols.push( {data: result.data[i].code} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of events for a single command
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : If 'action' is 'default', command name from link
//				If 'action' is 'result', result returned from database
// ---------------------------------------------------------------------------------------
function commands (action, result) {
	var json = {}, defn, i, cols,
		id = 'commands';

	// First pass: Run query
	if (action === 'default') {
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1 };
		json.filter = '{ "command":"' + result + '" }';
		json.order = { 'timestamp':-1 };
		json.limit = system.filters.commands.limit;
		api_call('report', json, commands);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP002', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : '', link:"sessions('default','" + result.data[i].sid + "');"} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : ''} );
				cols.push( {data: result.data[i].module + ':' + result.data[i].fn} );
				cols.push( {data: result.data[i].code} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Display a table a summary of events over time
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function event_summary (action, result) {
	var json = {}, defn, i, cols, codes, sessions, skeys, n,
		id = 'reportEventSummary';

	// First pass: Run query
	if (action === 'default') {
		json.dateXX = 'YY-MM-DD';
		json.timeXX = 'HH24-MI';
		api_call('reportEventSummary', json, event_summary);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP008', result);
		}
		else {
			codes = result.data.header;
			sessions = result.data.body;

			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Session', justify:'l'} );
			for (i=0; i<codes.length; i++) {
				defn.push( {title:codes[i], justify:'r'} );
			}

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			skeys = Object.keys(sessions);
			for (i=0; i<skeys.length; i++) {
				// Build data display object
				cols = [];
				cols.push( {data: skeys[i], link:"sessions('default','" + skeys[i] + "');"} );
				for (n=0; n<codes.length; n++) {
					if (sessions[skeys[i]][codes[n]]) {
						cols.push( {data: sessions[skeys[i]][codes[n]]} );
					}
					else {
						cols.push( {data: '-'} );
					}
				}
				table_body(id, '', defn, cols);
			}

			// Display the modal form
			$('#'+id).modal('show');
		}
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of events for a single function
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : If 'action' is 'default', function name from link
//				If 'action' is 'result', result returned from database
// ---------------------------------------------------------------------------------------
function functions (action, result) {
	var json = {}, defn, i, cols,
		id = 'functions';

	// First pass: Run query
	if (action === 'default') {
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1, 'pid':1, 'server':1, 'username':1, 'connector':1 };
		json.filter = '{ "fn":"' + result + '" }';
		json.order = { 'timestamp':-1 };
		json.limit = system.filters.functions.limit;
		api_call('report', json, functions);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP003', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'PID', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Server', justify:'l'} );
			defn.push( {title:'Connector', justify:'l'} );
			defn.push( {title:'Username', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : '', link:"sessions('default','" + result.data[i].sid + "');"} );
				cols.push( {data: result.data[i].pid} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: result.data[i].server} );
				cols.push( {data: result.data[i].connector} );
				cols.push( {data: result.data[i].username} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : ''} );
				cols.push( {data: result.data[i].module + ':' + result.data[i].fn} );
				cols.push( {data: result.data[i].code} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of recent error events
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'filter' initiates query with parameters from filter form
//				'result' shows data
// Argument 2 : Result returned from database or parameter list for 'filter' action
// ---------------------------------------------------------------------------------------
function recent_errors (action, result) {
	var filter = {}, json = {}, defn, i, cols,
		id = 'reportRecentErrors';

	// First pass: Run query
	if (action === 'default' || action === 'filter') {
		// Use parameters from the filter
		if (action === 'filter') {
			filter.limit = parseInt(result.limit);
		}
		// Use default parameters
		else {
			// Set default rows
			filter.limit = system.filters.reportRecentErrors.limit;
			$('#reportRecentErrorsLimit').val(filter.limit);
		}

		// Load the report parameters object
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'username':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1 };
		json.order = { 'timestamp':-1 };
		json.limit = filter.limit;

		// Filter by error and list of users (depending on role of current user)
		switch (me.role) {
			case 'superuser':
				json.filter = '{"type":"error"}';
				break;
			case 'manager':
				json.filter = '{"type":"error","username": {"$in":["' + me.groupusers.join('","') + '"]}}';
				break;
			default:
				json.filter = '{"type":"error","username":"' + me.username + '"}';
				break;
		}
		api_call('report', json, recent_errors);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP004', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Username', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
// ****** Deprecation warning: moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : '', link:"sessions('default','" + result.data[i].sid + "');"} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: (result.data[i].username) ? result.data[i].username : ''} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : '', link:"commands('default','" + result.data[i].command + "');"} );
				cols.push( {data: (result.data[i].fn) ? result.data[i].fn : '', link:"functions('default','" + result.data[i].fn + "');"} );
				cols.push( {data: (result.data[i].code) ? result.data[i].code : '', link:"codes('default','" + result.data[i].code + "');"} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of events for recent transactions
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'filter' initiates query with parameters from filter form
//				'result' shows data
// Argument 2 : Result returned from database or parameter list for 'filter' action
// ---------------------------------------------------------------------------------------
function recent_trans (action, result) {
	var filter = {}, json = {}, defn, i, cols, value, start, end, exclude,
		id = 'reportRecentTrans';

	// First pass: Run query
	if (action === 'default' || action === 'filter') {
		// Use parameters from the filter
		if (action === 'filter') {
			filter.start = moment(result.start, 'DD/MM/YYYY HH:mm:ss');
			filter.end = moment(result.end, 'DD/MM/YYYY HH:mm:ss');
			filter.limit = parseInt(result.limit);
		}
		// Use default parameters
		else {
			// Default start date/time is 1 hour before now
			filter.start = moment().subtract(1, 'hour');
			$('#reportRecentTransStartDate').val(filter.start.format('DD/MM/YYYY HH:mm:ss'));

			// Default end date/time now
			filter.end = moment();
			$('#reportRecentTransEndDate').val(filter.end.format('DD/MM/YYYY HH:mm:ss'));

			// Set default rows
			filter.limit = system.filters.reportRecentTrans.limit;
			$('#reportRecentTransLimit').val(filter.limit);
		}

		// Load the report parameters object
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'username':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1 };
		json.order = { 'timestamp':-1 };
		json.limit = filter.limit;

		// Filter by date range and list of users (depending on role of current user). Exclude internal commands
		start = filter.start.format('YYYY-MM-DDTHH:mm:ssZ');
		end = filter.end.format('YYYY-MM-DDTHH:mm:ssZ');
		exclude = '"report","uiRead","loginCheck","listRoles"';
		switch (me.role) {
			case 'superuser':
				// Show timestamp in range, excluding named commands and commands without names
				// Date format is odd because it is parsed by the server before being submitted to MongoDB
				// Format must be: "ISODate(2016-04-27T15:48:58+01:00)"
				json.filter = '{ "$and":[ { "timestamp":{"$gte":"ISODate('+start+')", "$lte":"ISODate('+end+')"} }, { "command":{"$nin":['+exclude+']} }, {"command":{"$exists": true}}, {"command":{"$ne": ""}}] }';
				break;
			case 'manager':
				json.filter = '{ "timestamp":{"$gte":"ISODate('+start+')", "$lte":"ISODate('+end+')"}, "username": {"$in":["' + me.groupusers.join('","') + '"]}, "command":{"$nin":['+exclude+']} }';
				break;
			default:
				json.filter = '{ "timestamp":{"$gte":"ISODate('+start+')", "$lte":"ISODate('+end+')"}, "username":"' + me.username + '", "command":{"$nin":['+exclude+']} }';
				break;
		}
		api_call('report', json, recent_trans);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP005', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Username', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : '', link:"sessions('default','" + result.data[i].sid + "');"} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: (result.data[i].username) ? result.data[i].username : ''} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : '', link:"commands('default','" + result.data[i].command + "');"} );
				cols.push( {data: (result.data[i].fn) ? result.data[i].fn : '', link:"functions('default','" + result.data[i].fn + "');"} );
				cols.push( {data: (result.data[i].code) ? result.data[i].code : '', link:"codes('default','" + result.data[i].code + "');"} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of events for a single session
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : If 'action' is 'default', session ID from link
//				If 'action' is 'result', result returned from database
// ---------------------------------------------------------------------------------------
function sessions (action, result) {
	var json = {}, defn, i, cols,
		id = 'sessions';

	// First pass: Run query
	if (action === 'default') {
		json.collection = 'event';
		json.fields = { 'timestamp':1, 'sid':1, 'type':1, 'command':1, 'module':1, 'fn':1, 'code':1, 'text':1, 'pid':1, 'server':1, 'username':1, 'connector':1 };
		json.filter = '{ "sid":"' + result + '" }';
		json.order = { 'timestamp':-1 };
		api_call('report', json, sessions);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP006', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Timestamp', justify:'l'} );
			defn.push( {title:'Session', justify:'l'} );
			defn.push( {title:'PID', justify:'l'} );
			defn.push( {title:'Type', justify:'l'} );
			defn.push( {title:'Server', justify:'l'} );
			defn.push( {title:'Connector', justify:'l'} );
			defn.push( {title:'Username', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Function', justify:'l'} );
			defn.push( {title:'Code', justify:'l'} );
			defn.push( {title:'Message', justify:'l'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				cols = [];
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS')} );
				cols.push( {data: (result.data[i].sid) ? result.data[i].sid : ''} );
				cols.push( {data: result.data[i].pid} );
				cols.push( {data: result.data[i].type} );
				cols.push( {data: result.data[i].server} );
				cols.push( {data: result.data[i].connector} );
				cols.push( {data: result.data[i].username} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : ''} );
				cols.push( {data: result.data[i].module + ':' + result.data[i].fn} );
				cols.push( {data: result.data[i].code} );
				cols.push( {data: result.data[i].text} );
				table_body(id, '', defn, cols);
			}
		}

		// Display the modal form
		$('#'+id).modal('show');
	}
}



// ---------------------------------------------------------------------------------------
// Set filter values for reports
//
// Argument 1 : ID of the report
// ---------------------------------------------------------------------------------------
function set_filter_values (id) {
	var filter = {}, limit;

	switch (id) {
		case 'obsoleteCalls':
			limit = document.getElementById('obsoleteCallsLimit').value;
			filter.limit = (limit && is_integer(limit)) ? limit : system.filters.obsolete.limit;
			$("#obsoleteCallsFilter").collapse('hide');
			obsolete_calls('filter', filter);
			break;
		case 'reportRecentErrors':
			limit = document.getElementById('reportRecentErrorsLimit').value;
			filter.limit = (limit && is_integer(limit)) ? limit : system.filters.reportRecentErrors.limit;
			$("#reportRecentErrorsFilter").collapse('hide');
			recent_errors('filter', filter);
			break;
		case 'reportRecentTrans':
			filter.start = document.getElementById('reportRecentTransStartDate').value;
			filter.end = document.getElementById('reportRecentTransEndDate').value;
			limit = document.getElementById('reportRecentTransLimit').value;
			filter.limit = (limit && is_integer(limit)) ? limit : system.filters.reportRecentTrans.limit;
			$("#reportRecentTransFilter").collapse('hide');
			recent_trans('filter', filter);
			break;
	}
}



// ---------------------------------------------------------------------------------------
// Display a table of usage statistics for external commands via a connector
//
// Argument 1 : Action to be performed
//				'default' initiates query with default parameters
//				'result' shows data
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function usage_stats (action, result) {
	var json = {}, defn, i, key, cols,
		id = 'reportUsageStats';

	// First pass: Run query
	if (action === 'default') {
		json.collection = 'usage';
		json.fields = { 'server':1, 'connector':1, 'username':1, 'command':1, 'timestamp':1, 'tx':1 };
		json.order = { 'server':1, 'connector':1, 'username':1, 'command':1 };
		// Filter by list of users (depending on role of current user)
		switch (me.role) {
			case 'superuser':
				json.filter = '{"connector": { "$exists": true, "$ne": "" } }';
				break;
			case 'manager':
				json.filter = '{"username": {"$in":["' + me.groupusers.join('","') + '"]}}';
				break;
			default:
				json.filter = '{"username":"' + me.username + '"}';
				break;
		}
		api_call('report', json, usage_stats);
	}
	// Second pass: Display results
	else {
		// Problem running report
		if (!result.result.status) {
			message_error('REP007', result);
		}
		else {
			// Delete all rows in the table first
			table_clear(id);

			// Cell formats
			defn = [];
			defn.push( {title:'Server', justify:'l'} );
			defn.push( {title:'Connector', justify:'l'} );
			defn.push( {title:'User', justify:'l'} );
			defn.push( {title:'Command', justify:'l'} );
			defn.push( {title:'Last Update', justify:'l'} );
			defn.push( {title:'Number', justify:'r'} );
			defn.push( {title:'Duration', justify:'r'} );
			defn.push( {title:'Volume', justify:'r'} );

			// Add the table header
			table_head(id, defn);

			// Add each element of the array as a table row
			for (i=0; i<result.data.length; i++) {
				// Usage is an unordered object keyed by server, connector, user and command
				key = generate_key([result.data[i].server, result.data[i].connector, result.data[i].username, result.data[i].command]);

				// Save data so it can be used as base for live updates received from the tracker
				admin.usage[key] = {};
				admin.usage[key].tx = {};
				admin.usage[key].tx.num = parseInt(result.data[i].tx.num);
				admin.usage[key].tx.dur = parseInt(result.data[i].tx.dur);
				admin.usage[key].tx.vol = parseInt(result.data[i].tx.vol);

				// Build data display object
				cols = [];
				cols.push( {data: result.data[i].server} );
				cols.push( {data: result.data[i].connector} );
				cols.push( {data: (result.data[i].username) ? result.data[i].username : ''} );
				cols.push( {data: (result.data[i].command) ? result.data[i].command : '', link:"commands('default','" + result.data[i].command + "');"} );
				cols.push( {data: moment(result.data[i].timestamp).format('DD/MM/YYYY@HH:mm:ss.SSS'), id: key+'-ts'} );
				cols.push( {data: format_number(result.data[i].tx.num), id: key+'-num'} );
				cols.push( {data: format_number(result.data[i].tx.dur), id: key+'-dur'} );
				cols.push( {data: format_number(result.data[i].tx.vol), id: key+'-vol'} );
				table_body(id, key, defn, cols);
			}

			// Display the modal form
			$('#'+id).modal('show');
		}
	}
}



// ---------------------------------------------------------------------------------------------
// Update the usage summary table when live data is received
//
// Argument 1 : Single usage message object from tracker daemon
// ---------------------------------------------------------------------------------------------
function usage_update (msg) {
	var key;

	// Usage is an object keyed by server, connector, user and command
	key = generate_key([msg.server, msg.connector, msg.username, msg.command]);

	// Skip if data not set up yet (i.e. report has not been opened)
	if (admin.usage[key] !== undefined) {
		// Increment the baseline usage totals
		admin.usage[key].tx.num += parseInt(msg.tx.num);
		admin.usage[key].tx.dur += parseInt(msg.tx.dur);
		admin.usage[key].tx.vol += parseInt(msg.tx.vol);

		// Update the changed elements if the usage report is open
		if ($('#'+key).length > 0) {
			usage_last_element(key, 'unhighlight');
			usage_new_element(key+'-ts', 'highlight', moment(msg.time).format('DD/MM/YYYY@HH:mm:ss.SSS'));
			usage_new_element(key+'-num', 'highlight', format_number(admin.usage[key].tx.num));
			usage_new_element(key+'-dur', 'highlight', format_number(admin.usage[key].tx.dur));
			usage_new_element(key+'-vol', 'highlight', format_number(admin.usage[key].tx.vol));
		}
	}
}



// ---------------------------------------------------------------------------------------
// Update the style of the last element updated
// ---------------------------------------------------------------------------------------
function usage_last_element (key, effect) {
	if (lastKey.length > 0) {
		$('#'+lastKey+' > td').css({"color":"green"});
	}
	lastKey = key;
}



// ---------------------------------------------------------------------------------------
// Update the style of a newly updated element
// ---------------------------------------------------------------------------------------
function usage_new_element (key, effect, text) {
	// Text size is small
//	$('#'+key).html('<small>' + text + '</small>');
	$('#'+key).html(text);

	// Set the colour of the element
	if (effect === 'highlight') {
		$('#'+key).css({"color":"red"});
	}
	else {
		$('#'+key).css({"color":"yellow"});
	}
}



// ---------------------------------------------------------------------------------------
// Add the report rows
//
// Argument 1 : ID of the table
// Argument 2 : ID of the row
// Argument 3 : Array of cell formats
// Argument 4 : Array of cell data
// ---------------------------------------------------------------------------------------
function table_body (id, key, defn, cols) {
	var row, i;

	row = (key) ? '<tr id="' + key + '">' : '<tr>';
	for (i=0; i<defn.length; i++) {
		row += '<td';
		row += (cols[i].id) ? ' id="' + cols[i].id + '"' : '';
		row += (defn[i].justify === 'r') ? ' class="text-right"' : '';
		row += '>';
		row += (cols[i].link) ? '<a id="' + 'xxx' + '" onClick="' + cols[i].link + '" href="#" data-toggle="modal">' : '';
//		row += '<small>' + cols[i].data + '</small></td>';
		row += cols[i].data + '</td>';
	}
	row += '</tr>';
	$('#'+id+' .table tbody:last').append(row);
}



// ---------------------------------------------------------------------------------------
// Delete all rows in the table
//
// Argument 1 : ID of the table
// ---------------------------------------------------------------------------------------
function table_clear (id) {
	$('#'+id+'-rows > thead').empty();
	$('#'+id+'-rows > tbody').empty();
}



// ---------------------------------------------------------------------------------------
// Hide all tables held in 'content' divs
// ---------------------------------------------------------------------------------------
function table_hide_all () {
	$('.content').hide();
}



// ---------------------------------------------------------------------------------------
// Build the report heading
//
// Argument 1 : ID of the table
// Argument 2 : Array of cell formats
// ---------------------------------------------------------------------------------------
function table_head (id, defn) {
	var row, i;

	row = '<tr>';
	for (i=0; i<defn.length; i++) {
		row += (defn[i].justify === 'r') ? '<th class="text-right">' : '<th>';
//		row += '<small>' + defn[i].title + '</small></th>';
		row += defn[i].title + '</th>';
	}
	row += '</tr>';
	$('#'+id+' .table thead:last').append(row);
}



// ---------------------------------------------------------------------------------------
// Show a named table held in a div
//
// Argument 1 : ID of the table
// ---------------------------------------------------------------------------------------
function table_show (id) {
	// Hide all tables
	table_hide_all();

	// Get the div's ID and show it
	$(document.getElementById(id)).show();
}
