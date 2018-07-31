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
	 * @description Add a new bundle.
	 */
	add: function () {
/*		var data = {
			name: this.name,
			company: admin.company.code,
			command: this.command,
			connector: this.connector,
			version: {
				cmd: this.version.cmd,
				prms: this.version.prms
			}
		};*/
		var data = this;
		data.company = admin.company.code;
		common.apiCall('bundleAdd', data, bundle.load);
	},
	
	
	/**
	 * @method delete
	 * @author Basil Fisk
	 * @description Delete the selected bundle.
	 */
	delete: function () {
		common.apiCall('bundleDelete', {_id: this._id}, bundle.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @description Save details of an edited bundle.
	 */
	edit: function () {
		var data = this;
		data.company = admin.company.code;
		common.apiCall('bundleUpdate', data, bundle.load);
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
		var i, rows = [], cols, ver, options = [], lists = {};

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
			cols = {
				bundleEditId: {
					text: admin.bundles[i]._id
				},
				bundleEditName: {
					text: admin.bundles[i].name
				},
				bundleEditCommand: {
					text: admin.bundles[i].command
				},
				bundleEditConnector: {
					text: admin.bundles[i].connector
				},
				bundleEditCommandVer: {
					text: admin.bundles[i].version.cmd
				},
				bundleEditParameterVer: {
					text: admin.bundles[i].version.prms
				}
			};

			// Save row
			rows.push(cols);
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
