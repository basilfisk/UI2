var messages = {
	"CON001" : {
		"type": "error",
		"func": "company_commands_save",
		"text": "No commands returned from Admin Server for '_p1'"
	},
	"CON002" : {
		"type": "error",
		"func": "company_connectors_save",
		"text": "No connectors returned from Admin Server for '_p1'"
	},
	"CON003" : {
		"type": "error",
		"func": "company_packages_save",
		"text": "No packages returned from Admin Server for '_p1'"
	},
	"CON004" : {
		"type": "error",
		"func": "load_company_data",
		"text": "No companies returned from Admin Server"
	},
	"CON005" : {
		"type": "error",
		"func": "load_plan_list",
		"text": "No plans returned from Admin Server"
	},
	"CON006" : {
		"type": "error",
		"func": "load_role_list",
		"text": "No roles returned from Admin Server"
	},
	"CON007" : {
		"type": "error",
		"func": "login_read_user",
		"text": "Invalid user name or password entered"
	},
	"CON008" : {
		"type": "error",
		"func": "socket_init",
		"text": "Connected to Tracker live feed on port _p1"
	},
	"CON009" : {
		"type": "error",
		"func": "socket_init",
		"text": "Error connecting to Tracker live feed on port "
	},
	"CON010" : {
		"type": "error",
		"func": "api_call",
		"text": "Failed to connect to the VeryAPI server at _p1:_p2 for command '_p3'"
	},
	"CON011" : {
		"type": "error",
		"func": "api_login",
		"text": "Can't access the VeryAPI server at _p1:_p2.\n\nPlease contact the System Administrator and report this error."
	},
	"FRM001" : {
		"type": "error",
		"func": "command_edit_save",
		"text": "Parameter name '_p1' must be alphanumeric"
	},
	"FRM002" : {
		"type": "error",
		"func": "command_edit_save",
		"text": "Parameter value '_p1' must be alphanumeric"
	},
	"REP001" : {
		"type": "error",
		"func": "codes",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP002" : {
		"type": "error",
		"func": "commands",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP003" : {
		"type": "error",
		"func": "functions",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP004" : {
		"type": "error",
		"func": "recent_errors",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP005" : {
		"type": "error",
		"func": "recent_trans",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP006" : {
		"type": "error",
		"func": "sessions",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP007" : {
		"type": "error",
		"func": "usage_stats",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"REP008" : {
		"type": "error",
		"func": "event_summary",
		"text": "An error was raised during processing.  Please report the error code and reason to your System Administrator.\n\nCode: _p1\nReason: _p2"
	},
	"UI001" : {
		"type": "error",
		"func": "check_mandatory",
		"text": "Field '_p1' is mandatory"
	},
	"UI002" : {
		"type": "error",
		"func": "check_format",
		"text": "Unrecognised validation type '_p1'"
	},
	"UI003" : {
		"type": "error",
		"func": "check_format",
		"text": "Entry in '_p1' should be: _p2"
	},
	"UI004" : {
		"type": "error",
		"func": "check_range",
		"text": "Entry in '_p1' must be _p2"
	}
};
