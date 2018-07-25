	/**
	 * @file company.js
	 * @author Basil Fisk
	 * @copyright Breato Ltd 2018
	 */

	/**
	 * @namespace Company
	 * @author Basil Fisk
	 * @description Interchange of 'company' data between the UI and the MongoDB database.
	 */
	var company = {
	/**
	 * @method add
	 * @author Basil Fisk
	 * @description Add a new company.
	 */
	add: function () {
		ui.formAdd('companyAddForm');
	},


	/**
	 * @method delete
	 * @author Basil Fisk
	 * @param {string} data ID of company document.
	 * @description Delete the selected company.
	 */
	delete: function (id) {
		common.apiCall('companyDelete', {'_id': id}, company_table_load);
	},


	/**
	 * @method edit
	 * @author Basil Fisk
	 * @param {string} id ID of the company to be edited.
	 * @description Open the selected company document for editing.
	 */
	edit: function (id) {
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
	},


	/**
	 * @method editSave
	 * @author Basil Fisk
	 * @param {object} data Object holding company or parameter data to be updated.
	 * @description Save the selected company document after editing.
	 */
	editSave: function (data) {
		var i, index = -1;

		// Find the company
		for (i=0; i<admin.companies.length; i++) {
			index = (admin.companies[i]._id === data.id) ? i : index;
		}

		// Add the data group for the company
		data.groups = admin.companies[index].groups;
		common.apiCall('companyUpdate', data, company_table_load);
	},


	/**
	 * @method load
	 * @author Basil Fisk
	 * @description Show all companies.
	 */
	load: function () {
		var filter = (me.role === 'superuser') ? 'all' : me.company;
		common.apiCall('companyRead', { "filter":filter }, company_table_show);
	},


	/**
	 * @method select
	 * @author Basil Fisk
	 * @param {string} id ID of the company to be edited.
	 * @description Read the details for the selected company.
	 */
	select: function (id) {
		var i, filter;

		// Read the company name from the ID
		for (i=0; i<admin.companies.length; i++) {
			if (admin.companies[i]._id === id) {
				admin.company.code = admin.companies[i].name;
			}
		}

		// Close the company table form
		ui.formClose('companyTable');

		// Replace the current company data
		filter = (me.role === 'superuser') ? 'all' : id;
		common.apiCall('companyReadId', { "filter":filter }, load_company_data);

		// Change the company name on the title bar
		ui.pageTitle(admin.company.code);
	},


	/**
	 * @method showTable
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the company data in a table.
	 */
	showTable: function (action, result) {
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
			cols.push({"button":"company_delete", "style":"danger", "icon":"trash"});

			// Save row
			rows.push({"id":admin.companies[i]._id, "cols":cols});
		}

		// Display the table
		ui.tableShow('companyTable', rows);
	},


	/**
	 * @method groupAdd
	 * @author Basil Fisk
	 * @description Add a new company group.
	 */
	groupAdd: function () {
		var i, options = [], lists = {};

		// Load plans list
		options = [];
		for (i=0; i<admin.plans.length; i++) {
			options.push({"value":admin.plans[i].id, "text":admin.plans[i].name});
		}
		lists['companyGroupAddPlan'] = formFunctions.sortArrayObjects(options, 'text');

		ui.formAdd('companyGroupAddForm', lists);
	},


	/**
	 * @method groupDelete
	 * @author Basil Fisk
	 * @param {string} id ID of group (combination of company document ID and group name).
	 * @description Delete the selected company group.
	 */
	groupDelete: function (id) {
		var arr = [], data = {};

		// Extract document ID and group name
		arr = id.split(':');
		data.id = arr[0];
		data.name = arr[1];

		// Delete the group
		common.apiCall('companyGroupDelete', data, company_group_table_load);
	},


	/**
	 * @method groupEdit
	 * @author Basil Fisk
	 * @param {string} id ID of the company group to be edited.
	 * @param {string} name Name of the group.
	 * @param {string} desc Description of the group.
	 * @param {string} plan Plan code.
	 * @description Open the selected company group document for editing.
	 */
	groupEdit: function (id, name, desc, plan) {
		var data = {}, i, options = [], lists = [];

		// Load user data into temporary object
		data.id = id;
		data.groups = {};
		data.groups.name = name;
		data.groups.description = desc;
		data.groups.plan = plan;

		// Load plans list
		options = [];
		for (i=0; i<admin.plans.length; i++) {
			options.push({"value":admin.plans[i].id, "text":admin.plans[i].name});
		}
		lists['companyGroupEditPlan'] = formFunctions.sortArrayObjects(options, 'text');

		// Display form for editing data
		ui.formEdit('companyGroupEditForm', data, lists);
	},


	/**
	 * @method groupLoad
	 * @author Basil Fisk
	 * @description Show all groups for the current company.
	 */
	groupLoad: function () {
		common.apiCall('companyReadId', { "filter":admin.company._id }, company_group_table_show);
	},


	/**
	 * @method groupShow
	 * @author Basil Fisk
	 * @param {string} action Action (not relevant).
	 * @param {object} result Data object returned by the API call.
	 * @description Display the company group data in a table.
	 */
	groupShow: function (action, result) {
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
				cols.push({"button":"company_group_delete", "style":"danger", "icon":"trash"});
			}

			// Row ID is a combination of document ID and group name (used by delete function)
			rowid = data._id + ':' + groups[i];

			// Save row
			rows.push({"id":rowid, "cols":cols});
		}

		// Display the table
		ui.tableShow('companyGroupTable', rows);
	},


	/**
	 * @method groupUpsert
	 * @author Basil Fisk
	 * @param {object} data Data object from the form.
	 * @description Add a new group to the company.
	 */
	groupUpsert: function (data) {
		var obj = {};

		obj.id = admin.company._id;
		obj.name = data.groups.name;
		obj.desc = data.groups.description;
		obj.plan = data.groups.plan;

		common.apiCall('companyGroupUpsert', obj, company_group_table_load);
	}
};
