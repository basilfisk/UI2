// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// Forms for the administration console
//
// *********************************************************************************************
// *********************************************************************************************

// ---------------------------------------------------------------------------------------
// Display the About form
// ---------------------------------------------------------------------------------------
function about_show () {
	var data = {}, i;

	data.username = me.username;
	data.company = me.company;
	data.group = me.group;
	data.clients = me.clients;
	data.jwt = me.jwt;
	for (i=0; i<admin.roles.length; i++) {
		if (admin.roles[i].code === me.role) {
			data.role = admin.roles[i].name;
		}
	}
	data.packages = me.packages.join(',');

	// Display form
//	ui.formEdit('aboutForm', data);
	ui.form('aboutForm', data);
}



// ---------------------------------------------------------------------------------------------
// Remove leading, trailing and duplicate spaces within a string
//
// Argument 1 : String to be cleaned
//
// Return cleaned-up string
// ---------------------------------------------------------------------------------------------
function clean_white_space (str) {
	str = str.replace(new RegExp('^ +'),'');		// Remove leading spaces
	str = str.replace(new RegExp(' +$'),'');		// Remove trailing spaces
	str = str.replace(new RegExp(' +','g'),' ');	// Remove duplicate spaces in the string
	return str;
}



// ---------------------------------------------------------------------------------------
// Invoke the API call triggered by ui.uiFormSave
//
// Argument 1 : Name of the form being processed
// Argument 2 : Data returned from the form
// ---------------------------------------------------------------------------------------
function form_post_process (name, data) {
	switch (name) {
		case 'commandAddForm':
			command_add_save(data);
			break;
		case 'commandEditForm':
			command_edit_save('common', data);
			break;
		case 'commandEditCommandForm':
			command_edit_save('command', data);
			break;
		case 'commandEditCommandForm-delete':
			command_delete_version('command', data);
			break;
		case 'commandEditParametersForm':
			command_edit_save('parameters', data);
			break;
		case 'commandEditParametersForm-delete':
			command_delete_version('parameters', data);
			break;
		case 'companyAddForm':
			data.groups = {"Internal":{"description":"Internal","plan":"standard"}};
			api_call('companyNew', data, company_table_load);
			break;
		case 'companyEditForm':
			company_edit_save(data);
			break;
//		case 'companyGroupAddForm':
//		case 'companyGroupEditForm':
//			company_group_upsert(data);
//			break;
		case 'connectorAddForm':
			data.company = admin.company.name;
			api_call('connectorNew', data, connector_table_load);
			break;
		case 'connectorEditForm-bash':
		case 'connectorEditForm-file':
		case 'connectorEditForm-mail':
		case 'connectorEditForm-mongo':
		case 'connectorEditForm-pgsql':
		case 'connectorEditForm-structure':
		case 'connectorEditForm-vsaas':
			data.company = admin.company.name;
			api_call('connectorUpdate', data, connector_table_load);
			break;
		case 'loginForm':
			api_call('loginCheck', {"username":data.username, "password":data.password}, login_read_user);
			break;
		case 'packageAddForm':
			data.company = admin.company.name;
			api_call('packageNew', data, package_table_load);
			break;
		case 'packageEditForm':
			data.company = admin.company.name;
			api_call('packageUpdate', data, package_table_load);
			break;
		case 'userAddForm':
			data.company = admin.company.name;
			api_call('userNew', data, user_table_load);
			break;
		case 'userEditForm':
			data.company = admin.company.name;
			api_call('userUpdate', data, user_table_load);
			break;
		default:
			console.error('form_post_process: Unmatched form name [' + name + ']');
	}
}



// ***************************************************************************************
//
//		COMPANIES
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new company document
// ---------------------------------------------------------------------------------------
function company_add () {
	ui.formAdd('companyAddForm');
}



// ---------------------------------------------------------------------------------------
// Delete the selected company
//
// Argument 1 : ID of company document
// ---------------------------------------------------------------------------------------
function company_delete (id) {
	api_call('companyDelete', {'_id': id}, company_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected company document for editing
//
// Argument 1 : ID of company document
// ---------------------------------------------------------------------------------------
function company_edit (id) {
	var i, index = -1, data = {};

	// If ID not passed as argument, edit the current company
	if (id === undefined) {
		for (i=0; i<admin.companies.length; i++) {
			index = (admin.companies[i].name === me.company) ? i : index;
		}
		id = admin.companies
	}
	// Find the selected comapny
	else {
		for (i=0; i<admin.companies.length; i++) {
			index = (admin.companies[i]._id === id) ? i : index;
		}
	}

	// Load company data into temporary object
	data.id = admin.companies[index]._id;
	data.name = admin.companies[index].name;

	// Display form for editing data
	ui.formEdit('companyEditForm', data);
}



// ---------------------------------------------------------------------------------------
// Save the selected company document after editing
//
// Argument 1 : Object holding company ID and name
// ---------------------------------------------------------------------------------------
function company_edit_save (data) {
	var i, index = -1;

	// Find the company
	for (i=0; i<admin.companies.length; i++) {
		index = (admin.companies[i]._id === data.id) ? i : index;
	}

	// Add the data group for the company
	data.groups = admin.companies[index].groups;
	api_call('companyUpdate', data, company_table_load);
}



// ---------------------------------------------------------------------------------------
// Read the details for the selected company
//
// Argument 1 : ID of company document
// ---------------------------------------------------------------------------------------
function company_select (id) {
	var i, filter;

	// Read the company name from the ID
	for (i=0; i<admin.companies.length; i++) {
		if (admin.companies[i]._id === id) {
			admin.company.name = admin.companies[i].name;
		}
	}

	// Close the company table form
	ui.formClose('companyTable');

	// Replace the current company data
	filter = (me.role === 'superuser') ? 'all' : id;
	api_call('companyReadId', { "filter":filter }, load_company_data);

	// Change the company name on the title bar
	ui.pageTitle(admin.company.name);
}



// ---------------------------------------------------------------------------------------
// Show all companies
// ---------------------------------------------------------------------------------------
function company_table_load () {
	var filter = (me.role === 'superuser') ? 'all' : me.company;
	api_call('companyRead', { "filter":filter }, company_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the company data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call (not relevant)
// ---------------------------------------------------------------------------------------
function company_table_show (action, result) {
	var i, rows = [], cols = [];

	// Extract data from result set and load into global 'admin.companies' variable
	admin.companies = [];
	for (i=0; i<result.data.length; i++) {
		admin.companies.push(result.data[i]);
	}

	// Add each element of the array as a table row
	for (i=0; i<admin.companies.length; i++) {
		cols = [];

		// Company name
		cols.push({"text":admin.companies[i].name});

		// Select button
		cols.push({"button":"company_select", "style":"success", "icon":"ok"});

		// Update button
		cols.push({"button":"company_edit", "style":"info", "icon":"pencil"});

		// Delete button
//		cols.push({"button":"company_delete", "style":"danger", "icon":"trash"});

		// Save row
		rows.push({"id":admin.companies[i]._id, "cols":cols});
	}

	// Display the table
	ui.table('companyTable', rows);
}



// ***************************************************************************************
//
//		COMPANY GROUPS
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new company group
// ---------------------------------------------------------------------------------------
function company_group_add () {
	var i, lists = {};

	// Load plans list
//	lists['companyGroupAddPlan'] = [];
	lists['plan'] = [];
	for (i=0; i<admin.plans.length; i++) {
//		lists['companyGroupAddPlan'].push({"value":admin.plans[i].id, "text":admin.plans[i].name});
		lists['plan'].push({"value":admin.plans[i].id, "text":admin.plans[i].name});
	}

//	ui.formAdd('companyGroupAddForm', lists);
	ui.form('groupForm', {}, lists);
}



// ---------------------------------------------------------------------------------------
// Delete the selected company group
//
// Argument 1 : ID of group (combination of company document ID and group name)
// ---------------------------------------------------------------------------------------
function company_group_delete (id) {
	var arr = [], data = {};

	// Extract document ID and group name
	arr = id.split(':');
	data.id = arr[0];
	data.name = arr[1];

	// Delete the group
	api_call('companyGroupDelete', data, company_group_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected company group document for editing
//
// Argument 1 : ID of company group document
// Argument 2 : Name of group
// Argument 3 : Description of group
// Argument 4 : Plan code
// ---------------------------------------------------------------------------------------
function company_group_edit (id, name, desc, plan) {
	var data = {}, i, lists = [];

	// Load user data into temporary object
	data.id = id;
	data.groups = {};
	data.groups.name = name;
	data.groups.description = desc;
	data.groups.plan = plan;

	// Load plans list
//	lists['companyGroupEditPlan'] = [];
	lists['plan'] = [];
	for (i=0; i<admin.plans.length; i++) {
//		lists['companyGroupEditPlan'].push({"value":admin.plans[i].id, "text":admin.plans[i].name});
		lists['plan'].push({"value":admin.plans[i].id, "text":admin.plans[i].name});
	}

	// Display form for editing data
//	ui.formEdit('companyGroupEditForm', data, lists);
	ui.form('groupForm', data, lists);
}



// ---------------------------------------------------------------------------------------
// Show all groups for the current company
// ---------------------------------------------------------------------------------------
function company_group_table_load () {
	api_call('companyReadId', { "filter":admin.company._id }, company_group_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the company group data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function company_group_table_show (action, result) {
	var data, groups, i, rows = [], cols = [], desc, plan, str, rowid;

	// Add each element of the array as a table row
	data = result.data[0];
	groups = Object.keys(data.groups);
	for (i=0; i<groups.length; i++) {
		cols = [];

		// Add column with link to edit form - only if user has permission to edit data
		desc = data.groups[groups[i]].description;
		plan = data.groups[groups[i]].plan;
		str = '<a onClick="company_group_edit(\'' + data._id + '\',\'' + groups[i] + '\',\'' + desc + '\',\'' + plan + '\');" data-toggle="modal">' + groups[i] + ' </a>';
		cols.push({"text":str});

		// Add information columns
		cols.push({"text":desc});
		cols.push({"text":plan});

		// Only add delete link if user has permission to edit data
		if (ui.userAccess('companyGroupEditForm')) {
//			cols.push({"button":"company_group_delete", "style":"danger", "icon":"trash"});
		}

		// Row ID is a combination of document ID and group name (used by delete function)
		rowid = data._id + ':' + groups[i];

		// Save row
		rows.push({"id":rowid, "cols":cols});
	}

	// Display the table
	ui.table('groupTable', rows);
}



// ---------------------------------------------------------------------------------------
// Add a new group to the company
//
// Argument 1 : Data from the form
// ---------------------------------------------------------------------------------------
/*function company_group_upsert (data) {
	var obj = {};

	obj.id = admin.company._id;
	obj.name = data.groups.name;
	obj.desc = data.groups.description;
	obj.plan = data.groups.plan;

	api_call('companyGroupUpsert', obj, company_group_table_load);
}
*/


// ***************************************************************************************
//
//		COMMANDS
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new command
// ---------------------------------------------------------------------------------------
function command_add () {
	var i, arr = [], lists = {};

	// Load list of services
	lists['commandAddService'] = [];
	for (i=0; i<admin.connectors.length; i++) {
		lists['commandAddService'].push({"value":admin.connectors[i].service, "text":admin.connectors[i].service});
	}

	ui.formAdd('commandAddForm', lists);
}



// ---------------------------------------------------------------------------------------
// Save a new command
//
// Argument 1 : Object holding command data (only name and service)
// ---------------------------------------------------------------------------------------
function command_add_save (data) {
	data.company = admin.company.name;
	data.command = [{"ver":1, "cmd":"Enter command here..."}];
	data.parameters = [{"ver":1, "prm":{"parameter":["value"]}}];
	api_call('commandNew', data, command_table_load);
}



// ---------------------------------------------------------------------------------------
// Delete the selected command
//
// Argument 1 : ID of command document
// ---------------------------------------------------------------------------------------
function command_delete (id) {
	api_call('commandDelete', {'_id': id}, command_table_load);
}



// ---------------------------------------------------------------------------------------
// Delete the selected version from a command or parameter
//
// Argument 1 : command|parameters
// Argument 2 : Data from form
// ---------------------------------------------------------------------------------------
function command_delete_version (type, data) {
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
	api_call('commandDeleteVersion', params, command_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected command document for editing
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function command_edit (id) {
	var i, index = -1, data = {}, arr = [], lists = [];

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
	lists['commandEditService'] = [];
	for (i=0; i<admin.connectors.length; i++) {
		lists['commandEditService'].push({"value":admin.connectors[i].service, "text":admin.connectors[i].service});
	}

	// Display form for editing data
	ui.formEdit('commandEditForm', data, lists);
}



// ---------------------------------------------------------------------------------------
// Display the command text for editing
//
// Argument 1 : Command document ID
// Argument 2 : Version number
// Argument 3 : Command text
// ---------------------------------------------------------------------------------------
function command_edit_cmd (id, ver, cmd) {
	var data = {};

	// Load command data into temporary object
	data.id = id;
	data.version = ver;
	data.command = cmd;

	// Display form for editing data
	ui.formEdit('commandEditCommandForm', data);
}



// ---------------------------------------------------------------------------------------
// Display the command parameters for editing
//
// Argument 1 : Command document ID
// Argument 2 : Version number
// Argument 3 : Parameters
// ---------------------------------------------------------------------------------------
function command_edit_prm (id, ver, prm) {
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
	ui.formEdit('commandEditParametersForm', data);
}



// ---------------------------------------------------------------------------------------
// Save command or parameter data into the selected command document after editing
//
// Argument 1 : common|command|parameters
// Argument 2 : Object holding command or parameter data to be updated
// ---------------------------------------------------------------------------------------
function command_edit_save (type, data) {
	var i, index = -1, temp = {}, cmd, found, add = {}, prms = [], arr, name, pattern, n, valstr, values, obj = {};

	// Find command using ID and save data in temporary object
	for (i=0; i<admin.commands.length; i++) {
		index = (admin.commands[i]._id === data.id) ? i : index;
	}
	temp = admin.commands[index];

	// Update specific elements for data depending on the form called
	switch (type) {
		case 'common':
			temp.name = data.name;
			temp.service = data.service;
			break;
		case 'command':
			// Escape newline characters
			cmd = data.command.replace(/(\n)+/g, '\\n');

			// Assign command to version number
			found = false;
			for (i=0; i<temp.command.length; i++) {
				if (temp.command[i].ver === parseInt(data.version)) {
					temp.command[i].cmd = cmd;
					found = true;
				}
			}

			// If no matching version found, add new version
			if (!found) {
				add = {};
				add.ver = parseInt(data.version);
				add.cmd = cmd;
				temp.command.push(add);
			}
			break;
		case 'parameters':
			// Convert string of edited data back to an object
			// site: *↵package: pack 3, pack 9
			prms = data.parameters.split('\n');
			for (i=0; i<prms.length; i++) {
				// Name and value(s) are separated by colon
				arr = prms[i].split(':');

				// Clean up name and check that it contains:
				// alphanumerics, minus, underscore, space, asterisk
				name = clean_white_space(arr[0]);
				name = name.replace(/\"/g, '');
				pattern = /^[a-z\d\-_\*\s]+$/i;
				if (!pattern.test(name)) {
					ui.messageBox('FRM001', [name]);
					return;
				}

				// Clean up parameters and remove quotes
				valstr = clean_white_space(arr[1]);
				valstr = valstr.replace(/\"/g, '');

				// Values separated by commas
				values = valstr.split(',');

				// Check that parameters contain:
				// alphanumerics, minus, underscore, space, asterisk
				pattern = /^[a-z\d\-_\*\s]+$/i;
				for (n=0; n<values.length; n++) {
					if (!pattern.test(values[n])) {
						ui.messageBox('FRM002', [values[n]]);
						return;
					}
				}

				// Assign values to temp parameter object
				obj[name] = values;
			}

			// Assign parameter object to correct version
			found = false;
			for (i=0; i<temp.parameters.length; i++) {
				if (temp.parameters[i].ver === parseInt(data.version)) {
					temp.parameters[i].prm = obj;
					found = true;
				}
			}

			// If no matching version found, add new version
			if (!found) {
				add = {};
				add.ver = parseInt(data.version);
				add.prm = obj;
				temp.parameters.push(add);
			}
			break;
	}

	// Save data
	api_call('commandUpdate', temp, command_table_load);
}



// ---------------------------------------------------------------------------------------
// Show all commands for the current company
// ---------------------------------------------------------------------------------------
function command_table_load () {
	api_call('commandRead', { "filter":admin.company.name }, command_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the command data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function command_table_show (action, result) {
	var i, rows = [], cols = [], obj = {}, n, ver, cmd, prm, str;

	// Extract data from result set and load into global 'admin.users' variable
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
		if (ui.userAccess('commandEditForm')) {
			obj.link = 'command_edit';
		}
		cols.push(obj);

		// Show service column
		cols.push({"text":admin.commands[i].service});

		// Add links to versions of the command
		str = '';
		for (n=0; n<admin.commands[i].command.length; n++) {
			ver = admin.commands[i].command[n].ver;
			cmd = admin.commands[i].command[n].cmd;
			str += '<a onClick="command_edit_cmd(\'' + admin.commands[i]._id + '\',\'' + ver + '\',\'' + cmd + '\');" href="#" data-toggle="modal">v' + ver + ' </a>';
		}
		cols.push({"text":str});

		// Add links to versions of the parameters
		str = '';
		for (n=0; n<admin.commands[i].parameters.length; n++) {
			ver = admin.commands[i].parameters[n].ver;
			prm = JSON.stringify(admin.commands[i].parameters[n].prm);
			prm = prm.replace(/\"/g, '');
			str += '<a onClick="command_edit_prm(\'' + admin.commands[i]._id + '\',' + ver + ',\'' + prm + '\');" href="#" data-toggle="modal">v' + ver + '</a> ';
		}
		cols.push({"text":str});

		// Only add delete link if user has permission to edit data
		if (ui.userAccess('commandEditForm')) {
//			cols.push({"button":"command_delete", "style":"danger", "icon":"trash"});
		}

		// Save row
		rows.push({"id":admin.commands[i]._id, "cols":cols});
	}

	// Display the table
	ui.table('commandTable', rows);
}



// ***************************************************************************************
//
//		CONNECTORS
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new connector document
// ---------------------------------------------------------------------------------------
function connector_add () {
	var i, lists = [];

	lists['connectorAddService'] = [];
	for (i=0; i<admin.services.length; i++) {
		lists['connectorAddService'].push({"value":admin.services[i].code, "text":admin.services[i].name});
	}

	ui.formAdd('connectorAddForm', lists);
}



// ---------------------------------------------------------------------------------------
// Delete the selected connector
//
// Argument 1 : ID of connector document
// ---------------------------------------------------------------------------------------
function connector_delete (id) {
	api_call('connectorDelete', {'_id': id}, connector_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected connector document for editing
//
// Argument 1 : ID of connector document
// ---------------------------------------------------------------------------------------
function connector_edit (id) {
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
	ui.formEdit('connectorEditForm-' + admin.connectors[index].service, data);
}



// ---------------------------------------------------------------------------------------
// Show all connectors for the current company
// ---------------------------------------------------------------------------------------
function connector_table_load () {
	api_call('connectorRead', { "filter":admin.company.name }, connector_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the connector data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function connector_table_show (action, result) {
	var i, rows = [], cols = [], obj = {};

	// Extract data from result set and load into global 'admin.connectors' variable
	admin.connectors = [];
	for (i=0; i<result.data.length; i++) {
		admin.connectors.push(result.data[i]);
	}

	// Add each element of the array as a table row
	for (i=0; i<admin.connectors.length; i++) {
		cols = [];

		// Add column with link to edit form - only if user has permission to edit data
		obj = {};
		obj.text = admin.connectors[i].name;
		if (admin.connectors[i].name !== undefined) {
			obj.link = 'connector_edit';
		}
		cols.push(obj);

		// Add information columns
		cols.push({"text":admin.connectors[i].service});

		// Only add delete link if user has permission to edit data
		if (admin.connectors[i].name !== undefined) {
//			cols.push({"button":"connector_delete", "style":"danger", "icon":"trash"});
		}

		// Save row
		rows.push({"id":admin.connectors[i]._id, "cols":cols});
	}

	// Display the table
	ui.table('connectorTable', rows);
}



// ***************************************************************************************
//
//		PACKAGES
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new package
// ---------------------------------------------------------------------------------------
function package_add () {
	var i, lists = {};

	// Load commands list
	lists['packageAddCommand'] = [];
	for (i=0; i<admin.commands.length; i++) {
		options.push({"value":admin.commands[i].name, "text":admin.commands[i].name});
	}

	// Load connectors list
	lists['packageAddConnector'] = [];
	for (i=0; i<admin.connectors.length; i++) {
		lists['packageAddConnector'].push({"value":admin.connectors[i].name, "text":admin.connectors[i].name});
	}

	ui.formAdd('packageAddForm', lists);
}



// ---------------------------------------------------------------------------------------
// Delete the selected package
//
// Argument 1 : Type of package
// ---------------------------------------------------------------------------------------
function package_delete (id) {
	api_call('packageDelete', {'_id': id}, package_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected package document for editing
//
// Argument 1 : ID of package document
// ---------------------------------------------------------------------------------------
function package_edit (id) {
	var i, index = -1, data = {}, lists = [];

	// Find the selected document
	for (i=0; i<admin.packages.length; i++) {
		index = (admin.packages[i]._id === id) ? i : index;
	}

	// Load package data into temporary object
	data.id = admin.packages[index]._id;
	data.name = admin.packages[index].name;
	data.command = admin.packages[index].command;
	data.connector = admin.packages[index].connector;
	data.version = {};
	data.version.cmd = admin.packages[index].version.cmd;
	data.version.prms = admin.packages[index].version.prms;

	// Load connectors list
	lists['packageEditConnector'] = [];
	for (i=0; i<admin.connectors.length; i++) {
		lists['packageEditConnector'].push({"value":admin.connectors[i].name, "text":admin.connectors[i].name});
	}

	// Load commands list
	lists['packageEditCommand'] = [];
	for (i=0; i<admin.commands.length; i++) {
		lists['packageEditCommand'].push({"value":admin.commands[i].name, "text":admin.commands[i].name});
	}

	// Display form for editing data
	ui.formEdit('packageEditForm', data, lists);
}



// ---------------------------------------------------------------------------------------
// Show all packages for the current company
// ---------------------------------------------------------------------------------------
function package_table_load () {
	api_call('packageRead', { "filter":admin.company.name }, package_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the package data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function package_table_show (action, result) {
	var i, rows = [], cols = [], obj = {}, ver;

	// Extract data from result set and load into global 'admin.packages' variable
	admin.packages = [];
	for (i=0; i<result.data.length; i++) {
		admin.packages.push(result.data[i]);
	}

	// Add each element of the array as a table row
	for (i=0; i<admin.packages.length; i++) {
		cols = [];

		// Add column with link to edit form - only if user has permission to edit data
		obj = {};
		obj.text = admin.packages[i].name;
		if (ui.userAccess('packageEditForm')) {
			obj.link = 'package_edit';
		}
		cols.push(obj);

		// Add information columns
		cols.push({"text":admin.packages[i].command});
		cols.push({"text":admin.packages[i].connector});
		ver = 'Cmd v' + admin.packages[i].version.cmd + ' / ';
		ver += 'Prm v' + admin.packages[i].version.prms;
		cols.push({"text":ver});

		// Only add delete link if user has permission to edit data
		if (ui.userAccess('packageEditForm')) {
//			cols.push({"button":"package_delete", "style":"danger", "icon":"trash"});
		}

		// Save row
		rows.push({"id":admin.packages[i]._id, "cols":cols});
	}

	// Display the table
	ui.table('packageTable', rows);
}



// ***************************************************************************************
//
//		USERS
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Add a new user
// ---------------------------------------------------------------------------------------
function user_add () {
	var keys, i, arr = [], lists = {};

	// Load list of groups
	keys = Object.keys(admin.company.groups);
	lists['userAddGroup'] = [];
	for (i=0; i<keys.length; i++) {
		lists['userAddGroup'].push({"value":keys[i], "text":keys[i]});
	}

	// Load role list - only role to list if role is same or lower than current user
	lists['userAddRole'] = [];
	for (i=0; i<admin.roles.length; i++) {
		if (admin.roles[i].level >= me.level) {
			lists['userAddRole'].push({"value":admin.roles[i].code, "text":admin.roles[i].name});
		}
	}

	// Load unique list of packages
	arr = [];
	lists['userAddPackages'] = [];
	for (i=0; i<admin.packages.length; i++) {
		if (arr.indexOf(admin.packages[i].name) === -1) {
			arr.push(admin.packages[i].name);
			lists['userAddPackages'].push({"value":admin.packages[i].name, "text":admin.packages[i].name});
		}
	}

	ui.formAdd('userAddForm', lists);
}



// ---------------------------------------------------------------------------------------
// Delete the selected user
//
// Argument 1 : ID of user
// ---------------------------------------------------------------------------------------
function user_delete (id) {
	api_call('userDelete', {'_id': id}, user_table_load);
}



// ---------------------------------------------------------------------------------------
// Open the selected user document for editing
//
// Argument 1 : ID of user document
// ---------------------------------------------------------------------------------------
function user_edit (id) {
	var i, index = -1, data = {}, keys, arr = [], lists = [];

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
	data.packages = admin.users[index].packages;

	// Load list of groups
	keys = Object.keys(admin.company.groups);
	lists['userEditGroup'] = [];
	for (i=0; i<keys.length; i++) {
		lists['userEditGroup'].push({"value":keys[i], "text":keys[i]});
	}

	// Load role list
	lists['userEditRole'] = [];
	for (i=0; i<admin.roles.length; i++) {
		lists['userEditRole'].push({"value":admin.roles[i].code, "text":admin.roles[i].name});
	}

	// Load unique list of packages
	arr = [];
	lists['userEditPackages'] = [];
	for (i=0; i<admin.packages.length; i++) {
		if (arr.indexOf(admin.packages[i].name) === -1) {
			arr.push(admin.packages[i].name);
			lists['userEditPackages'].push({"value":admin.packages[i].name, "text":admin.packages[i].name});
		}
	}

	// Display form for editing data
	ui.formEdit('userEditForm', data, lists);
}



// ---------------------------------------------------------------------------------------
// Show all users for the current company
// ---------------------------------------------------------------------------------------
function user_table_load () {
	api_call('userRead', { "filter":admin.company.name }, user_table_show);
}



// ---------------------------------------------------------------------------------------
// Display the user data in a table
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function user_table_show (action, result) {
	var i, data, n, rows = [], cols = [], obj = {};

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
			cols = [];

			// Add column with link to edit form - only if user has permission to edit data
			obj = {};
			obj.text = admin.users[i].username;
			if (ui.userAccess('userEditForm')) {
				obj.link = 'user_edit';
			}
			cols.push(obj);

			// Add information columns
			cols.push({"text":admin.users[i].group});
			cols.push({"text":admin.users[i].role});

			// Only add delete link if user has permission to edit data
			if (ui.userAccess('userEditForm')) {
//				cols.push({"button":"user_delete", "style":"danger", "icon":"trash"});
			}

			// Save row
			rows.push({"id":admin.users[i]._id, "cols":cols});
		}
	}

	// Display the table
	ui.table('userTable', rows);
}
