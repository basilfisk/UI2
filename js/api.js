// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// API
//
// *********************************************************************************************
// *********************************************************************************************

// ---------------------------------------------------------------------------------------
// Send a JWT protected command to the API then invoke a callback
//
// Argument 1 : Command to be run
// Argument 2 : Object of parameters to the command in JSON format
// Argument 3 : Callback function to be run after data returned
// ---------------------------------------------------------------------------------------
function api_call (command, json, callback) {
	var url, options;

	url = system.api.host + ':' + system.api.port + '/1/' + command;
	options = {
		type: 'GET',
		dataType: 'json',
		data: JSON.stringify(json),
//		headers: { "Authorization": "Bearer " + me.jwt },	// THIS DOUBLES UP THE PROCESSING IN admin.js !!!!!!!!!
		error: function (err) {
//			message('CON010', [system.api.host, system.api.port, command]);
			ui.messageBox('CON010', [system.api.host, system.api.port, command]);
		},
		success: function (result) {
			callback('result', result);
		}
	};

	$.ajax(url, options);
}
