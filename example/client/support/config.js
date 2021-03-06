/**
 * @file config.js
 * @author Basil Fisk
 * @copyright Breato Ltd 2018
 * @description Global variables used across the application.
 */

var me = {};			// Holds details of the current user

// Temporary object used to pass data between functions
var admin = {
	commands: [],		// List of commands the current user has access to
	company: {},		// Details of the company the current user has selected
	companies: [],		// List of companies the current user has access to
	connectors: [],		// List of connectors the current user has access to
	bundles: [],		// Array of bundles for the current company
	plans: [],			// Array of plans for all companies
	roles: [],	      	// List of roles that can be granted to users
	services: [			// List of services available to all companies
		{ "code":"ZZZmail", "name":"E-Mail" },
		{ "code":"mongo", "name":"MongoDB" },
		{ "code":"ZZZpgsql", "name":"PostgreSQL" }
	],
	users: []			// Users the current user has access to
};

// Holds global data:
// api		Location of the API administration server
// filters	Filters applied in forms for persistance
// status	Status of data loading after login
var system = {
	api: {
		host: "https://local.very-api.net",
		port: 19400
	},
	filters: {
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
	},
	progress: {
		bundle: false,
		command: false,
		company: false,
		connector: false,
		plan: false,
		role: false,
		user: false
	}
};	

//var lastKey;			// WHAT WAS/IS THIS USED FOR?
