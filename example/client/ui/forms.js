var formDefinitions = {
	"about": {
		"title": "Information About the Current User",
		"buttons": {
			"close": true,
		},
		"fields": {
			"aboutUserName": {
				"element": "name",
				"title": "User Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutLoginName": {
				"element": "username",
				"title": "Login Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutEmail": {
				"element": "email",
				"title": "Email",
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
			"aboutBundles": {
				"element": "bundles",
				"title": "Bundles",
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
	},
	"bundleTable": {
		"title": "Bundles",
		"width": 80,
		"buttons": {
			"add": "bundle.add",
			"close": true,
			"delete": {
				"action": "bundle.delete",
				"icon": {
					"type": "trash",
					"colour":"danger"
				},
				"style": "text-align: center;",
				"title": "Delete"
			},
			"edit": {
				"action": "bundle.edit",
				"icon": {
					"type": "pencil",
					"colour":"success"
				},
				"style": "text-align: center;",
				"title": "Edit"
			}
		},
		"columns": [
			{ "id": "name", "title": "Name" },
			{ "id": "command", "title": "Command" },
			{ "id": "connector", "title": "Connector" },
			{ "id": "version", "title": "Versions" }
		]
	},
	"bundleAdd": {
		"title": "Add Bundle",
		"buttons": {
			"add": "bundle.addSave",
			"close": true
		},
		"fields" : {
			"bundleAddName": {
				"element": "name",
				"title": "Bundle Name",
				"description": "Enter name of bundle",
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
			"bundleAddCommand": {
				"element": "command",
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"bundleAddConnector": {
				"element": "connector",
				"title": "Connector Name",
				"description": "Enter name of connector",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"bundleAddCommandVer": {
				"element": "version.cmd",
				"title": "Command Version",
				"description": "Enter command version",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"bundleAddParameterVer": {
				"element": "version.prms",
				"title": "Parameter Version",
				"description": "Enter parameter version",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			}
		}
	},
	"bundleEdit": {
		"title": "Edit Bundle",
		"buttons": {
			"close": true,
			"save": "bundle.editSave"
		},
		"fields" : {
			"bundleEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"bundleEditName": {
				"element": "name",
				"title": "Bundle Name",
				"description": "Enter name of bundle",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			},
			"bundleEditConnector": {
				"element": "connector",
				"title": "Connector Name",
				"description": "Enter name of connector",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"bundleEditCommand": {
				"element": "command",
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"bundleEditCommandVer": {
				"element": "version.cmd",
				"title": "Command Version",
				"description": "Enter command version",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"bundleEditParameterVer": {
				"element": "version.prms",
				"title": "Parameter Version",
				"description": "Enter parameter version",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			}
		}
	},
	"commandTable": {
		"title": "Commands",
		"buttons": {
			"add": "command.add",
			"close": true,
			"delete": {
				"action": "command.delete",
				"icon": {
					"type": "trash",
					"colour":"danger"
				},
				"style": "text-align: center;",
				"title": "Delete"
			},
			"edit": {
				"action": "command.edit",
				"icon": {
					"type": "pencil",
					"colour":"success"
				},
				"style": "text-align: center;",
				"title": "Edit"
			}
		},
		"columns": [
			{ "id": "name", "title": "Name" },
			{ "id": "svc", "title": "Service" },
			{ "id": "cmd", "title": "Command" },
			{ "id": "prm", "title": "Parameters" }
		]
	},
	"commandAdd": {
		"title": "Add Command",
		"buttons": {
			"add": "command.addSave",
			"close": true
		},
		"fields": {
			"commandAddName": {
				"element": "name",
				"title": "Command Name",
				"description": "Enter name of command",
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
			"commandAddService": {
				"element": "service",
				"title": "Service Name",
				"description": "Enter name of service",
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
	},
	"commandEdit": {
		"title": "Edit Command",
		"buttons": {
			"close": true,
			"save": "command.edit"
		},
		"fields": {
			"commandEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditName": {
				"element": "name",
				"title": "Command Name",
				"description": "Enter name of command",
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
			"commandEditService": {
				"element": "service",
				"title": "Service Name",
				"description": "Enter name of service",
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
	},
	"commandEditCommand": {
		"title": "Edit Command Text",
		"buttons": {
			"close": true,
			"delete": true,
			"save": "command.editSaveCommand"
		},
		"fields": {
			"commandEditCommandId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditCommandVersion": {
				"element": "version",
				"title": "Version",
				"description": "Enter version number of command",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"commandEditCommandText": {
				"element": "command",
				"title": "Command",
				"description": "Enter command",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"size": 20
					}
				}
			}
		}
	},
	"commandEditParameters": {
		"title": "Edit Parameters",
		"buttons": {
			"close": true,
			"delete": true,
			"save": "command.editSaveParameters"
		},
		"fields": {
			"commandEditParametersId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandEditParametersVersion": {
				"element": "version",
				"title": "Version",
				"description": "Enter version number of parameters",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1
						}
					}
				}
			},
			"commandEditParametersText": {
				"element": "parameters",
				"title": "Parameters",
				"description": "Enter parameters",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"size": 20
					}
				}
			}
		}
	},
	"companyTable": {
		"title": "Companies",
		"buttons": {
			"add": "company.add",
			"close": true,
			"delete": {
				"action": "company.delete",
				"icon": {
					"type": "trash",
					"colour":"danger"
				},
				"style": "text-align: center;",
				"title": "Delete"
			},
			"edit": {
				"action": "company.edit",
				"icon": {
					"type": "pencil",
					"colour":"success"
				},
				"style": "text-align: center;",
				"title": "Edit"
			}
		},
		"columns": [
			{ "id": "name", "title": "Company" },
			{ "id": "select", "title": "Select", "style": "text-align: center;" },
			{ "id": "update", "title": "Update", "style": "text-align: center;" }
		]
	},
	"companyAdd": {
		"title" : "Add Company",
		"buttons": {
			"add": "company.addSave",
			"close": true
		},
		"fields" : {
			"companyAddName": {
				"element": "name",
				"title": "Company Name",
				"description": "Enter name of company",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			}
		}
	},
	"companyEdit": {
		"title": "Manage Company",
		"buttons": {
			"close": true,
			"save": "company.editSave"
		},
		"fields" : {
			"companyEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"companyEditName": {
				"element": "name",
				"title": "Company Name",
				"description": "Enter name of company",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			}
		}
	},
	"companyGroupAdd": {
		"title" : "Add Company Group",
		"buttons": {
			"add": "company.groupAddSave",
			"close": true
		},
		"fields" : {
			"companyGroupAddName": {
				"element": "groups.name",
				"title": "Group",
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
			"companyGroupAddDesc": {
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
			"companyGroupAddPlan": {
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
	},
	"companyGroupEdit": {
		"title" : "Edit Company Group",
		"buttons": {
			"close": true,
			"save": "company.groupEdit"
		},
		"fields" : {
			"companyGroupEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"companyGroupEditName": {
				"element": "groups.name",
				"title": "Group Name",
				"description": "Enter name of group",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			},
			"companyGroupEditDesc": {
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
			"companyGroupEditPlan": {
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
	},
	"connectorTable": {
		"title": "Connectors",
		"buttons": {
			"add": "connector.add",
			"close": true,
			"delete": {
				"action": "connector.delete",
				"icon": {
					"type": "trash",
					"colour":"danger"
				},
				"style": "text-align: center;",
				"title": "Delete"
			},
			"edit": {
				"action": "connector.edit",
				"icon": {
					"type": "pencil",
					"colour":"success"
				},
				"style": "text-align: center;",
				"title": "Edit"
			}
		},
		"columns": [
			{ "id": "name", "title": "Name" },
			{ "id": "service", "title": "Service" }
		]
	},
	"connectorAdd": {
		"title" : "Add Connector",
		"buttons": {
			"add": "connector.addSave",
			"close": true
		},
		"fields" : {
			"connectorAddName": {
				"element": "name",
				"title": "Connector Name",
				"description": "Enter name of connector",
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
			"connectorAddService": {
				"element": "service",
				"title": "Service",
				"description": "Select type of connector",
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
	},
	"connectorEdit-mongo": {
		"title" : "Edit MongoDB Connector Details",
		"buttons": {
			"close": true,
			"save": "connector.edit"
		},
		"fields" : {
			"connectorMongoId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"connectorMongoName": {
				"element": "name",
				"title": "Connector Name",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaMixed"
					}
				}
			},
			"connectorMongoHost": {
				"element": "config.host",
				"title": "Server Name",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "url"
					}
				}
			},
			"connectorMongoPort": {
				"element": "config.port",
				"title": "Server Port",
				"type": "integer",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "integer",
						"range": {
							"min": 1,
							"max": 65535
						}
					}
				}
			},
			"connectorMongoDatabase": {
				"element": "config.db",
				"title": "Database",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaNumeric"
					}
				}
			}
		}
	},
	"login": {
		"title": "Login to the Console",
		"buttons": {
			"save": "general.loginCheck"
		},
		"fields": {
			"username": {
				"element": "username",
				"title": "User Name",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaNumeric"
					}
				}
			},
			"password": {
				"element": "password",
				"title": "Password",
				"type": "password",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "password"
					}
				}
			}
		}
	},
	"userTable": {
		"title": "Users",
		"buttons": {
			"add": "user.add",
			"close": true,
			"delete": {
				"action": "user.delete",
				"icon": {
					"type": "trash",
					"colour":"danger"
				},
				"style": "text-align: center;",
				"title": "Delete"
			},
			"edit": {
				"action": "user.edit",
				"icon": {
					"type": "pencil",
					"colour":"success"
				},
				"style": "text-align: center;",
				"title": "Edit"
			}
		},
		"columns": [
			{ "id": "user", "title":"User" },
			{ "id": "group", "title":"Group" },
			{ "id": "role", "title":"Role" }
		]
	},
	"userAdd": {
		"title": "Add User",
		"buttons": {
			"add": "user.addSave",
			"close": true
		},
		"fields" : {
			"userAddUsername": {
				"element": "username",
				"title": "User Name",
				"description": "Enter name of user",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaNumeric"
					}
				}
			},
			"userAddPassword": {
				"element": "password",
				"title": "Password",
				"description": "Enter password",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "password"
					}
				}
			},
			"userAddGroup": {
				"element": "group",
				"title": "Group",
				"description": "Select group",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"userAddRole": {
				"element": "role",
				"title": "Role",
				"description": "Select role",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"userAddClients": {
				"element": "clients",
				"title": "Clients",
				"description": "Select clients",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": false,
						"format": "ipv4"
					},
					"content": {
						"type": "array",
						"separator": ","
					}
				}
			},
			"userAddBundles": {
				"element": "bundles",
				"title": "Bundles",
				"description": "Select bundles",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "multiple",
						"size": 5
					}
				}
			}
		}
	},
	"userEdit": {
		"title": "Edit User",
		"buttons": {
			"close": true,
			"save": "user.edit"
		},
		"fields" : {
			"userEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"userEditUsername": {
				"element": "username",
				"title": "User Name",
				"description": "Enter name of user",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "alphaNumeric"
					}
				}
			},
			"userEditPassword": {
				"element": "password",
				"title": "Password",
				"description": "Enter password",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": true,
						"format": "password"
					}
				}
			},
			"userEditGroup": {
				"element": "group",
				"title": "Group",
				"description": "Select group",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"userEditRole": {
				"element": "role",
				"title": "Role",
				"description": "Select role",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"userEditClients": {
				"element": "clients",
				"title": "Clients",
				"description": "Select clients",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"checks": {
						"mandatory": false,
						"format": "ipv4"
					},
					"content": {
						"type": "array",
						"separator": ","
					}
				}
			},
			"userEditBundles": {
				"element": "bundles",
				"title": "Bundles",
				"description": "Select bundles",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "multiple",
						"size": 5
					}
				}
			},
			"userEditJWT": {
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
	}
};
