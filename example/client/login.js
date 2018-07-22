/**
 * @file login.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

 // Global variables for holding data, etc.
 // 'me' holds details of the current user
var lastKey = '', me = {}, admin, filters, progress;

// Temporary object used to pass data between functions
admin = {
	commands: [],		// List of commands the current user has access to
	company: {},		// Details of the company the current user has selected
	companies: [],		// List of companies the current user has access to
	connectors: [],		// List of connectors the current user has access to
	bundles: [],		// Array of bundles for the current company
	plans: [],			// Array of plans for all companies
	roles: [],	      	// List of roles that can be granted to users
	services: [],		// List of services available to all companies
	users: [],			// Users the current user has access to
	usage: {},			// Rolling total of usage data
};

// Load the services
//admin.services.push({ "code":"bash", "name":"Bash Commands" });
//admin.services.push({ "code":"file", "name":"File Transfer" });
//admin.services.push({ "code":"mail", "name":"E-Mail" });
admin.services.push({ "code":"mongo", "name":"MongoDB" });
//admin.services.push({ "code":"pgsql", "name":"PostgreSQL" });
//admin.services.push({ "code":"structure", "name":"Structured SQL" });
//admin.services.push({ "code":"vsaas", "name":"VisualSaaS" });

// Holds filters applied in forms for persistance
filters = {
	codes: {
		limit: 500
	},
	commands: {
		limit: 500
	},
	functions: {
		limit: 500
	},
	reportRecentErrors: {
		limit: 500
	},
	reportRecentTrans: {
		limit: 500
	}
};

// Status of loading data after login
progress = {
	bundle: false,
	command: false,
	company: false,
	connector: false,
	plan: false,
	role: false,
	user: false
};



/**
 * @namespace Login
 * @author Basil Fisk
 * @description VeryAPI login functions.
 */
var login = {
	/**
	 * @method init
	 * @author Basil Fisk
	 * @description Start up function called by 'body onload'.
	 */
	init: function () {
		// Initialize UI manager with menu and form definitions, post-processing functions
		// and the messages TODO which ones ???????
		ui.init(menuDefinitions, formDefinitions, formFunctions, messages);

		// Display the login form for the Admin Console
		ui.formEdit('login', {"username":'', "password":''});
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
			ui.messageBox('CON003', [admin.company.name]);
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
				// TODO This version of VeryAPI only has 1 company / database
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
			ui.messageBox('CON010', []);
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
			ui.messageBox('CON001', [admin.company.name]);
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
			ui.messageBox('CON002', [admin.company.name]);
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
			ui.messageBox('CON005', []);
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
			ui.messageBox('CON006', []);
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
			me.clients = result.data.clients;
			me.company = result.data.company;
			me.group = result.data.group;
			me.jwt = result.data.jwt;
			me.role = result.data.role;
			me.bundles = result.data.bundles;
			me.username = result.data.username;
			me.groupusers = result.data.groupusers;

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
			ui.messageBox('CON007', [], () => {
				ui.formEdit('login', {"username":'', "password":''});
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
		progress[item] = true;
		if (me.role === 'superuser') {
			if (progress.bundle && progress.command && progress.company && progress.connector && progress.plan && progress.role && progress.user) {
				console.log(admin);
				console.log(me);
			}
		}
		else {
			if (progress.company && progress.role && progress.user) {
				console.log(admin);
				console.log(me);
			}
		}
	}
};