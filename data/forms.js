var structure = {
	forms: {},
	menus: {},
	reports: {},
	tables: {}
};

structure.menus = {
	superuser: [ 
		{
			"name": "Logout",
			"form": "logout"
		},
		{
			"name": "Admin",
			"menu": [
				{
					"name": "Companies",
					"form": "company_table_load()"
				}
			]
		},
		{
			"name": "Data",
			"menu": [
				{
					"name": "Groups",
					"table": "company_group_table_load()"
				},
				{
					"name": "Users",
					"table": "user_table_load()"
				},
				{
					"name": "Connectors",
					"table": "connector_table_load()"
				},
				{
					"name": "Commands",
					"table": "command_table_load()"
				},
				{
					"name": "Packages",
					"table": "package_table_load()"
				}
			]
		},
		{
			"name": "Reports",
			"menu": [
				{
					"name": "Usage",
					"report": "zzz"
				},
				{
					"name": "Summary",
					"report": "zzz"
				},
				{
					"name": "Recent TX",
					"report": "zzz"
				},
				{
					"name": "Errors",
					"report": "zzz"
				}
			]
		},
		{
			"name": "About",
			"form": "aboutForm"
		}
	],
	manager: [ "aboutForm" ],
	user: [ "aboutForm" ]
};

structure.forms.aboutForm = {
	"title": "Current User Information",
	"functions": {
		"pre": "about_show"
	},
	"fields" : {
		"aboutUsername": {
			"element": "username",
			"title": "User Name",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutCompany": {
			"element": "company",
			"title": "Company",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutGroup": {
			"element": "group",
			"title": "Group",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutRole": {
			"element": "role",
			"title": "Role",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutClients": {
			"element": "clients",
			"title": "Clients",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutPackages": {
			"element": "packages",
			"title": "Packages",
			"type": "text",
			"visible": true,
			"edit": false
		},
		"aboutJWT": {
			"element": "jwt",
			"title": "JSON Web Token",
			"type": "text",
			"visible": true,
			"edit": false,
			"options": {
				"display": {
					"size": 8
				}
			}
		}
	}
};

structure.forms.groupForm = {
	"title" : "Group",
	"data": {
		"id": "admin.company._id",
		"name": "data.groups.name",
		"desc": "data.groups.description",
		"plan": "data.groups.plan"
	},
	"functions": {
		"pre": "company_group_add",
		"post": "groupUpsert"
	},
	"buttons": {
		"copy": true,
		"save": true
	},
	"fields" : {
		"id": {
			"element": "groups.id",
			"type": "id",
			"visible": false,
			"edit": false
		},
		"name": {
			"element": "groups.name",
			"title": "Group Name",
			"description": "Enter name of group",
			"type": "text",
			"visible": true,
			"edit": true,
			"options": {
				"checks": {
					"mandatory": true,
					"format": "alphaMixed"
				}
			}
		},
		"description": {
			"element": "groups.description",
			"title": "Description",
			"description": "Enter description of group",
			"type": "text",
			"visible": true,
			"edit": true,
			"options": {
				"checks": {
					"mandatory": true,
					"format": "alphaMixed"
				}
			}
		},
		"plan": {
			"element": "groups.plan",
			"title": "Plan",
			"description": "Select plan",
			"type": "list",
			"visible": true,
			"edit": true,
			"options": {
				"display": {
					"select": "single"
				}
			}
		}
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.forms.ZZZ = {
	"title": "ZZZ",
	"fn": "zzz()",
	"fields" : {
	}
};

structure.tables.commandTable = {
	"title": "Commands",
	"add": "command_add()",
	"columns": ["Name", "Service", "Command", "Parameters"],
	"delete": "command_delete"
};

structure.tables.companyTable = {
	"title": "Select, Update or Delete Company",
	"add": "company_add()",
	"columns": ["Company", "Select", "Update"],
	"delete": "company_delete"
};	

structure.tables.connectorTable = {
	"title": "Connectors",
	"add": "connector_add()",
	"columns": ["Name", "Service"],
	"delete": "connector_delete"
};

structure.tables.groupTable = {
	"title": "Groups",
	"add": "company_group_add()",
	"columns": ["Group", "Description", "Plan"],
	"delete": "company_group_delete"
};

structure.tables.packageTable = {
	"title": "Packages",
	"add": "package_add()",
	"columns": ["Name", "Command", "Connector", "Versions"],
	"delete": "package_delete"
};

structure.tables.userTable = {
	"title": "Users",
	"add": "user_add()",
	"columns": ["Email Address", "Group", "Role"],
	"delete": "user_delete"
};
