var menuDefinitions = {
	"title": {
		"text": "Administration Console",
		"class": "navbar-brand pull-right"
	},
	"menubar": [
		{
			"id": "admin",
			"menu": "main",
			"title": "Admin",
			"options": [
				{
					"id": "companyTable",
					"title": "Companies",
					"action": "company.load",
					"access": ["superuser"]
				}
			]
		},
		{
			"id": "forms",
			"menu": "main",
			"title": "Data",
			"options": [
				{
					"id": "userTable",
					"title": "Users",
					"action": "user.load",
					"access": ["superuser","manager"]
				},
				{
					"id": "connectorTable",
					"title": "Connectors",
					"action": "connector.load",
					"access": ["superuser","manager"]
				},
				{
					"id": "commandTable",
					"title": "Commands",
					"action": "command.load",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "bundleTable",
					"title": "Bundles",
					"action": "bundle.load",
					"access": ["superuser","manager","user"]
				}
			]
		},
		{
			"id": "reports",
			"menu": "main",
			"title": "Reports",
			"options": [
				{
					"id": "reportUsageStats",
					"title": "Usage Statistics",
					"action": "report.usageStats('default')",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "reportEventSummary",
					"title": "Event Summary",
					"action": "report.eventSummary('default')",
					"access": ["superuser"]
				},
				{
					"id": "reportRecentTrans",
					"title": "Recent Transactions",
					"action": "report.recentTransactions('default')",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "reportRecentErrors",
					"title": "Recent Errors",
					"action": "report.recentErrors('default')",
					"access": ["superuser","manager","user"]
				}
			]
		},
		{
			"id": "about",
			"menu": "main",
			"title": "About",
			"options": [
				{
					"id": "about",
					"title": "About",
					"action": "about.show",
					"access": ["superuser","manager","user"]
				},
				{
					"id": "logout",
					"title": "Logout",
					"action": "login.init",
					"access": ["superuser","manager","user"]
				}
			]
		}
	]
};
