/**
 * @file api.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace API
 * @author Basil Fisk
 * @description Send a JWT protected command to the API then invoke a callback.
 */

var API = {

	/**
	 * @method _apiCall
	 * @author Basil Fisk
	 * @param {string} command Command to be run.
	 * @param {object} json Object of parameters to the command in JSON format.
	 * @param {function} callback Callback function to be run after data returned.
	 * @description Send a JWT protected command to the API then invoke a callback.
	 */
	_apiCall: function (command, json, callback) {
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
};
