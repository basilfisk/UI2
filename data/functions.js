/**
 * @file functions.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace UserFunctions
 * @author Basil Fisk
 * @property {integer} xxx ???????????
 * @description User defined functions for controlling the operation of forms in UI2.
 */
var UserFunctions = {
	xxx: 0,

	/**
	 * @method groupUpsert
	 * @author Basil Fisk
	 * @param {object} data Data object read from the form.
	 * @description Functions for controlling the operation of forms in UI2.
	 */
	groupUpsert: function (data) {
		var obj = {};

		obj.id = admin.company._id;
		obj.name = data.groups.name;
		obj.desc = data.groups.description;
		obj.plan = data.groups.plan;

		api_call('companyGroupUpsert', obj, company_group_table_load);
	}
};

UserFunctions.init(); // ???????????????
