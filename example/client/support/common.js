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
	/**
	 * @method apiCall
	 * @author Basil Fisk
	 * @param {string} command Command to be run.
	 * @param {object} json Object of parameters to the command in JSON format.
	 * @param {function} success Callback function to be run after data returned.
	 * @param {function} failure Callback function to be run after data returned.
	 * @description Send a JWT protected command to the API then invoke a callback.
	 */
	apiCall: function (command, json, success, failure) {
		var url, options;

		url = system.api.host + ':' + system.api.port + '/1/' + command;
		options = {
			type: 'GET',
			dataType: 'json',
			data: JSON.stringify(json),
//			headers: { "Authorization": "Bearer " + me.jwt },	// TODO THIS DOUBLES UP THE PROCESSING IN admin.js !!!!!!!!!
			error: function (err) {
				ui.messageBox('CMN001', [system.api.host, system.api.port, command], failure);
			},
			success: function (result) {
				success('result', result);
			}
		};

		$.ajax(url, options);
	},


	/**
	 * @method sortArrayObjects
	 * @author Basil Fisk
	 * @param {array} arr Array of objects to be sorted.
	 * @param {string} key Field in each object to sort by.
	 * @description Sort an array of objects by a field in the object.
	 */
	sortArrayObjects: function (arr, key) {
		var sorted = arr.sort(function (a, b) {
			return (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
		});
		return sorted;
	}
};
