/**
 * @file bundle.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Bundle
 * @author Basil Fisk
 * @description Interchange of 'bundle' data between the UI and the MongoDB database.
 */
var bundle = {
	/**
	 * @method add
	 * @author Basil Fisk
	 * @param {object} this Object holding the data entered on the form.
	 * @description Add a new bundle after including the company code.
	 */
	add: function () {
		this.company = admin.company.code;
		common.apiCall('bundleAdd', this, bundle.load);
	},
	
	
	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {object} this Object holding the ID of the bundle to be deleted.
	 * @description Delete the selected bundle.
	 */
	delete: function () {
		common.apiCall('bundleDelete', this, bundle.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {object} this Object holding the edited data from the form.
	 * @description Save details of an edited bundle after including the company code.
	 */
	edit: function () {
		this.company = admin.company.code;
console.log(this);
		common.apiCall('bundleUpdate', this, bundle.load);
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @description Show all bundles for the current company.
	 */
	load: function () {
		common.apiCall('bundleRead', { "filter":admin.company.code }, bundle.table);
	},


	/**
	 * @method table
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the bundle data in a table.
	 */
	table: function (action, result) {
		var i, rows = [], options = [], lists = {};

		// Extract data from result set and load into global 'admin.bundles' variable
		admin.bundles = [];
		for (i=0; i<result.data.length; i++) {
			admin.bundles.push(result.data[i]);
		}

		// Add each element of the array as a table row
		// Include _id so the record can be deleted
		for (i=0; i<admin.bundles.length; i++) {
			ver = 'Cmd v' + admin.bundles[i].version.cmd + ' / ';
			ver += 'Prm v' + admin.bundles[i].version.prms;

			// Save row
			rows.push({
				bundleId: {
					text: admin.bundles[i]._id
				},
				bundleName: {
					text: admin.bundles[i].name
				},
				bundleCommand: {
					text: admin.bundles[i].command
				},
				bundleConnector: {
					text: admin.bundles[i].connector
				},
				bundleCommandVer: {
					text: admin.bundles[i].version.cmd
				},
				bundleParameterVer: {
					text: admin.bundles[i].version.prms
				}
			});
		}

		// Load list of commands
		for (i=0; i<admin.commands.length; i++) {
			options.push({
				value: admin.commands[i].name,
				text : admin.commands[i].name
			});
		}
		lists['bundleCommandList'] = common.sortArrayObjects(options, 'text');

		// Load list of connectors
		options = [];
		for (i=0; i<admin.connectors.length; i++) {
			options.push({
				value: admin.connectors[i].name,
				text: admin.connectors[i].name
			});
		}
		lists['bundleConnectorList'] = common.sortArrayObjects(options, 'text');

		// Display the table
		ui.tableShow('bundleTable', rows, lists);
	}
};
