/**
 * @file login.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 */

/**
 * @namespace VeryAPI
 * @author Basil Fisk
 * @property {integer} xxx ???????????
 * @description <p>User interface functions.<br>
 * Requirements in index.html for successful operation:<br><ul>
 * <li>A div with an ID for each form</li>
 * <li>Message box element at the end of index.html so that it is displayed above everything else</li>
 * </ul></p>
 */
var veryapi = {
	/**
	 * @method init
	 * @author Basil Fisk
	 * @description Start up function called by 'body onload'.
	 */
	init: function () {
		// Initialize the UI manager and build the menus
		ui.init(formDefinitions, forms.postProcess);

		// Display the login form for the Admin Console
		ui.formEdit('login', {"username":'', "password":''});
	}
};



// *********************************************************************************************
// *********************************************************************************************
//
// VeryAPI
// Copyright 2016 Breato Ltd.
//
// Functions for the client side administration console
//
// *********************************************************************************************
// *********************************************************************************************

// Global variables for holding data, etc.
var lastKey = '',
	me = {},				// Details of the current user
	admin = {};				// Temporary object used to pass data betwwen functions

// Initialise the global data varable
admin.commands = [];		// List of commands the current user has accesss to
admin.company = {};			// Details of the company the current user has selected
admin.companies = [];		// List of companies the current user has accesss to
admin.connectors = [];		// List of connectors the current user has accesss to
admin.packages = [];		// Array of packages for the current company
admin.plans = [];			// Array of plans for all companies
admin.roles = [];	      	// List of roles that can be granted to users
admin.services = [];		// List of services available to all companies
admin.users = [];			// Users the current user has accesss to
admin.usage = {};			// Rolling total of usage data

// Load the services
admin.services.push({ "code":"bash", "name":"Bash Commands" });
admin.services.push({ "code":"file", "name":"File Transfer" });
admin.services.push({ "code":"mail", "name":"E-Mail" });
admin.services.push({ "code":"mongo", "name":"MongoDB" });
admin.services.push({ "code":"pgsql", "name":"PostgreSQL" });
admin.services.push({ "code":"structure", "name":"Structured SQL" });
admin.services.push({ "code":"vsaas", "name":"VisualSaaS" });

// Instance of the JSON editor
var editor = {};

// Global variable holding filters
var filters = {};
filters.codes = {};
filters.codes.limit = 500;
filters.commands = {};
filters.commands.limit = 500;
filters.functions = {};
filters.functions.limit = 500;
filters.reportRecentErrors = {};
filters.reportRecentErrors.limit = 500;
filters.reportRecentTrans = {};
filters.reportRecentTrans.limit = 500;

// Initialise the socket that listens for messages from the Tracker daemon
socket_init();



// ***************************************************************************************
//
//		START-UP AND SOCKET RELATED FUNCTIONS
//
// ***************************************************************************************

// ---------------------------------------------------------------------------------------
// Read commands for the company
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function company_commands_save (action, result) {
	if (result.data !== undefined && result.result.status) {
		// Clear out the existing commands
		admin.commands.splice(0, admin.commands.length);

		// Load commands
        admin.commands = result.data.sort();
	}
	else {
		message('CON001', [admin.company.name]);
	}
}



// ---------------------------------------------------------------------------------------
// Read connectors for the company
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function company_connectors_save (action, result) {
	if (result.data !== undefined && result.result.status) {
		// Clear out the existing connectors
		admin.connectors.splice(0, admin.packages.length);

		// Load connectors
		admin.connectors = result.data.sort();
	}
	else {
		message('CON002', [admin.company.name]);
	}
}



// ---------------------------------------------------------------------------------------
// Read packages for the company
//
// Argument 1 : Action (not relevant)
// Argument 2 : Data object returned by the API call
// ---------------------------------------------------------------------------------------
function company_packages_save (action, result) {
	if (result.data !== undefined && result.result.status) {
		// Clear out the existing packages
		admin.packages.splice(0, admin.packages.length);

		// Load packages
		admin.packages = result.data.sort();
	}
	else {
		message('CON003', [admin.company.name]);
	}
}



// ---------------------------------------------------------------------------------------
// Define the validation tests to be carried out by the UI script
// ---------------------------------------------------------------------------------------
/*
function define_checks () {
    return {
    	"alphaLower": {
    		"pattern": "[a-z]+$",
    		"description": "Lower case alphabetic string"
    	},
    	"alphaMixed": {
    		"pattern": "[a-zA-Z]+$",
    		"description": "Mixed case alphabetic string"
    	},
    	"alphaUpper": {
    		"pattern": "[A-Z]+$",
    		"description": "Upper case alphabetic string"
    	},
    	"alphaNumeric": {
    		"pattern": "^\\w+$",
    		"description": "Alphanumeric string"
    	},
    	"alphaNumericSpecial": {
    		"pattern": "^[\\w \\-_]+$",
    		"description": "Alphanumeric string, including space, hyphen and underscore"
    	},
    	"email": {
    		"pattern": "[a-z0-9!#$%&\"*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
    		"description": "must be an email address"
    	},
    	"filename": {
    		"pattern": "^[\\w\/\\-_]+$",
        	"description": "Alphanumeric string, including forward slash, hyphen and underscore"
    	},
    	"float": {
    		"pattern": "^-*\\d*\\.\\d+$",
    		"description": "Floatng point"
    	},
    	"integer": {
    		"pattern": "^-*\\d+$",
    		"description": "Integer"
    	},
    	"ipv4": {
    		"pattern": "^\\*$|^(?!0)(?!.*\\.$)((1?\\d?\\d|25[0-5]|2[0-4]\\d)(\\.|$)){4}$",
    		"description": "IP v4 address or * for any client"
    	},
    	"password": {
    		"pattern": "^[\\w \\-_]+$",
    		"description": "Password, with alphanumeric, space, hyphen and underscore characters"
    	},
    	"url": {
    		"pattern": "^[\\w\/\\.\\-_]+$",
    		"description": "URL"
    	}
    };
} */



// ---------------------------------------------------------------------------------------
// Load company data returned from database into global variables
//
// Argument 1 : Action to be performed - always 'result'
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function load_company_data (action, result) {
	var data, i;

	// If no company has been selected yet, start with user's company
	if (admin.company.name === undefined) {
		admin.company.name = me.company;
	}

	// Clear out the existing company data
	admin.companies.splice(0, admin.companies.length);

	// Load list of companies and data for user's company
	if (result.data !== undefined && result.result.status) {
		for (i=0; i<result.data.length; i++) {
			// For the super user, load an array with ID and name of all companies
			if (me.role === 'superuser') {
				admin.companies.push(result.data[i]);
			}

			// Load user's company data
			if (admin.company.name === result.data[i].name) {
				admin.company = result.data[i];

				// Read all commands used by the company
				api_call('commandRead', { "filter":admin.company.name }, company_commands_save);

				// Read all commands used by the company
				api_call('connectorRead', { "filter":admin.company.name }, company_connectors_save);

				// Read all packages used by the company
				api_call('packageRead', {"filter":admin.company.name}, company_packages_save);
			}
		}
	}
	else {
		message('CON004', []);
	}
}



// ---------------------------------------------------------------------------------------
// Load plans returned from database. Plans apply to all companies.
//
// Argument 1 : Action to be performed - always 'result'
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function load_plan_list (action, result) {
	if (result.data !== undefined) {
		admin.plans = [];
		for (i=0; i<result.data.length; i++) {
			admin.plans.push({"id":result.data[i].code, "name":result.data[i].name});
		}
	}
	else {
		message('CON005', []);
	}
}



// ---------------------------------------------------------------------------------------
// Load roles returned from database
//
// Argument 1 : Action to be performed - always 'result'
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function load_role_list (action, result) {
	if (result.data !== undefined) {
        admin.roles = result.data;

        // Add role level to user's object
    	for (i=0; i<admin.roles.length; i++) {
    		if (admin.roles[i].code === me.role) {
    			me.level = admin.roles[i].level;
    		}
    	}
	}
	else {
		message('CON006', []);
	}
}



// ---------------------------------------------------------------------------------------
// Load the UI data read from the 'ui' collection
//
// Argument 1 : Action to be performed - 'result' shows data
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function load_ui (action, result) {
    if (result.result.status === 1) {
        ui.loadForms(result.data);
    }
    else {
        show_message('UI001', [result.result.code, result.result.text]);
    }
}



// ---------------------------------------------------------------------------------------
// Process the result of the login check
//
// Argument 1 : Action to be performed - 'result' shows data
// Argument 2 : Result returned from database
// ---------------------------------------------------------------------------------------
function login_read_user (action, result) {
	// Only 1 user record should be returned
	if (result.result.status === 1) {
		// Save the user data
		me = {};
		me.clients = result.data.clients;
		me.company = result.data.company;
		me.group = result.data.group;
		me.jwt = result.data.jwt;
		me.role = result.data.role;
		me.packages = result.data.packages;
		me.username = result.data.username;
		me.groupusers = result.data.groupusers;

		// Read the UI documents
        api_call('uiRead', { "role":me.role }, load_ui);

		// The super user can view all companies, others can only see their company's data
		filter = (me.role === 'superuser') ? 'all' : me.company;
		api_call('companyRead', { "filter":filter }, load_company_data);

		// Load the plan lists from the plan collection (same for all companies)
		api_call('listPlans', {}, load_plan_list);

		// Load the roles lists from the user collection (same for all users)
		api_call('listRoles', {}, load_role_list);
	}
	else {
		message('CON007', [], login);
	}
}



// ---------------------------------------------------------------------------------------------
// Initialise the socket to listen for in-bound updates from the Tracker for the dashboard
// ---------------------------------------------------------------------------------------------
function socket_init () {
	var socket,
		host = adminConfig.tracker.host,
		port = adminConfig.tracker.port;

	// Open a socket to listen for messages from the tracker server
	socket = io.connect(host + ':' + port);
	socket.on('connect', function() {
//		message('CON008', [port]);
	});

	// Errors
	socket.on('error', function(err) {
		message('CON009', [port]);
	});

	// Usage summary record received
	socket.on('usage', function (data) {
		usage_update(data);
	});
}
