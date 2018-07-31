/**
 * @file about.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace General
 * @author Basil Fisk
 * @description Display the About form.
 */
var about = {
	/**
	 * @method show
	 * @author Basil Fisk
	 * @description Display the About form.
	 */
	show: function () {
		var data, i;

		data = {
			aboutBundles: { text: me.bundles.join(',') },
			aboutClients: { text: me.clients },
			aboutCompany: { text: me.company },
			aboutEmail: { text: me.email },
			aboutGroup: { text: me.group },
			aboutJWT: { text: me.jwt },
			aboutUserName: { text: me.name },
			aboutLoginName: { text: me.username }
		};
		data.aboutRole = {};
		for (i=0; i<admin.roles.length; i++) {
			if (admin.roles[i].code === me.role) {
				data.aboutRole.text = admin.roles[i].name;
			}
		}

		// Display form
		ui.formEdit('about', data);
	}
};
