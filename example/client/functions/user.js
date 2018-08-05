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
	 * @param {object} this Object holding the data entered on the form.
	 * @description Add a new user.
	 */
	add: function () {
		this.company = admin.company.code;
		common.apiCall('userAdd', this, user.load);
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {object} this Object holding the data entered on the form.
	 * @description Delete the selected user.
	 */
	delete: function () {
		common.apiCall('userDelete', this, user.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {object} this Object holding the edited data from the form.
	 * @description Open the selected user document for editing.
	 */
	edit: function () {
		this.company = admin.company.code;
		common.apiCall('userUpdate', this, user.load);
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
		var i, data, n, rows = [], keys, options = [], lists = {};

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
				rows.push({
					userId: {
						text: admin.users[i]._id
					},
					userBundles: {
						text: admin.users[i].bundles
					},
					userClients: {
						text: admin.users[i].clients
					},
					userCode: {
						text: admin.users[i].code
					},
					userEmail: {
						text: admin.users[i].email
					},
					userGroup: {
						text: admin.users[i].group
					},
					userJWT: {
						text: admin.users[i].jwt
					},
					userName: {
						text: admin.users[i].name
					},
					userPassword: {
						text: admin.users[i].password
					},
					userRole: {
						text: admin.users[i].role
					},
					userUsername: {
						text: admin.users[i].username
					}
				});
			}
		}

		// Load list of groups
		keys = Object.keys(admin.company.groups);
		for (i=0; i<keys.length; i++) {
			options.push({"value":keys[i], "text":keys[i]});
		}
		lists['userGroupList'] = common.sortArrayObjects(options, 'text');

		// Load role list
		options = [];
		for (i=0; i<admin.roles.length; i++) {
			options.push({"value":admin.roles[i].code, "text":admin.roles[i].name});
		}
		lists['userRoleList'] = common.sortArrayObjects(options, 'text');

		// Load unique list of bundles
		arr = [];
		options = [];
		for (i=0; i<admin.bundles.length; i++) {
			if (arr.indexOf(admin.bundles[i].name) === -1) {
				arr.push(admin.bundles[i].name);
				options.push({"value":admin.bundles[i].name, "text":admin.bundles[i].name});
			}
		}
		lists['userBundlesList'] = common.sortArrayObjects(options, 'text');

		// Display the table
		ui.tableShow('userTable', rows, lists);
	}
};
