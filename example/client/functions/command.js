/**
 * @file command.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Command
 * @author Basil Fisk
 * @description Interchange of 'command' data between the UI and the MongoDB database.
 */
var command = {
	/**
	 * @method add
	 * @author Basil Fisk
	 * @description Add a new command.
	 */
	add: function () {
		var i, arr = [], options = [], lists = {};

		// Load list of services
		for (i=0; i<admin.connectors.length; i++) {
			options.push({"value":admin.connectors[i].service, "text":admin.connectors[i].service});
		}
		lists['commandAddService'] = general.sortArrayObjects(options, 'text');

		ui.formAdd('commandAdd', lists);
	},


	/**
	 * @method addSave
	 * @author Basil Fisk
	 * @param {object} data Object holding command data (only name and service).
	 * @description Save a new command.
	 */
	addSave: function (data) {
		data.company = admin.company.code;
		data.command = [{"ver":1, "cmd":"Enter command here..."}];
		data.parameters = [{"ver":1, "prm":{"parameter":["value"]}}];
		common.apiCall('commandNew', data, command.load);
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {string} data ID of command document.
	 * @description Delete the selected command.
	 */
	delete: function (id) {
		common.apiCall('commandDelete', {'_id': id}, command.load);
	},


	/**
	 * @method deleteVersion
	 * @author Basil Fisk
	 * @param {string} type "command|parameters"
	 * @param {object} data Data from form.
	 * @description Delete the selected version from a command or parameter.
	 */
	deleteVersion: function (type, data) {
		var id, ver, params = {};

		// Read the document ID and the version
		if (type === 'command') {
			id = data['commandEditCommandId'];
			ver = data['commandEditCommandVersion'];
		}
		else {
			id = data['commandEditParametersId'];
			ver = data['commandEditParametersVersion'];
		}

		// Load the parameters and run the update to delete the element
		params['id'] = id;
		params['ver'] = parseInt(ver);
		params['type'] = type;
		common.apiCall('commandDeleteVersion', params, command.load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {string} id ID of the command to be edited.
	 * @description Open the selected command document for editing.
	 */
	edit: function (id) {
		var i, index = -1, data = {}, arr = [], options = [], lists = [];

		// Find the selected document
		for (i=0; i<admin.commands.length; i++) {
			index = (admin.commands[i]._id === id) ? i : index;
		}

		// Load command data into temporary object
		data.id = admin.commands[index]._id;
		data.name = admin.commands[index].name;
		data.service = admin.commands[index].service;
		data.command = admin.commands[index].command;
		data.parameters = admin.commands[index].parameters;

		// Load list of services
		for (i=0; i<admin.connectors.length; i++) {
			options.push({"value":admin.connectors[i].service, "text":admin.connectors[i].service});
		}
		lists['commandEditService'] = general.sortArrayObjects(options, 'text');

		// Display form for editing data
		ui.formEdit('commandEdit', data, lists);
	},


	/**
	 * @method editCommand
	 * @author Basil Fisk
	 * @param {string} id ID of the command to be edited.
	 * @param {string} ver New version number.
	 * @param {string} cmd Command text.
	 * @description Display the command text for editing.
	 */
	editCommand: function (id, ver, cmd) {
		var data = {};

		// Load command data into temporary object
		data.id = id;
		data.version = ver;
		data.command = cmd;

		// Display form for editing data
		ui.formEdit('commandEditCommand', data);
	},


	/**
	 * @method editParameter
	 * @author Basil Fisk
	 * @param {string} id ID of the command to be edited.
	 * @param {string} ver New version number.
	 * @param {string} cmd Parameters.
	 * @description Display the command parameters for editing.
	 */
	editParameter: function (id, ver, prm) {
		var data = {};

		// Split into 1 row/parameter
		prm = prm.replace(/],/g, ']\n');

		// Convert quotes back from HTML encoding and remove {}
		prm = prm.replace(/^{/, '');
		prm = prm.replace(/}$/, '');
		prm = prm.replace(/\[/g, '');
		prm = prm.replace(/\]/g, '');

		// Load command data into temporary object
		data.id = id;
		data.version = ver;
		data.parameters = prm;

		// Display form for editing data
		ui.formEdit('commandEditParameters', data);
	},


	/**
	 * @method editSave
	 * @author Basil Fisk
	 * @description Save command document after editing.
	 */
	editSave: function () {
		var i, index = -1, data;

		// Find command using ID and save data in temporary object
		for (i=0; i<admin.commands.length; i++) {
			index = (admin.commands[i]._id === this.id) ? i : index;
		}

		if (index === -1) {
			ui.messageBox('CMD001', [this.id]);
		}
		else {
			data = admin.commands[index];
			data.name = this.name;
			data.service = this.service;
console.log('editSave', data);
			common.apiCall('commandUpdate', data, command.load);
		}
	},


	/**
	 * @method editSaveCommand
	 * @author Basil Fisk
	 * @description Save command into the selected command document after editing.
	 */
	editSaveCommand: function () {
		var i, index = -1, data, cmd, found, add = {};

		// Find command using ID and save data in temporary object
		for (i=0; i<admin.commands.length; i++) {
			index = (admin.commands[i]._id === this.id) ? i : index;
		}

		if (index === -1) {
			ui.messageBox('CMD001', [this.id]);
		}
		else {
			data = admin.commands[index];

			// Escape newline characters
			cmd = this.command.replace(/(\n)+/g, '\\n');

			// Assign command to version number
			found = false;
			for (i=0; i<data.command.length; i++) {
				if (data.command[i].ver === parseInt(this.version)) {
					data.command[i].cmd = cmd;
					found = true;
				}
			}

			// If no matching version found, add new version
			if (!found) {
				add = {};
				add.ver = parseInt(this.version);
				add.cmd = cmd;
				data.command.push(add);
console.log(data);
				common.apiCall('commandUpdate', data, command.load);
			}
		}
	},


	/**
	 * @method editSaveParameters
	 * @author Basil Fisk
	 * @description Save parameters into the selected command document after editing.
	 */
	editSaveParameters: function () {
		var i, index = -1, data, cmd, found, prms = [], arr, name, pattern, n, str, values, obj = {};

		// Find command using ID and save data in temporary object
		for (i=0; i<admin.commands.length; i++) {
			index = (admin.commands[i]._id === this.id) ? i : index;
		}

		if (index === -1) {
			ui.messageBox('CMD001', [this.id]);
		}
		else {
			data = admin.commands[index];

			// Convert string of edited data back to an object
			// site: *↵package: pack 3, pack 9
			prms = this.parameters.split('\n');
			for (i=0; i<prms.length; i++) {
				// Name and value(s) are separated by colon
				arr = prms[i].split(':');

				// Clean up name and check that it contains:
				// alphanumerics, minus, underscore, space, asterisk
				name = cleanWhiteSpace(arr[0]);
				name = name.replace(/\"/g, '');
				pattern = /^[a-z\d\-_\*\s]+$/i;
				if (!pattern.test(name)) {
					message('CMD002', [name]);
					return;
				}

				// Clean up parameters and remove quotes
				str = cleanWhiteSpace(arr[1]);
				str = str.replace(/\"/g, '');

				// Values separated by commas
				values = str.split(',');

				// Check that parameters contain:
				// alphanumerics, minus, underscore, space, asterisk
				pattern = /^[a-z\d\-_\*\s]+$/i;
				for (n=0; n<values.length; n++) {
					if (!pattern.test(values[n])) {
						message('CMD003', [values[n]]);
						return;
					}
				}

				// Assign values to temp parameter object
				obj[name] = values;
			}

			// Assign parameter object to correct version
			found = false;
			for (i=0; i<data.parameters.length; i++) {
				if (data.parameters[i].ver === parseInt(this.version)) {
					data.parameters[i].prm = obj;
					found = true;
				}
			}

			// If no matching version found, add new version
			if (!found) {
				add = {};
				add.ver = parseInt(this.version);
				add.prm = obj;
				data.parameters.push(add);
console.log(data);
				common.apiCall('commandUpdate', data, command.load);
			}
		}
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @description Show all commands for the current company.
	 */
	load: function () {
		common.apiCall('commandRead', { "filter":admin.company.code }, command.showTable);
	},


	/**
	 * @method showTable
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the command data in a table.
	 */
	showTable: function (action, result) {
		var i, rows = [], cols = [], obj = {}, n, ver, cmd, prm, str;

		// Extract data from result set and load into global 'admin.commands' variable
		admin.commands = [];
		for (i=0; i<result.data.length; i++) {
			admin.commands.push(result.data[i]);
		}

		// Add each element of the array as a table row
		for (i=0; i<admin.commands.length; i++) {
			cols = [];

			// Add column with link to edit form - only if user has permission to edit data
			obj = {};
			obj.text = admin.commands[i].name;
			if (ui.userAccess('commandEdit')) {
				obj.link = 'command.edit';
			}
			cols.push(obj);

			// Show service column
			cols.push({"text":admin.commands[i].service});

			// Add links to versions of the command
			str = '';
			for (n=0; n<admin.commands[i].command.length; n++) {
				ver = admin.commands[i].command[n].ver;
				cmd = admin.commands[i].command[n].cmd;
				str += '<a onClick="command.editCommand(\'' + admin.commands[i]._id + '\',\'' + ver + '\',\'' + cmd + '\');" href="#" data-toggle="modal">v' + ver + ' </a>';
			}
			cols.push({"text":str});

			// Add links to versions of the parameters
			str = '';
			for (n=0; n<admin.commands[i].parameters.length; n++) {
				ver = admin.commands[i].parameters[n].ver;
				prm = JSON.stringify(admin.commands[i].parameters[n].prm);
				prm = prm.replace(/\"/g, '');
				str += '<a onClick="command.editParameter(\'' + admin.commands[i]._id + '\',' + ver + ',\'' + prm + '\');" href="#" data-toggle="modal">v' + ver + '</a> ';
			}
			cols.push({"text":str});

			// Only add delete link if user has permission to edit data
			if (ui.userAccess('commandEdit')) {
				cols.push({"button":"command.delete", "style":"danger", "icon":"trash"});
			}

			// Save row
			rows.push({"id":admin.commands[i]._id, "cols":cols});
		}

		// Display the table
		ui.tableShow('commandTable', rows);
	}
};
    