var menuDefinitions = {
	"title": {
		"text": "Administration Console",
		"class": "navbar-brand pull-right"
	},
	"top": [
		{
			"id": "admin",
			"access": ["superuser"],
			"menu" : "main",
			"title": "Admin",
			"options": [
				{
					"id" : "companyTable",
					"title": "Companies",
					"action": "company_table_load()",
					"access": ["superuser"],
					"add": "company_add()",
					"columns": ["Company", "Select", "Update", "Delete"]
				}
			]
		},
		{
			"id": "forms",
			"access": ["superuser","manager","user"],
			"menu" : "main",
			"title": "Data",
			"options": [
				{
					"id" : "userTable",
					"title": "Users",
					"action": "user_table_load()",
					"access": ["superuser","manager"],
					"ZZZadd": "user_add()",
					"ZZZcolumns": ["Email Address", "Group", "Role", "Delete"]
				},
				{
					"id" : "connectorTable",
					"title": "Connectors",
					"action": "connector_table_load()",
					"access": ["superuser","manager"],
					"add": "connector_add()",
					"columns": ["Name", "Service", "Delete"]
				},
				{
					"id" : "commandTable",
					"title": "Commands",
					"action": "command.load()",
					"access": ["superuser","manager","user"],
					"ZZZadd": "command_add()",
					"ZZZcolumns": ["Name", "Service", "Command", "Parameters", "Delete"]
				},
				{
					"id" : "bundleTable",
					"title": "Bundles",
					"action": "bundle_table_load()",
					"access": ["superuser","manager","user"],
					"ZZZadd": "bundle_add()",
					"ZZZcolumns": ["Name", "Command", "Connector", "Versions", "Delete"]
				}
			]
		},
		{
			"id": "reports",
			"access": ["superuser","manager","user"],
			"menu" : "main",
			"title": "Reports",
			"options": [
				{
					"id": "reportUsageStats",
					"title": "Usage Statistics",
					"action": "usage_stats('default')",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "reportEventSummary",
					"title": "Event Summary",
					"action": "event_summary('default')",
					"access": ["superuser"]
				},
				{
					"id": "reportRecentTrans",
					"title": "Recent Transactions",
					"action": "recent_trans('default')",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "reportRecentErrors",
					"title": "Recent Errors",
					"action": "recent_errors('default')",
					"access": ["superuser","manager","user"]
				}
			]
		},
		{
			"id": "about",
			"access": ["superuser","manager","user"],
			"menu" : "main",
			"title": "About",
			"options": [
				{
					"id": "about",
					"title": "About",
					"action": "general.aboutShow()",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "logout",
					"title": "Logout",
					"action": "login.init()",
					"access": ["superuser","manager","user"]
				}
			]
		}
	]
};
