/**
 * @file general.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace General
 * @author Basil Fisk
 * @description Functions for interchanging data entered via the UI with the MongoDB database.
 */
var general = {
	/**
	 * @method aboutShow
	 * @author Basil Fisk
	 * @description Display the About form.
	 */
	aboutShow: function () {
		var data = {}, i;

		data.clients = me.clients;
		data.company = me.company;
		data.email = me.email;
		data.group = me.group;
		data.jwt = me.jwt;
		data.name = me.name;
		data.username = me.username;
		for (i=0; i<admin.roles.length; i++) {
			if (admin.roles[i].code === me.role) {
				data.role = admin.roles[i].name;
			}
		}
		data.bundles = me.bundles.join(',');

		// Display form
		ui.formEdit('about', data);
	},


	/**
	 * @method loginCheck
	 * @author Basil Fisk
	 * @param {string} data Data returned from the form.
	 * @description Validate the user credentials.
	 */
	loginCheck: function (data) {
		common.apiCall('userLogin', {"username":data.username, "password":data.password}, login.readUser);
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
