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
	 * @method addForm
	 * @author Basil Fisk
	 * @description Add a new bundle.
	 */
/*	addForm: function () {
		var i, options = [], lists = {};

		// Load commands list
		for (i=0; i<admin.commands.length; i++) {
			options.push({"value":admin.commands[i].name, "text":admin.commands[i].name});
		}
		lists['bundleAddCommand'] = general.sortArrayObjects(options, 'text');

		// Load connectors list
		options = [];
		for (i=0; i<admin.connectors.length; i++) {
			options.push({"value":admin.connectors[i].name, "text":admin.connectors[i].name});
		}
		lists['bundleAddConnector'] = general.sortArrayObjects(options, 'text');

		ui.formAdd('bundleAdd', lists);
	},*/


	/**
	 * @method add
	 * @author Basil Fisk
	 * @description Add a new bundle.
	 */
	add: function () {
		var data = {
			name: this.name,
			company: admin.company.code,
			command: this.command,
			connector: this.connector,
			version: {
				cmd: this.version.cmd,
				prms: this.version.prms
			}
		};
		common.apiCall('bundleAdd', data, bundle.load);
	},
	
	
	/**
	 * @method delete
	 * @author Basil Fisk
	 * @description Delete the selected bundle.
	 */
	delete: function () {
console.log(this);
		common.apiCall('bundleDelete', {_id: this._id}, bundle.load);
	},


	/**
	 * @method editForm
	 * @author Basil Fisk
	 * @description Open the selected bundle document for editing.
	 */
	editForm: function (id) {
		var i, index = -1, data = {}, options = [], lists = [];
console.log(id);

		// Find the selected document
		for (i=0; i<admin.bundles.length; i++) {
			index = (admin.bundles[i]._id === id) ? i : index;
		}

		// Load bundle data into temporary object
		data.id = admin.bundles[index]._id;
		data.name = admin.bundles[index].name;
		data.command = admin.bundles[index].command;
		data.connector = admin.bundles[index].connector;
		data.version = {};
		data.version.cmd = admin.bundles[index].version.cmd;
		data.version.prms = admin.bundles[index].version.prms;

		// Load connectors list
		for (i=0; i<admin.connectors.length; i++) {
			options.push({"value":admin.connectors[i].name, "text":admin.connectors[i].name});
		}
		lists['bundleEditConnector'] = general.sortArrayObjects(options, 'text');

		// Load commands list
		options = [];
		for (i=0; i<admin.commands.length; i++) {
			options.push({"value":admin.commands[i].name, "text":admin.commands[i].name});
		}
		lists['bundleEditCommand'] = general.sortArrayObjects(options, 'text');

		// Display form for editing data
		ui.formEdit('bundleEdit', data, lists);
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
				_id: admin.bundles[i]._id,
				name: {
					text: admin.bundles[i].name
				},
				command: {
					text: admin.bundles[i].command
				},
				connector: {
					text: admin.bundles[i].connector
				},
				version: {
					text: ver
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
		lists['bundleAddCommand'] = general.sortArrayObjects(options, 'text');

		// Load list of connectors
		options = [];
		for (i=0; i<admin.connectors.length; i++) {
			options.push({
				value: admin.connectors[i].name,
				text: admin.connectors[i].name
			});
		}
		lists['bundleAddConnector'] = general.sortArrayObjects(options, 'text');

		// Display the table
		ui.tableShow('bundleTable', rows, lists);
	}
};
