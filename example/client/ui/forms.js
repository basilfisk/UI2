var _jsonuiForms = {
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
				"title": "User Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutLoginName": {
				"title": "Login Name",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutEmail": {
				"title": "Email",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutCompany": {
				"title": "Company",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutGroup": {
				"title": "Group",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutRole": {
				"title": "Role",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutClients": {
				"title": "Clients",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutBundles": {
				"title": "Bundles",
				"type": "text",
				"visible": true,
				"edit": false
			},
			"aboutJWT": {
				"title": "JSON Web Token",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"display": {
						"height": 8
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
				},
				"key": "bundleId"
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
			{ "id": "bundleName", "title": "Name" },
			{ "id": "bundleCommand", "title": "Command" },
			{ "id": "bundleConnector", "title": "Connector" },
			{ "id": "bundleCommandVer", "title": "Cmd Ver", "style": "text-align: center;" },
			{ "id": "bundleParameterVer", "title": "Prm Ver", "style": "text-align: center;" }
		]
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
			"bundleName": {
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
			"bundleCommand": {
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"list": "bundleCommandList",
					"display": {
						"select": "single"
					}
				}
			},
			"bundleConnector": {
				"title": "Connector Name",
				"description": "Enter name of connector",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"list": "bundleConnectorList",
					"display": {
						"select": "single"
					}
				}
			},
			"bundleCommandVer": {
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
			"bundleParameterVer": {
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
			"bundleId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"bundleName": {
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
			"bundleCommand": {
				"title": "Command Name",
				"description": "Enter name of command",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"list": "bundleCommandList",
					"display": {
						"select": "single"
					}
				}
			},
			"bundleConnector": {
				"title": "Connector Name",
				"description": "Enter name of connector",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"list": "bundleConnectorList",
					"display": {
						"select": "single"
					}
				}
			},
			"bundleCommandVer": {
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
			"bundleParameterVer": {
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
				},
				"key": "commandId"
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
			{ "id": "commandName", "title": "Name" },
			{ "id": "commandService", "title": "Service" },
			{ "id": "commandLinkCommand", "title": "Command" },
			{ "id": "commandLinkParameter", "title": "Parameters" }
		]
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
			"commandName": {
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
			"commandService": {
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
			"commandId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandName": {
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
			"commandService": {
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
			"ok": {
				"action": "command.editSaveCommand",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
			"commandCommandId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandCommandVersion": {
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
			"commandCommandText": {
				"title": "Command",
				"description": "Enter command",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"height": 20
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
			"ok": {
				"action": "command.editSaveParameters",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
			"commandParametersId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"commandParametersVersion": {
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
			"commandParametersText": {
				"title": "Parameters",
				"description": "Enter parameters",
				"type": "text",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"height": 20
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
				},
				"key": "companyId"
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
			{ "id": "companyName", "title": "Company" },
			{ "id": "select", "title": "Select", "style": "text-align: center;" },
			{ "id": "update", "title": "Update", "style": "text-align: center;" }
		]
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
			"companyName": {
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
			"companyId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"companyName": {
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
			"companyGroupName": {
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
			"companyGroupDesc": {
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
			"companyGroupPlan": {
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
			"ok": {
				"action": "company.groupEdit",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-plus"
				}
			}
		},
		"fields": {
			"companyGroupId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"companyGroupName": {
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
			"companyGroupDesc": {
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
			"companyGroupPlan": {
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
				},
				"key": "connectorId"
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
		]
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
			"connectorName": {
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
			"connectorService": {
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
			"connectorId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"connectorName": {
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
				"type": "id",
				"visible": false,
				"edit": false
			},
			"connectorMongoName": {
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
				"action": "",
				"button": {
					"background": "btn btn-success",
					"class": "glyphicon glyphicon-ok"
				}
			}
		},
		"fields": {
			"text": {
				"title": "",
				"type": "text",
				"visible": true,
				"edit": false
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
				},
				"key": "userId"
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
			{ "id": "userUsername", "title": "User" },
			{ "id": "userGroup", "title": "Group" },
			{ "id": "userRole", "title": "Role" }
		]
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
			"userUsername": {
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
			"userPassword": {
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
			"userGroup": {
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
			"userRole": {
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
			"userClients": {
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
			"userBundles": {
				"title": "Bundles",
				"description": "Select bundles",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "multiple",
						"height": 5
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
			"userId": {
				"type": "id",
				"visible": false,
				"edit": false
			},
			"userUsername": {
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
			"userPassword": {
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
			"userGroup": {
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
			"userRole": {
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
			"userClients": {
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
			"userBundles": {
				"title": "Bundles",
				"description": "Select bundles",
				"type": "list",
				"visible": true,
				"edit": true,
				"options": {
					"display": {
						"select": "multiple",
						"height": 5
					}
				}
			},
			"userJWT": {
				"title": "JSON Web Token",
				"type": "text",
				"visible": true,
				"edit": false,
				"options": {
					"display": {
						"height": 8
					}
				}
			}
		}
	}
};
