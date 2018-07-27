/**
 * @file user.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace User
 * @author Basil Fisk
 * @description Interchange of 'user' data between the UI and the MongoDB database.
 */
var user = {
	/**
	 * @method add
	 * @author Basil Fisk
	 * @description Add a new user.
	 */
	add: function () {
		var keys, i, arr = [], options = [], lists = {};

		// Load list of groups
		keys = Object.keys(admin.company.groups);
		for (i=0; i<keys.length; i++) {
			options.push({"value":keys[i], "text":keys[i]});
		}
		lists['userAddGroup'] = general.sortArrayObjects(options, 'text');

		// Load role list - only role to list if role is same or lower than current user
		options = [];
		for (i=0; i<admin.roles.length; i++) {
			if (admin.roles[i].level >= me.level) {
				options.push({"value":admin.roles[i].code, "text":admin.roles[i].name});
			}
		}
		lists['userAddRole'] = general.sortArrayObjects(options, 'text');

		// Load unique list of bundles
		arr = [];
		options = [];
		for (i=0; i<admin.bundles.length; i++) {
			if (arr.indexOf(admin.bundles[i].name) === -1) {
				arr.push(admin.bundles[i].name);
				options.push({"value":admin.bundles[i].name, "text":admin.bundles[i].name});
			}
		}
		lists['userAddBundles'] = general.sortArrayObjects(options, 'text');

		ui.formAdd('userAdd', lists);
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {string} data ID of user document.
	 * @description Delete the selected user.
	 */
	delete: function (id) {
		common.apiCall('userDelete', {'_id': id}, user.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {string} data ID of user document.
	 * @description Open the selected user document for editing.
	 */
	edit: function (id) {
console.log(this);
		var i, index = -1, data = {}, keys, arr = [], options = [], lists = [];

		// Find the selected document
		for (i=0; i<admin.users.length; i++) {
			index = (admin.users[i]._id === id) ? i : index;
		}

		// Load user data into temporary object
		data.id = admin.users[index]._id;
		data.username = admin.users[index].username;
		data.password = admin.users[index].password;
		data.role = admin.users[index].role;
		data.group = admin.users[index].group;
		data.jwt = admin.users[index].jwt;
		data.clients = admin.users[index].clients;
		data.bundles = admin.users[index].bundles;

		// Load list of groups
		keys = Object.keys(admin.company.groups);
		for (i=0; i<keys.length; i++) {
			options.push({"value":keys[i], "text":keys[i]});
		}
		lists['userEditGroup'] = general.sortArrayObjects(options, 'text');

		// Load role list
		options = [];
		for (i=0; i<admin.roles.length; i++) {
			options.push({"value":admin.roles[i].code, "text":admin.roles[i].name});
		}
		lists['userEditRole'] = general.sortArrayObjects(options, 'text');

		// Load unique list of bundles
		arr = [];
		options = [];
		for (i=0; i<admin.bundles.length; i++) {
			if (arr.indexOf(admin.bundles[i].name) === -1) {
				arr.push(admin.bundles[i].name);
				options.push({"value":admin.bundles[i].name, "text":admin.bundles[i].name});
			}
		}
		lists['userEditBundles'] = general.sortArrayObjects(options, 'text');

		// Display form for editing data
		ui.formEdit('userEdit', data, lists);
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @param {string} data ID of user document.
	 * @description Show all users for the current company.
	 */
	load: function () {
		common.apiCall('userRead', { "filter":admin.company.code }, user.table);
	},


	/**
	 * @method table
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the user data in a table.
	 */
	table: function (action, result) {
		var i, data, n, rows = [], cols;

		// Extract data from result set and load into global 'admin.users' variable
		admin.users = [];
		for (i=0; i<result.data.length; i++) {
			// Data for user
			data = result.data[i];

			// Add user's role level
			for (n=0; n<admin.roles.length; n++) {
				if (data.role === admin.roles[n].code) {
					data.level = admin.roles[n].level;
				}
			}

			// Save user data in global
			admin.users.push(data);
		}

		// Add each element of the array as a table row
		for (i=0; i<admin.users.length; i++) {
			// Only add to table if role is same or lower than current user
			if (admin.users[i].level >= me.level) {
				cols = {
					user: {
						text: admin.users[i].username
					},
					group: {
						text: admin.users[i].group
					},
					role: {
						text: admin.users[i].role
					}
				};

				// Save row
				rows.push(cols);
			}
		}

		// Display the table
		ui.tableShow('userTable', rows);
	}
};
