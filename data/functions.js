/**
* @file function.js
* @author Basil Fisk
* @copyright Breato Ltd 2018
* @description User defined functions for controlling the operation of forms in UI2.
*/

/**
 * @constructor Functions
 * @author Basil Fisk
 * @description Functions for controlling the operation of forms in UI2.
 */
class Functions {
	constructor () {
	}

	/**
	 * @method init
	 * @memberof Functions
	 * @param {object} data Data object read from the form.
	 * @description Add a new group to the company.
	 */
	groupUpsert (data) {
		var obj = {};

		obj.id = admin.company._id;
		obj.name = data.groups.name;
		obj.desc = data.groups.description;
		obj.plan = data.groups.plan;

		api_call('companyGroupUpsert', obj, company_group_table_load);
	}
}

exports.module Functions;
