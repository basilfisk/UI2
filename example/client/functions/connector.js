/**
 * @file connector.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Connector
 * @author Basil Fisk
 * @description Interchange of 'connector' data between the UI and the MongoDB database.
 */
var connector = {
	/**
	 * @method add
	 * @author Basil Fisk
	 * @description Add a new connector.
	 */
	add: function () {
		var i, options = [], lists = [];

		for (i=0; i<admin.services.length; i++) {
			options.push({"value":admin.services[i].code, "text":admin.services[i].name});
		}
		lists['connectorAddService'] = general.sortArrayObjects(options, 'text');

		ui.formAdd('connectorAdd', lists);
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {string} id ID of the company to be edited.
	 * @description Delete the selected connector.
	 */
	delete: function (id) {
		common.apiCall('connectorDelete', {'_id': id}, connector.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {string} id ID of the company to be edited.
	 * @description Open the selected connector document for editing.
	 */
	edit: function (id) {
		var i, index = -1, data = {};

		// Find the selected document
		for (i=0; i<admin.connectors.length; i++) {
			index = (admin.connectors[i]._id === id) ? i : index;
		}

		// Load connector data into temporary object
		data.id = admin.connectors[index]._id;
		data.name = admin.connectors[index].name;
		data.config = admin.connectors[index].config;

		// Display form for editing data
		ui.formEdit('connectorEdit-' + admin.connectors[index].service, data);
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @description Show all connectors for the current company.
	 */
	load: function () {
		common.apiCall('connectorRead', { "filter":admin.company.code }, connector.table);
	},


	/**
	 * @method table
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the connector data in a table.
	 */
	table: function (action, result) {
		var i, rows = [], cols;

		// Extract data from result set and load into global 'admin.connectors' variable
		admin.connectors = [];
		for (i=0; i<result.data.length; i++) {
			admin.connectors.push(result.data[i]);
		}

		// Add each element of the array as a table row
		for (i=0; i<admin.connectors.length; i++) {
			// Add column with link to edit form - only if user has permission to edit data
			cols = {
				name: {
					text: admin.connectors[i].name
				},
				service: {
					text: admin.connectors[i].service
				}
			};

			// Save row
			rows.push(cols);
		}

		// Display the table
		ui.tableShow('connectorTable', rows);
	}
};
