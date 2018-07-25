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
		var i, options = [], lists = {};

		// Load commands list
		for (i=0; i<admin.commands.length; i++) {
			options.push({"value":admin.commands[i].name, "text":admin.commands[i].name});
		}
		lists['bundleAddCommand'] = formFunctions.sortArrayObjects(options, 'text');

		// Load connectors list
		options = [];
		for (i=0; i<admin.connectors.length; i++) {
			options.push({"value":admin.connectors[i].name, "text":admin.connectors[i].name});
		}
		lists['bundleAddConnector'] = formFunctions.sortArrayObjects(options, 'text');

		ui.formAdd('bundleAddForm', lists);
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {string} id ID of the bundle to be deleted.
	 * @description Read the details for the selected company.
	 */
	delete: function (id) {
		common.apiCall('bundleDelete', {'_id': id}, bundle.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {string} id ID of the bundle to be edited.
	 * @description Open the selected bundle document for editing.
	 */
	edit: function (id) {
		var i, index = -1, data = {}, options = [], lists = [];

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
		lists['bundleEditConnector'] = formFunctions.sortArrayObjects(options, 'text');

		// Load commands list
		options = [];
		for (i=0; i<admin.commands.length; i++) {
			options.push({"value":admin.commands[i].name, "text":admin.commands[i].name});
		}
		lists['bundleEditCommand'] = formFunctions.sortArrayObjects(options, 'text');

		// Display form for editing data
		ui.formEdit('bundleEditForm', data, lists);
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @description Show all bundles for the current company.
	 */
	load: function () {
		common.apiCall('bundleRead', { "filter":admin.company.code }, bundle.showTable);
	},


	/**
	 * @method showTable
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the bundle data in a table.
	 */
	showTable: function (action, result) {
		var i, rows = [], cols = [], obj = {}, ver;

		// Extract data from result set and load into global 'admin.bundles' variable
		admin.bundles = [];
		for (i=0; i<result.data.length; i++) {
			admin.bundles.push(result.data[i]);
		}

		// Add each element of the array as a table row
		for (i=0; i<admin.bundles.length; i++) {
			cols = [];

			// Add column with link to edit form - only if user has permission to edit data
			obj = {};
			obj.text = admin.bundles[i].name;
			if (ui.userAccess('bundleEditForm')) {
				obj.link = 'bundle.edit';
			}
			cols.push(obj);

			// Add information columns
			cols.push({"text":admin.bundles[i].command});
			cols.push({"text":admin.bundles[i].connector});
			ver = 'Cmd v' + admin.bundles[i].version.cmd + ' / ';
			ver += 'Prm v' + admin.bundles[i].version.prms;
			cols.push({"text":ver});

			// Only add delete link if user has permission to edit data
			if (ui.userAccess('bundleEditForm')) {
				cols.push({"button":"bundle.delete", "style":"danger", "icon":"trash"});
			}

			// Save row
			rows.push({"id":admin.bundles[i]._id, "cols":cols});
		}

		// Display the table
		ui.tableShow('bundleTable', rows);
	}
};
