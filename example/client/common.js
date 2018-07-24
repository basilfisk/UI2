/**
 * @file common.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Common
 * @author Basil Fisk
 * @description Common functions used across the sample application.
 */
var common = {
	api: {
		host: "https://local.very-api.net",
		port: 19400
	},


	/**
	 * @method apiCall
	 * @author Basil Fisk
	 * @param {string} command Command to be run.
	 * @param {object} json Object of parameters to the command in JSON format.
	 * @param {function} callback Callback function to be run after data returned.
	 * @description Send a JWT protected command to the API then invoke a callback.
	 */
	apiCall: function (command, json, callback) {
		var url, options;

		url = common.api.host + ':' + common.api.port + '/1/' + command;
		options = {
			type: 'GET',
			dataType: 'json',
			data: JSON.stringify(json),
//			headers: { "Authorization": "Bearer " + me.jwt },	// THIS DOUBLES UP THE PROCESSING IN admin.js !!!!!!!!!
			error: function (err) {
				ui.messageBox('CON010', [common.api.host, common.api.port, command]);
			},
			success: function (result) {
//console.log(result);
				callback('result', result);
			}
		};

		$.ajax(url, options);
	}
};
