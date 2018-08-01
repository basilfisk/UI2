var formDefinitions = {
	"about": {
		"type": "form",
		"title": "Information About the Current User",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			}
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
		"type": "table",
		"title": "Bundles",
		"width": 80,
		"buttons": {
			"add": {
				"form": "bundleAdd",
				"button": {
					"background": "btn btn-success pull-right",
					"class": "glyphicon glyphicon-plus"
				}
			},
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": {
				"action": "bundle.delete",
				"button": {
					"background": "btn btn-danger btn-xs",
					"class": "glyphicon glyphicon-trash"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Delete"
				}
			},
			"edit": {
				"form": "bundleEdit",
				"button": {
					"background": "btn btn-success btn-xs",
					"class": "glyphicon glyphicon-pencil"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Edit"
				}
			}
		},
		"columns": [
			{ "id": "bundleEditName", "title": "Name" },
			{ "id": "bundleEditCommand", "title": "Command" },
			{ "id": "bundleEditConnector", "title": "Connector" },
			{ "id": "bundleEditCommandVer", "title": "Cmd Ver" },
			{ "id": "bundleEditParameterVer", "title": "Prm Ver" }
		],
		"key": "bundleEditId"
	},
	"bundleAdd": {
		"type": "form",
		"title": "Add Bundle",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "bundle.add",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
				"listField": "bundleCommandList",
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
				"listField": "bundleConnectorList",
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
		"type": "form",
		"title": "Edit Bundle",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "bundle.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		},
		"fields": {
			"bundleEditId": {
				"element": "_id",
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
			"bundleEditCommand": {
				"element": "command",
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "list",
				"listField": "bundleCommandList",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "single"
					}
				}
			},
			"bundleEditConnector": {
				"element": "connector",
				"title": "Connector Name",
				"description": "Enter name of connector",
				"type": "list",
				"listField": "bundleConnectorList",
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
		"type": "table",
		"title": "Commands",
		"buttons": {
			"add": {
				"form": "commandAdd",
				"button": {
					"background": "btn btn-success pull-right",
					"class": "glyphicon glyphicon-plus"
				}
			},
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": {
				"action": "command.delete",
				"button": {
					"background": "btn btn-danger btn-xs",
					"class": "glyphicon glyphicon-trash"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Delete"
				}
			},
			"edit": {
				"form": "commandEdit",
				"button": {
					"background": "btn btn-success btn-xs",
					"class": "glyphicon glyphicon-pencil"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Edit"
				}
			}
		},
		"columns": [
			{ "id": "commandEditName", "title": "Name" },
			{ "id": "commandEditService", "title": "Service" },
			{ "id": "cmd", "title": "Command" },
			{ "id": "prm", "title": "Parameters" }
		],
		"key": "commandEditId"
	},
	"commandAdd": {
		"type": "form",
		"title": "Add Command",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "command.add",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
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
		"type": "form",
		"title": "Edit Command",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "command.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
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
		"type": "form",
		"title": "Edit Command Text",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": true,
			"ok": "command.editSaveCommand"
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
		"type": "form",
		"title": "Edit Parameters",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": true,
			"ok": "command.editSaveParameters"
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
		"type": "table",
		"title": "Companies",
		"buttons": {
			"add": {
				"form": "companyAdd",
				"button": {
					"background": "btn btn-success pull-right",
					"class": "glyphicon glyphicon-plus"
				}
			},
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": {
				"action": "company.delete",
				"button": {
					"background": "btn btn-danger btn-xs",
					"class": "glyphicon glyphicon-trash"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Delete"
				}
			},
			"edit": {
				"form": "companyEdit",
				"button": {
					"background": "btn btn-success btn-xs",
					"class": "glyphicon glyphicon-pencil"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Edit"
				}
			}
		},
		"columns": [
			{ "id": "companyEditName", "title": "Company" },
			{ "id": "select", "title": "Select", "style": "text-align: center;" },
			{ "id": "update", "title": "Update", "style": "text-align: center;" }
		],
		"key": "companyEditId"
	},
	"companyAdd": {
		"type": "form",
		"title": "Add Company",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "company.add",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
		"type": "form",
		"title": "Manage Company",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "company.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		},
		"fields": {
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
		"type": "form",
		"title": "Add Company Group",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "company.groupAddSave",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
		"type": "form",
		"title": "Edit Company Group",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": "company.groupEdit"
		},
		"fields": {
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
		"type": "table",
		"title": "Connectors",
		"buttons": {
			"add": {
				"form": "connectorAdd",
				"button": {
					"background": "btn btn-success pull-right",
					"class": "glyphicon glyphicon-plus"
				}
			},
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": {
				"action": "connector.delete",
				"button": {
					"background": "btn btn-danger btn-xs",
					"class": "glyphicon glyphicon-trash"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Delete"
				}
			},
			"edit": {
				"form": "connectorEdit",
				"button": {
					"background": "btn btn-success btn-xs",
					"class": "glyphicon glyphicon-pencil"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Edit"
				}
			}
		},
		"columns": [
			{ "id": "connectorName", "title": "Name" },
			{ "id": "connectorService", "title": "Service" }
		],
		"key": "connectorEditId"
	},
	"connectorAdd": {
		"type": "form",
		"title": "Add Connector",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "connector.addSave",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
	"connectorEdit": {
		"type": "form",
		"title": "Edit MongoDB Connector Details",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "connector.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
			"connectorEditId": {
				"element": "id",
				"type": "id",
				"visible": false,
				"edit": false
			},
			"connectorEditName": {
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
			"connectorService": {
				"element": "service",
				"title": "Connector Service",
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
	"connectorEdit-mongo": {
		"type": "form",
		"title": "Edit MongoDB Connector Details",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "connector.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
		"type": "form",
		"title": "Login to the Console",
		"buttons": {
			"ok": {
				"action": "login.check",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		},
		"fields": {
			"loginName": {
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
			"loginPassword": {
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
	"messageBox": {
		"type": "form",
		"title": "",
		"buttons": {
			"ok": {
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		}
	},
	"userTable": {
		"type": "table",
		"title": "Users",
		"buttons": {
			"add": {
				"form": "userAdd",
				"button": {
					"background": "btn btn-success pull-right",
					"class": "glyphicon glyphicon-plus"
				}
			},
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"delete": {
				"action": "user.delete",
				"button": {
					"background": "btn btn-danger btn-xs",
					"class": "glyphicon glyphicon-trash"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Delete"
				}
			},
			"edit": {
				"form": "userEdit",
				"button": {
					"background": "btn btn-success btn-xs",
					"class": "glyphicon glyphicon-pencil"
				},
				"column": {
					"style": "text-align: center;",
					"title": "Edit"
				}
			}
		},
		"columns": [
			{ "id": "userEditUsername", "title": "User" },
			{ "id": "userEditGroup", "title": "Group" },
			{ "id": "userEditRole", "title": "Role" }
		],
		"key": "userEditId"
	},
	"userAdd": {
		"type": "form",
		"title": "Add User",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "user.add",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
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
		"type": "form",
		"title": "Edit User",
		"buttons": {
			"close": {
				"button": {
					"class": "close",
					"image": "&times;"
				}
			},
			"ok": {
				"action": "user.edit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		},
		"fields": {
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
