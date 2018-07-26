var messages = {
	"CMD001" : {
		"type": "error",
		"module": "command",
		"func": "command_edit_save",
		"text": "Couldn't find command with ID '_p1'"
	},
	"CMD002" : {
		"type": "error",
		"module": "command",
		"func": "editSaveParameters",
		"text": "Parameter name '_p1' must be alphanumeric"
	},
	"CMD003" : {
		"type": "error",
		"module": "command",
		"func": "editSaveParameters",
		"text": "Parameter value '_p1' must be alphanumeric"
	},
	"CMN001" : {
		"type": "error",
		"module": "common",
		"func": "apiCall",
		"text": "Failed to connect to the server at _p1:_p2 for command '_p3'"
	},
	"LOG001" : {
		"type": "error",
		"module": "login",
		"func": "readCommands",
		"text": "No commands returned from Admin Server for '_p1'"
	},
	"LOG002" : {
		"type": "error",
		"module": "login",
		"func": "readConnectors",
		"text": "No connectors returned from Admin Server for '_p1'"
	},
	"LOG003" : {
		"type": "error",
		"module": "login",
		"func": "readBundles",
		"text": "No bundles returned from Admin Server for '_p1'"
	},
	"LOG004" : {
		"type": "error",
		"module": "login",
		"func": "readPlans",
		"text": "No plans returned from Admin Server"
	},
	"LOG005" : {
		"type": "error",
		"module": "login",
		"func": "readRoles",
		"text": "No roles returned from Admin Server"
	},
	"LOG006" : {
		"type": "error",
		"module": "login",
		"func": "readUser",
		"text": "Invalid user name or password entered"
	},
	"LOG007" : {
		"type": "error",
		"module": "login",
		"func": "readCompany",
		"text": "No companies returned from Admin Server"
	},
	"REP001" : {
		"type": "error",
		"module": "report",
		"func": "codes",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP002" : {
		"type": "error",
		"module": "report",
		"func": "commands",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP003" : {
		"type": "error",
		"module": "report",
		"func": "functions",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP004" : {
		"type": "error",
		"module": "report",
		"func": "recentErrors",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP005" : {
		"type": "error",
		"module": "report",
		"func": "recentTransactions",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP006" : {
		"type": "error",
		"module": "report",
		"func": "sessions",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP007" : {
		"type": "error",
		"module": "report",
		"func": "usageStats",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP008" : {
		"type": "error",
		"module": "report",
		"func": "eventSummary",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	}
};
