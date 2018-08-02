/**
 * @file login.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace Login
 * @author Basil Fisk
 * @description Functions that control the application's login process.
 */
var login = {
	/**
	 * @method check
	 * @author Basil Fisk
	 * @description Validate the user credentials entered on the login page.
	 */
	check: function () {
		common.apiCall('userLogin', {"username":this.username, "password":this.password}, login.readUser, login.init);
	},


	/**
	 * @method init
	 * @author Basil Fisk
	 * @description Start up function called by 'body onload'.
	 */ 
	init: function () {
		// Initialize UI manager and load application messages
		ui.init(messages);

		// Display the login form for the Admin Console
		var data = {
			loginName: { text: 'admin' },
			loginPassword: { text: 'password' }
		};
		ui.formEdit('login', data);
	},


	/**
	 * @method readBundles
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Read bundles for the company.
	 */
	readBundles: function (action, result) {
		if (result.data !== undefined && result.result.status) {
			// Clear out the existing bundles
			admin.bundles.splice(0, admin.bundles.length);

			// Load bundles
			admin.bundles = result.data.sort();
			login.setProgress('bundle');
		}
		else {
			ui.messageBox('LOG003', [admin.company.name]);
		}
	},


	/**
	 * @method readCompany
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Load company data returned from database into global variables.
	 */
	readCompany: function (action, result) {
		var data, i;

		// If no company has been selected yet, start with user's company
		if (admin.company.code === undefined) {
			admin.company.code = me.company;
		}

		// Clear out the existing company data
		admin.companies.splice(0, admin.companies.length);

		// Load list of companies and data for user's company
		if (result.data !== undefined && result.result.status) {
			for (i=0; i<result.data.length; i++) {
				// For the super user, load an array with ID and name of all companies
				// TODO This version only has 1 company / database
				if (me.role === 'superuser') {
					admin.companies.push(result.data[i]);
				}

				// Load user's company data
				if (admin.company.code === result.data[i].code) {
					admin.company = result.data[i];

					// Read all commands used by the company
					common.apiCall('commandRead', { "filter":admin.company.code }, login.readCommands);

					// Read all commands used by the company
					common.apiCall('connectorRead', { "filter":admin.company.code }, login.readConnectors);

					// Read all bundles used by the company
					common.apiCall('bundleRead', {"filter":admin.company.code}, login.readBundles);
				}
			}
			login.setProgress('company');
		}
		else {
			ui.messageBox('LOG007', []);
		}
	},


	/**
	 * @method readCommands
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Read commands for the company.
	 */
	readCommands: function (action, result) {
		if (result.data !== undefined && result.result.status) {
			// Clear out the existing commands
			admin.commands.splice(0, admin.commands.length);

			// Load commands
			admin.commands = result.data.sort();
			login.setProgress('command');
		}
		else {
			ui.messageBox('LOG001', [admin.company.name]);
		}
	},


	/**
	 * @method readConnectors
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Read connectors for the company.
	 */
	readConnectors: function (action, result) {
		if (result.data !== undefined && result.result.status) {
			// Clear out the existing connectors
			admin.connectors.splice(0, admin.bundles.length);

			// Load connectors
			admin.connectors = result.data.sort();
			login.setProgress('connector');
		}
		else {
			ui.messageBox('LOG002', [admin.company.name]);
		}
	},


	/**
	 * @method readPlans
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Load plans returned from database. Plans apply to all companies.
	 */
	readPlans: function (action, result) {
		if (result.data !== undefined) {
			admin.plans = [];
			for (i=0; i<result.data.length; i++) {
				admin.plans.push({"id":result.data[i].code, "name":result.data[i].name});
			}
			login.setProgress('plan');
		}
		else {
			ui.messageBox('LOG004', []);
		}
	},


	/**
	 * @method readRoles
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Process the result of the login check.
	 */
	readRoles: function (action, result) {
		if (result.data !== undefined) {
			admin.roles = result.data;
	
			// Add role level to user's object
			for (i=0; i<admin.roles.length; i++) {
				if (admin.roles[i].code === me.role) {
					me.level = admin.roles[i].level;
				}
			}
			login.setProgress('role');
		}
		else {
			ui.messageBox('LOG005', []);
		}
	},


	/**
	 * @method readUser
	 * @author Basil Fisk
	 * @param {string} action Action to be performed - 'result' shows data.
	 * @param {object} result Result returned from database.
	 * @description Process the result of the login check.
	 */
	readUser: function (action, result) {
		// Only 1 user record should be returned
		if (result.result.status === 1) {
			me = {};
			me.bundles = result.data.bundles;
			me.clients = result.data.clients;
			me.company = result.data.company;
			me.email = result.data.email;
			me.group = result.data.group;
			me.groupUsers = result.data.groupUsers;
			me.jwt = result.data.jwt;
			me.name = result.data.name;
			me.role = result.data.role;
			me.username = result.data.username;

			// TODO Add user language
			me.language = 'eng';

			// Build the menus
			ui.menus(me.role, me.language);

			// The super user can view all companies, others can only see their company's data
			filter = (me.role === 'superuser') ? 'all' : me.company;
			common.apiCall('companyRead', { "filter":filter }, login.readCompany);

			// Load the plan lists from the plan collection (same for all companies)
			common.apiCall('listPlans', {}, login.readPlans);

			// Load the roles lists from the user collection (same for all users)
			common.apiCall('listRoles', {}, login.readRoles);
			login.setProgress('user');
		}
		// Show error, then display login form again
		else {
			ui.messageBox('LOG006', [], () => {
				var data = {
					loginName: { text: '' },	
					loginPassword: { text: '' }	
				};	
				ui.formEdit('login', data);
			});
		}
	},


	/**
	 * @method setProgress
	 * @author Basil Fisk
	 * @param {string} item Name of data item that has been loaded.
	 * @description Track the progress of data loading. Show the data when done.
	 */
	setProgress: function (item) {
		system.progress[item] = true;
		if (me.role === 'superuser') {
			if (system.progress.bundle && system.progress.command && system.progress.company && system.progress.connector && system.progress.plan && system.progress.role && system.progress.user) {
				console.log(admin);
				console.log(me);
			}
		}
		else {
			if (system.progress.company && system.progress.plan && system.progress.role && system.progress.user) {
				console.log(admin);
				console.log(me);
			}
		}
	}
};
